import React, { useState, useEffect } from 'react';

interface MangekyouSharinganProps {
  isLocked?: boolean;
  progress?: number; // 0 to 1 during calibration
  className?: string;
  size?: number;
}

export const MangekyouSharingan: React.FC<MangekyouSharinganProps> = ({
  isLocked = false,
  progress = 0,
  className = '',
  size = 110,
}) => {
  const [chakraActive, setChakraActive] = useState(false);
  const [chakraFading, setChakraFading] = useState(false);

  useEffect(() => {
    if (isLocked) {
      setChakraActive(true);
      setChakraFading(false);

      // Start slow fade-out of chakra burst after 800ms
      const fadeTimer = setTimeout(() => {
        setChakraFading(true);
      }, 800);

      // Complete dissipation after 4 seconds (matching Itachi sound reverb tail)
      const cleanupTimer = setTimeout(() => {
        setChakraActive(false);
        setChakraFading(false);
      }, 4200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(cleanupTimer);
      };
    } else {
      setChakraActive(false);
      setChakraFading(false);
    }
  }, [isLocked]);

  // Eye fades in smoothly as the face gets calibrated & locked (0.35 -> 1.0)
  const eyeOpacity = isLocked ? 1 : Math.max(0.35, Math.min(1, 0.35 + progress * 0.65));
  const eyeScale = isLocked ? 1.05 : 0.88 + progress * 0.12;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Outer Chakra Burst Aura - Fades in intensely on lock, then slowly fades out with sound */}
      {chakraActive && (
        <>
          {/* Layer 1: Wide Crimson Chakra Blast */}
          <div
            className={`absolute inset-[-20px] rounded-full border-4 border-red-500/80 bg-red-600/15 pointer-events-none transition-all duration-[3000ms] ease-out ${
              chakraFading
                ? 'opacity-0 scale-140 blur-md'
                : 'opacity-100 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.95)] blur-none'
            }`}
          />

          {/* Layer 2: Inner Fiery Chakra Ring */}
          <div
            className={`absolute inset-[-10px] rounded-full border-2 border-amber-500/70 transition-all duration-[2400ms] ease-out ${
              chakraFading
                ? 'opacity-0 scale-130'
                : 'opacity-90 scale-105 shadow-[0_0_35px_rgba(245,158,11,0.8)]'
            }`}
          />
        </>
      )}

      {/* Standard Outer Crimson Tracking Ring */}
      <div
        style={{ opacity: eyeOpacity }}
        className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
          isLocked
            ? 'shadow-[0_0_35px_rgba(239,68,68,0.95)] border-red-500 scale-110 bg-red-950/25'
            : 'shadow-[0_0_18px_rgba(220,38,38,0.4)] border-red-600/70'
        }`}
      />

      {/* Rotating Mangekyou Iris SVG - Fades in as face calibration completes */}
      <div
        style={{
          opacity: eyeOpacity,
          transform: `scale(${eyeScale})`,
          transition: 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            animation: isLocked ? 'none' : 'spin 4s linear infinite',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isLocked ? 'rotate(720deg)' : 'none',
          }}
          className="w-full h-full drop-shadow-[0_0_12px_rgba(185,28,28,0.85)]"
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

      {/* Instant Flash Flare on Lock */}
      {isLocked && !chakraFading && (
        <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
