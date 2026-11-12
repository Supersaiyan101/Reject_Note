import React, { useEffect, useRef, useState, useCallback } from 'react';
import { opticalEngine } from '../utils/opticalEngine';
import type { LiveVitals, CameraState } from '../types';
import { Camera, AlertCircle, RefreshCw, Activity, Heart } from 'lucide-react';
import { MangekyouSharingan } from './MangekyouSharingan';

interface OpticalViewfinderProps {
  onVitalsUpdate?: (vitals: LiveVitals) => void;
  onCameraStateChange?: (state: CameraState) => void;
  isCalibrating?: boolean;
  isLocked?: boolean;
  calibrationProgress?: number;
  showSharingan?: boolean;
}

export const OpticalViewfinder: React.FC<OpticalViewfinderProps> = ({
  onVitalsUpdate,
  onCameraStateChange,
  isCalibrating = false,
  isLocked = false,
  calibrationProgress = 0,
  showSharingan = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraState, setCameraState] = useState<CameraState>('INIT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [vitals, setVitals] = useState<LiveVitals>({
    currentBPM: 72,
    currentBreathingRate: 14,
    stressDeltaBPM: 0,
    waveform: new Array(60).fill(0.5),
    signalQuality: 'SEARCHING',
  });

  const animLoopRef = useRef<number | null>(null);
  const [jumpscareFlash, setJumpscareFlash] = useState(false);

  useEffect(() => {
    if (isLocked) {
      setJumpscareFlash(true);
      const timer = setTimeout(() => {
        setJumpscareFlash(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  // Keep callback references stable to prevent effect re-runs
  const onVitalsUpdateRef = useRef(onVitalsUpdate);
  const onCameraStateChangeRef = useRef(onCameraStateChange);

  useEffect(() => {
    onVitalsUpdateRef.current = onVitalsUpdate;
  }, [onVitalsUpdate]);

  useEffect(() => {
    onCameraStateChangeRef.current = onCameraStateChange;
  }, [onCameraStateChange]);

  const drawWaveform = useCallback((waveform: number[]) => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#22c55e'; // Emerald PPG wave
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    const step = canvas.width / (waveform.length - 1);
    waveform.forEach((val, i) => {
      const y = canvas.height - val * canvas.height;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * step, y);
    });
    ctx.stroke();
  }, []);

  const startVideo = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraState('REQUESTING');
    onCameraStateChangeRef.current?.('REQUESTING');
    setErrorMessage(null);

    try {
      await opticalEngine.startCamera(videoRef.current);
      setCameraState('ACTIVE');
      onCameraStateChangeRef.current?.('ACTIVE');
    } catch (err: unknown) {
      console.warn('Camera request failed:', err);
      setCameraState('ERROR');
      onCameraStateChangeRef.current?.('ERROR');
      const msg = err instanceof Error ? err.message : 'Webcam permission denied or camera not found.';
      setErrorMessage(msg);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      if (!videoRef.current) return;
      setCameraState('REQUESTING');
      onCameraStateChangeRef.current?.('REQUESTING');
      setErrorMessage(null);

      try {
        await opticalEngine.startCamera(videoRef.current);
        if (!isCancelled) {
          setCameraState('ACTIVE');
          onCameraStateChangeRef.current?.('ACTIVE');
        }
      } catch (err: unknown) {
        console.warn('Camera request failed:', err);
        if (!isCancelled) {
          setCameraState('ERROR');
          onCameraStateChangeRef.current?.('ERROR');
          const msg = err instanceof Error ? err.message : 'Webcam permission denied or camera not found.';
          setErrorMessage(msg);
        }
      }
    };

    init();

    // Frame sampling animation loop
    const loop = () => {
      if (isCancelled) return;
      const current = opticalEngine.sampleFrame(72);
      setVitals(current);
      onVitalsUpdateRef.current?.(current);
      drawWaveform(current.waveform);
      animLoopRef.current = requestAnimationFrame(loop);
    };

    animLoopRef.current = requestAnimationFrame(loop);

    return () => {
      isCancelled = true;
      if (animLoopRef.current) cancelAnimationFrame(animLoopRef.current);
      opticalEngine.stopCamera();
    };
  }, [drawWaveform]);

  return (
    <div className="relative rounded-2xl bg-black border-2 border-rose-500/80 p-3 shadow-[0_0_35px_rgba(225,29,72,0.3)] overflow-hidden flex flex-col justify-between">
      {/* Anime Surveillance Viewport with Jumpscare Tremor */}
      <div
        className={`relative w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border transition-all duration-300 flex items-center justify-center ${
          jumpscareFlash
            ? 'animate-jumpscare border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.9)]'
            : isLocked
            ? 'border-red-600/80 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
            : 'border-neutral-800'
        }`}
      >
        {/* Sudden Jumpscare Red Strobe Flash */}
        {jumpscareFlash && (
          <div className="absolute inset-0 bg-red-600/35 mix-blend-color-dodge animate-ping pointer-events-none z-10" />
        )}

        {/* Real Webcam Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transform -scale-x-100 ${
            cameraState === 'ACTIVE' ? 'opacity-100' : 'opacity-20'
          }`}
        />

        {/* Fallback Simulation Notice if Camera Blocked */}
        {cameraState === 'ERROR' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/85 backdrop-blur-sm z-20">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="text-xs font-mono text-white font-bold mb-1">
              Camera Access Denied or In Use
            </p>
            <p className="text-[11px] font-mono text-neutral-400 max-w-xs mb-3">
              {errorMessage || 'Running in Optical Simulation Mode.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={startVideo}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
              <button
                onClick={() => {
                  setCameraState('ACTIVE');
                  onCameraStateChangeRef.current?.('ACTIVE');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/70 text-xs font-mono text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Bypass with Simulation</span>
              </button>
            </div>
          </div>
        )}

        {/* Anime Viewfinder Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          {/* Top brackets */}
          <div className="flex justify-between items-start">
            <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/60 font-mono text-[10px] text-cyan-300">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>{cameraState === 'ACTIVE' ? 'OPTICAL TRACK: LOCK' : 'SIMULATION MODE'}</span>
            </div>
            <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          </div>

          {/* Center Viewfinder Reticle Overlay */}
          <div className="self-center relative flex flex-col items-center justify-center my-auto">
            {/* Reticle Boundary Frame */}
            <div
              className={`w-44 h-52 rounded-[2rem] border transition-all duration-300 flex flex-col items-center justify-center relative ${
                showSharingan && jumpscareFlash
                  ? 'border-red-400 scale-110 shadow-[0_0_55px_rgba(239,68,68,1)] bg-red-950/40'
                  : showSharingan && isLocked
                  ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] bg-red-950/20'
                  : 'border-cyan-500/50 bg-black/10'
              }`}
            >
              {/* Corner Focus Ticks */}
              <div
                className={`absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 transition-colors ${
                  showSharingan && isLocked ? 'border-red-500' : 'border-cyan-400/80'
                }`}
              />
              <div
                className={`absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 transition-colors ${
                  showSharingan && isLocked ? 'border-red-500' : 'border-cyan-400/80'
                }`}
              />
              <div
                className={`absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 transition-colors ${
                  showSharingan && isLocked ? 'border-red-500' : 'border-cyan-400/80'
                }`}
              />
              <div
                className={`absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 transition-colors ${
                  showSharingan && isLocked ? 'border-red-500' : 'border-cyan-400/80'
                }`}
              />

              {/* Mangekyou Sharingan Eye - Gated by showSharingan */}
              {showSharingan && (
                <MangekyouSharingan
                  isLocked={isLocked}
                  progress={calibrationProgress}
                  size={isLocked ? 112 : 98}
                  className="transition-transform duration-500"
                />
              )}

              {/* Status Badge */}
              <div className="mt-2.5">
                <span
                  className={`font-mono text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border backdrop-blur-md transition-all ${
                    showSharingan && isLocked
                      ? 'bg-red-950 text-red-200 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                      : cameraState !== 'ACTIVE'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-600/70'
                      : isCalibrating
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                      : 'bg-black/80 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {showSharingan && isLocked
                    ? 'MANGEKYOU LOCKED'
                    : cameraState !== 'ACTIVE'
                    ? 'WAITING FOR CAMERA'
                    : isCalibrating
                    ? `CALIBRATING BASELINE (${Math.round(calibrationProgress * 100)}%)`
                    : 'PRESAGE SENSORS ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom brackets */}
          <div className="flex justify-between items-end">
            <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="font-mono text-[10px] text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>rPPG CAPTURE 30 FPS</span>
            </span>
            <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          </div>
        </div>
      </div>

      {/* Real-time PPG Pulse Waveform Graph */}
      <div className="mt-3 p-3 rounded-xl bg-neutral-950/90 border border-neutral-800">
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Live PPG Pulse Waveform:
          </span>
          <span className="text-emerald-400 font-bold">
            {vitals.currentBPM} BPM
          </span>
        </div>

        <canvas
          ref={waveformCanvasRef}
          width={320}
          height={40}
          className="w-full h-10 rounded bg-black/60 border border-neutral-900"
        />

        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
          <span>Respiration: <strong className="text-cyan-400">{vitals.currentBreathingRate} RPM</strong></span>
          <span>Signal: <strong className="text-emerald-400">{vitals.signalQuality}</strong></span>
        </div>
      </div>
    </div>
  );
};

