import React from 'react';

interface MangekyouSharinganProps {
  isLocked?: boolean;
  className?: string;
  size?: number;
}

export const MangekyouSharingan: React.FC<MangekyouSharinganProps> = ({
  isLocked = false,
  className = '',
  size = 110,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Outer Crimson Aura Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
          isLocked
            ? 'shadow-[0_0_35px_rgba(239,68,68,0.95)] border-red-500 scale-110 bg-red-950/20'
            : 'shadow-[0_0_18px_rgba(220,38,38,0.4)] border-red-600/70 animate-pulse'
        }`}
      />

      {/* Rotating Mangekyou Iris SVG */}
      <svg
        viewBox="0 0 100 100"
        style={{
          animation: isLocked ? 'none' : 'spin 4s linear infinite',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isLocked ? 'rotate(720deg) scale(1.05)' : 'none',
        }}
        className="w-full h-full drop-shadow-[0_0_10px_rgba(185,28,28,0.8)]"
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

      {/* Instant Flash Wave on Lock */}
      {isLocked && (
        <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
