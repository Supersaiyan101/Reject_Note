import React, { useState, useEffect } from 'react';
import type { CandidateDossier, InquisitorProfile, BaselineCalibration, LiveVitals, CameraState } from '../types';
import { OpticalViewfinder } from './OpticalViewfinder';
import { SecurityWaiver } from './SecurityWaiver';
import { opticalEngine } from '../utils/opticalEngine';
import { soundFX } from '../utils/sfx';
import { ShieldCheck, Heart, Wind, ArrowRight, CheckCircle2, Volume2, Camera } from 'lucide-react';

interface CalibrationStageProps {
  dossier: CandidateDossier;
  inquisitor: InquisitorProfile;
  onCalibrationComplete: (calibration: BaselineCalibration) => void;
  onBack: () => void;
}

export const CalibrationStage: React.FC<CalibrationStageProps> = ({
  dossier,
  inquisitor,
  onCalibrationComplete,
  onBack,
}) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>('INIT');
  const [countdown, setCountdown] = useState<number>(10);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [measuredBPM, setMeasuredBPM] = useState<number>(72);
  const [measuredRPM, setMeasuredRPM] = useState<number>(14);

  // Trigger calibration countdown ONLY when consent is granted AND camera is ACTIVE
  useEffect(() => {
    if (!hasConsented || isLocked) return;

    if (cameraState !== 'ACTIVE') {
      setIsCalibrating(false);
      return;
    }

    setIsCalibrating(true);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCalibrating(false);
          setIsLocked(true);
          soundFX.playMangekyouLock();
          return 0;
        }
        soundFX.playHeartbeat();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasConsented, cameraState, isLocked]);

  const calibrationProgress = Math.max(0, Math.min(1, (10 - countdown) / 10));

  const lastVitalsUpdateRef = React.useRef<number>(0);
  const handleVitalsUpdate = (vitals: LiveVitals) => {
    const now = Date.now();
    if (now - lastVitalsUpdateRef.current > 350) {
      lastVitalsUpdateRef.current = now;
      if (isCalibrating) {
        setMeasuredBPM(vitals.currentBPM);
        setMeasuredRPM(vitals.currentBreathingRate);
      }
    }
  };

  const handleFinish = () => {
    soundFX.playDramaticSting();
    onCalibrationComplete({
      restingBPM: measuredBPM,
      restingBreathingRate: measuredRPM,
      calibratedAt: new Date().toISOString(),
      opticalMode: opticalEngine.getOpticalMode(),
      isReady: true,
    });
  };

  // Step 1: Show Security Waiver first if consent not yet signed
  if (!hasConsented) {
    return (
      <SecurityWaiver
        candidateName={dossier.name}
        onConsentAndProceed={() => setHasConsented(true)}
        onBack={onBack}
      />
    );
  }

  // Step 2: Show Live Viewfinder & 5-Second Calibration
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="relative rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-rose-500/70 p-6 md:p-8 shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-emerald-500 flex items-center justify-center text-emerald-400 font-serif font-black text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              測
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] font-bold text-sm tracking-wider text-white">
                  OPTICAL BASELINE CALIBRATION
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  {isLocked ? 'CALIBRATION LOCKED' : 'CALIBRATING'}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Subject: <strong className="text-rose-400">{dossier.name}</strong> // Examiner: <strong className="text-white">{inquisitor.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mode: {opticalEngine.getOpticalMode()}</span>
          </div>
        </div>

        {/* Viewfinder + Calibration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
          {/* Left: Real Webcam Viewfinder with Mangekyou Reticle */}
          <div className="lg:col-span-6">
            <OpticalViewfinder
              onVitalsUpdate={handleVitalsUpdate}
              onCameraStateChange={setCameraState}
              isCalibrating={isCalibrating}
              isLocked={isLocked}
              calibrationProgress={calibrationProgress}
            />
          </div>

          {/* Right: 10-Second Calibration Status & Baseline Lock */}
          <div className="lg:col-span-6 space-y-5">
            {/* Countdown / Status Box */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              {!isLocked ? (
                <>
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    {cameraState === 'ACTIVE' ? (
                      <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
                        Measuring Resting Baseline (Hold Still)
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        Camera Activation Required
                      </span>
                    )}
                  </div>

                  {/* Giant Countdown Number */}
                  <div className="font-['Orbitron'] text-6xl font-black text-white my-3 animate-pulse">
                    00:{countdown < 10 ? `0${countdown}` : countdown}
                  </div>

                  <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto mb-4">
                    {cameraState === 'ACTIVE'
                      ? 'Position your face inside the Mangekyou Sharingan reticle. Keep still for 10 seconds to establish resting pulse & breathing baseline.'
                      : 'Webcam stream is awaiting permission. Calibration will start automatically once camera feed is active.'}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${calibrationProgress * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-widest block">
                    Calibration Complete
                  </span>

                  <h3 className="font-['Orbitron'] text-2xl font-black text-white my-1">
                    RESTING BASELINE SECURED
                  </h3>

                  <p className="text-xs font-mono text-neutral-300 max-w-xs mx-auto">
                    Resting vitals locked into L&apos;s trial matrix. Deviations during interrogation will trigger bluff alarms.
                  </p>

                  <button
                    onClick={() => soundFX.playMangekyouLock()}
                    title="Replay Mangekyou Sharingan activation sound"
                    className="mt-3.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-red-500/50 hover:border-red-400 text-[11px] font-mono text-neutral-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Replay Sharingan Sound</span>
                  </button>
                </>
              )}
            </div>

            {/* Baseline Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Resting Pulse Card */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-rose-500/40 text-center">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Resting Heart Rate:
                </span>
                <div className="font-['Orbitron'] text-3xl font-black text-rose-400">
                  {measuredBPM} <span className="text-xs text-neutral-500 font-normal">BPM</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                  {isLocked ? '✓ Baseline Locked' : 'Calibrating...'}
                </span>
              </div>

              {/* Resting Breathing Card */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-cyan-500/40 text-center">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1 mb-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  Resting Respiration:
                </span>
                <div className="font-['Orbitron'] text-3xl font-black text-cyan-400">
                  {measuredRPM} <span className="text-xs text-neutral-500 font-normal">RPM</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                  {isLocked ? '✓ Baseline Locked' : 'Calibrating...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-neutral-400">
            {isLocked ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Vitals Ready for L&apos;s Interrogation
              </span>
            ) : (
              <span className="text-amber-400">Calibrating sensors... please remain steady</span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!isLocked}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-['Orbitron'] font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all animate-pulse-glow"
          >
            <span>ENTER L&apos;S TRIAL CHAMBER</span>
            <ArrowRight className="w-5 h-5 text-amber-300 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};

