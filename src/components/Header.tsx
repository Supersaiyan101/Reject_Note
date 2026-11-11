import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck, Zap, Activity } from 'lucide-react';
import { soundFX } from '../utils/sfx';

export const Header: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFX.playScouterBeep();
    }
  };

  return (
    <header className="w-full border-b border-neutral-800/80 bg-[#0a0a0c]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 border border-rose-500/40 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
            <span className="font-serif text-rose-500 text-xl font-black">死</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel_Decorative'] font-bold text-lg md:text-xl text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                REJECT NOTE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 font-semibold tracking-wider">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 hidden sm:block">
              Presage SmartSpectra Optical Polygraph // Anime Edition
            </p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>OPTICAL SENSORS STANDBY</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCOUTER: ONLINE</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>100% LOCAL PROCESSING</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Anime SFX' : 'Mute Anime SFX'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700 hover:border-rose-500/60 text-neutral-300 hover:text-white transition-all text-xs font-mono cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline text-neutral-500">SFX OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline text-rose-300">SFX ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
