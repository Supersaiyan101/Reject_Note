import React, { useEffect, useRef, useState, useCallback } from 'react';
import { opticalEngine } from '../utils/opticalEngine';
import type { LiveVitals, CameraState } from '../types';
import { Camera, AlertCircle, RefreshCw, Activity, Heart } from 'lucide-react';

interface OpticalViewfinderProps {
  onVitalsUpdate?: (vitals: LiveVitals) => void;
  isCalibrating?: boolean;
}

export const OpticalViewfinder: React.FC<OpticalViewfinderProps> = ({
  onVitalsUpdate,
  isCalibrating = false,
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
    setErrorMessage(null);

    try {
      await opticalEngine.startCamera(videoRef.current);
      setCameraState('ACTIVE');
    } catch (err: unknown) {
      console.warn('Camera request failed:', err);
      setCameraState('ERROR');
      const msg = err instanceof Error ? err.message : 'Webcam permission denied or camera not found.';
      setErrorMessage(msg);
    }
  }, []);

  useEffect(() => {
    startVideo();

    // Frame sampling animation loop
    const loop = () => {
      const current = opticalEngine.sampleFrame(72);
      setVitals(current);
      onVitalsUpdate?.(current);
      drawWaveform(current.waveform);
      animLoopRef.current = requestAnimationFrame(loop);
    };

    animLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (animLoopRef.current) cancelAnimationFrame(animLoopRef.current);
      opticalEngine.stopCamera();
    };
  }, [drawWaveform, onVitalsUpdate, startVideo]);

  return (
    <div className="relative rounded-2xl bg-black border-2 border-rose-500/80 p-3 shadow-[0_0_35px_rgba(225,29,72,0.3)] overflow-hidden flex flex-col justify-between">
      {/* Anime Surveillance Viewport */}
      <div className="relative w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
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
            <button
              onClick={startVideo}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
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

          {/* Center Face Alignment Box */}
          <div className="self-center w-36 h-44 rounded-2xl border border-dashed border-rose-500/60 flex items-center justify-center animate-pulse">
            <span className="font-mono text-[9px] text-rose-400/80 bg-black/80 px-2 py-0.5 rounded border border-rose-900/60">
              {isCalibrating ? 'LOCKING BASELINE' : 'ALIGN FACE'}
            </span>
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
