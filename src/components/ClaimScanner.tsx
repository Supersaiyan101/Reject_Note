import React, { useEffect, useState } from 'react';
import { soundFX } from '../utils/sfx';

interface ClaimScannerProps {
  candidateName: string;
  onScanComplete: () => void;
}

const SCAN_MESSAGES = [
  'INITIALIZING ANIME SCOUTER OPTICAL GRID...',
  'CALCULATING TECH JARGON DENSITY...',
  'CROSS-REFERENCING WITH NPA TASK FORCE DATABASE...',
  'ANALYZING POTATO CHIP RESIDUE & 0ms LATENCY...',
  'WARNING: BUZZWORD COUNT HAS EXCEEDED 9,000!!!',
  'PARSING CANDIDATE PROFILE FOR L...',
];

export const ClaimScanner: React.FC<ClaimScannerProps> = ({
  candidateName,
  onScanComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [powerReading, setPowerReading] = useState(1050);

  useEffect(() => {
    soundFX.playLaserHum();

    // Increment power level counter rapidly
    const powerInterval = setInterval(() => {
      soundFX.playScouterBeep();
      setPowerReading((prev) => {
        if (prev >= 9001) return 9001;
        return prev + Math.floor(Math.random() * 1200) + 400;
      });
    }, 180);

    // Step through messages
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SCAN_MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    const finishTimeout = setTimeout(() => {
      clearInterval(powerInterval);
      clearInterval(stepInterval);
      soundFX.playDramaticSting();
      onScanComplete();
    }, 2800);

    return () => {
      clearInterval(powerInterval);
      clearInterval(stepInterval);
      clearTimeout(finishTimeout);
    };
  }, [onScanComplete]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl bg-neutral-950 border-2 border-rose-500/80 p-8 shadow-[0_0_50px_rgba(225,29,72,0.4)] overflow-hidden">
        {/* Animated Red Laser Beam */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-laser z-20" />

        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1217_1px,transparent_1px),linear-gradient(to_bottom,#1f1217_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Scouter HUD Readout */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 font-['Orbitron'] text-xs font-bold tracking-widest mb-6 animate-scouter">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
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

