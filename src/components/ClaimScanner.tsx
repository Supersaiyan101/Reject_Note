import React, { useEffect, useState } from 'react';
import { soundFX } from '../utils/sfx';

interface ClaimScannerProps {
  candidateName: string;
  onScanComplete: () => void;
}

const SCAN_MESSAGES = [
  'INITIALIZING ANIME SCOUTER OPTICAL GRID...',
  'CALCULATING TECH JARGON DENSITY...',
  'GOLDEN KI SURGING IN CANDIDATE RESUME...',
  'CROSS REFERENCING NPA TASK FORCE DATABASE...',
  'POWER SIGNATURE SHATTERING HARDWARE LIMITS...',
  'WARNING: BUZZWORD COUNT HAS EXCEEDED 9,000!!!',
  'SUPER SAIYAN TECH AUDIT COMPLETE FOR L...',
];

export const ClaimScanner: React.FC<ClaimScannerProps> = ({
  candidateName,
  onScanComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [powerReading, setPowerReading] = useState(1050);

  useEffect(() => {
    // Trigger Super Saiyan Ki Charge audio aura
    soundFX.playSuperSaiyanCharge(4.2);

    // Increment power level counter smoothly across 4.2 seconds
    const powerInterval = setInterval(() => {
      soundFX.playScouterBeep();
      setPowerReading((prev) => {
        if (prev >= 9001) return 9001;
        return prev + Math.floor(Math.random() * 450) + 260;
      });
    }, 140);

    // Step through messages (every 580ms across 4.2s)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SCAN_MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 580);

    const finishTimeout = setTimeout(() => {
      clearInterval(powerInterval);
      clearInterval(stepInterval);
      soundFX.playDramaticSting();
      onScanComplete();
    }, 4200);

    return () => {
      clearInterval(powerInterval);
      clearInterval(stepInterval);
      clearTimeout(finishTimeout);
    };
  }, [onScanComplete]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className={`relative rounded-2xl bg-neutral-950 p-8 overflow-hidden transition-all duration-500 ${
        powerReading >= 9001
          ? 'border-2 border-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.6)] animate-pulse'
          : powerReading >= 5000
          ? 'border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.4)]'
          : 'border-2 border-rose-500/80 shadow-[0_0_50px_rgba(225,29,72,0.4)]'
      }`}>
        {/* Animated Red / Gold Laser Beam */}
        <div className={`absolute left-0 right-0 h-1 shadow-[0_0_15px] animate-laser z-20 ${
          powerReading >= 8000
            ? 'bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-amber-400'
            : 'bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-rose-500'
        }`} />

        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1217_1px,transparent_1px),linear-gradient(to_bottom,#1f1217_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Scouter HUD Readout */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-['Orbitron'] text-xs font-bold tracking-widest mb-6 transition-all duration-300 ${
            powerReading >= 9001
              ? 'bg-amber-950/80 border-2 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-bounce'
              : 'bg-emerald-950 border border-emerald-500 text-emerald-400 animate-scouter'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${powerReading >= 9001 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span>SCOUTER POWER LEVEL: {powerReading.toLocaleString()}</span>
          </div>

          <h3 className="font-['Bangers'] text-3xl md:text-4xl text-white tracking-wider mb-2">
            SCANNING APPLICATION FOR: <span className="text-rose-500">{candidateName}</span>
          </h3>

          <p className="font-mono text-xs md:text-sm text-neutral-400 max-w-md h-8 flex items-center justify-center">
            {SCAN_MESSAGES[currentStep]}
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-neutral-900 h-2.5 rounded-full mt-6 overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-300"
              style={{
                width: `${Math.min(100, ((currentStep + 1) / SCAN_MESSAGES.length) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-md text-[10px] font-mono text-neutral-500 mt-2">
            <span>MEM_ADDR: 0xDEADBEEF</span>
            <span>CALIBRATING OPTICAL SENSORS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

