import React, { useState, useEffect } from 'react';

interface MangekyouSharinganProps {
  isLocked?: boolean;
  progress?: number; // 0 to 1 during calibration
  className?: string;
  size?: number;
}

export const MangekyouSharingan: React.FC<MangekyouSharinganProps> = ({
  isLocked = false,
  className = '',
  size = 110,
}) => {
  const [jumpscareStage, setJumpscareStage] = useState<'IDLE' | 'JUMP' | 'FADING'>('IDLE');

  useEffect(() => {
    if (isLocked) {
      // Step 1: Sudden JUMPSCARE explosion at the exact moment face locks in
      setJumpscareStage('JUMP');

      // Step 2: After 650ms impact, start slow creepy dissipation
      const fadeTimer = setTimeout(() => {
        setJumpscareStage('FADING');
      }, 650);

      // Step 3: Complete dissipation after 4 seconds (matching Itachi sound reverb tail)
      const cleanupTimer = setTimeout(() => {
        setJumpscareStage('IDLE');
      }, 4200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(cleanupTimer);
      };
    } else {
      setJumpscareStage('IDLE');
    }
  }, [isLocked]);

  // DURING CALIBRATION: Zero red chakra. Clean, neutral optical alignment crosshair.
  if (!isLocked) {
    return (
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center select-none pointer-events-none"
      >
        <div className="w-20 h-20 rounded-full border border-dashed border-cyan-500/40 flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
        </div>
      </div>
    );
  }

  // AT LOCK: SUDDEN JUMPSCARE POP-OUT!
  const eyeScale = jumpscareStage === 'JUMP' ? 1.45 : 1.05;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* JUMPSCARE SUDDEN CHAKRA EXPLOSION */}
      {jumpscareStage !== 'IDLE' && (
        <>
          {/* Layer 1: Massive Outer Crimson Shockwave Flame */}
          <div
            className={`absolute inset-[-30px] rounded-full border-4 border-red-500 bg-red-600/30 pointer-events-none transition-all duration-[3500ms] ease-out ${
              jumpscareStage === 'JUMP'
                ? 'opacity-100 scale-140 shadow-[0_0_80px_rgba(239,68,68,1)] animate-chakra-ignite blur-none'
                : 'opacity-0 scale-180 blur-xl'
            }`}
          />

          {/* Layer 2: Inner Blazing Amber-Red Core Fire */}
          <div
            className={`absolute inset-[-14px] rounded-full border-2 border-amber-400 transition-all duration-[2800ms] ease-out ${
              jumpscareStage === 'JUMP'
                ? 'opacity-100 scale-120 shadow-[0_0_45px_rgba(251,191,36,0.95)]'
                : 'opacity-0 scale-150'
            }`}
          />

          {/* Layer 3: Red Lightning Chakra Crackle Flares */}
          {jumpscareStage === 'JUMP' && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] animate-ping pointer-events-none text-red-500"
            >
              <path d="M 50 5 L 48 30 L 53 35 L 50 50" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              <path d="M 95 50 L 70 48 L 65 53 L 50 50" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <path d="M 50 95 L 52 70 L 47 65 L 50 50" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              <path d="M 5 50 L 30 52 L 35 47 L 50 50" stroke="#f59e0b" strokeWidth="2" fill="none" />
            </svg>
          )}
        </>
      )}

      {/* Outer Crimson Reticle Ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-red-500 scale-110 bg-red-950/30 shadow-[0_0_35px_rgba(239,68,68,0.95)] transition-all duration-500"
      />

      {/* Rotating Mangekyou Iris SVG - Jumpscares forward at lock */}
      <div
        style={{
          transform: `scale(${eyeScale})`,
          transition:
            jumpscareStage === 'JUMP'
              ? 'transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
              : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            animation: 'none',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: 'rotate(720deg)',
          }}
          className={`w-full h-full transition-all duration-300 ${
            jumpscareStage === 'JUMP'
              ? 'drop-shadow-[0_0_30px_rgba(239,68,68,1)] filter brightness-125'
              : 'drop-shadow-[0_0_12px_rgba(185,28,28,0.85)]'
          }`}
        >
          {/* Red Iris Base */}
          <circle cx="50" cy="50" r="46" fill="#b91c1c" stroke="#450a0a" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" fill="#dc2626" opacity="0.95" />

          {/* Outer Ring Accent */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#050505" strokeWidth="1.5" />

          {/* Itachi's 3 Curved Mangekyou Pinwheel Blades */}
          <g fill="#050505">
            {/* Blade 1 (0 deg) */}
            <path d="M 50 50 C 47 40 50 25 64 12 C 55 22 55 35 60 44 C 56 47 53 48 50 50 Z" />
            <path d="M 50 50 C 53 38 62 20 74 14 C 62 26 58 38 54 48 Z" />

            {/* Blade 2 (120 deg) */}
            <g transform="rotate(120 50 50)">
              <path d="M 50 50 C 47 40 50 25 64 12 C 55 22 55 35 60 44 C 56 47 53 48 50 50 Z" />
              <path d="M 50 50 C 53 38 62 20 74 14 C 62 26 58 38 54 48 Z" />
            </g>

            {/* Blade 3 (240 deg) */}
            <g transform="rotate(240 50 50)">
              <path d="M 50 50 C 47 40 50 25 64 12 C 55 22 55 35 60 44 C 56 47 53 48 50 50 Z" />
              <path d="M 50 50 C 53 38 62 20 74 14 C 62 26 58 38 54 48 Z" />
            </g>
          </g>

          {/* Central Pupil Connection Ring */}
          <circle cx="50" cy="50" r="10" fill="#050505" />
          <circle cx="50" cy="50" r="4" fill="#171717" />
          <circle cx="50" cy="50" r="1.5" fill="#fca5a5" opacity="0.9" />
        </svg>
      </div>

      {/* Screen Shudder Ping Flare on Lock */}
      {jumpscareStage === 'JUMP' && (
        <div className="absolute inset-[-15px] rounded-full border-4 border-red-500 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
