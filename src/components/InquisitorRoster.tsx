import React, { useState } from 'react';
import type { InquisitorProfile } from '../types';
import { INQUISITORS } from '../data/inquisitors';
import { Lock, HelpCircle, AlertOctagon, Skull } from 'lucide-react';
import { soundFX } from '../utils/sfx';

interface InquisitorRosterProps {
  candidateName: string;
  selectedId: string;
  onSelectInquisitor: (inquisitor: InquisitorProfile) => void;
}

export const InquisitorRoster: React.FC<InquisitorRosterProps> = ({
  candidateName,
  selectedId,
  onSelectInquisitor,
}) => {
  const [hoveredMystery, setHoveredMystery] = useState<string | null>(null);

  const handleCardClick = (inquisitor: InquisitorProfile) => {
    if (!inquisitor.isUnlocked) {
      soundFX.playScouterBeep();
      return;
    }
    soundFX.playClick();
    onSelectInquisitor(inquisitor);
  };

  const handleMysteryHover = (inquisitor: InquisitorProfile) => {
    if (!inquisitor.isUnlocked) {
      setHoveredMystery(inquisitor.id);
      soundFX.playScouterBeep();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-4 pb-6">
      {/* Target Candidate Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 font-serif font-black text-lg">
            判
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              Active Candidate Under Review
            </span>
            <span className="font-['Space_Grotesk'] font-bold text-white text-base">
              {candidateName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>SCOUTER CALIBRATED // SELECT EXAMINER</span>
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {INQUISITORS.map((inq) => {
          const isSelected = inq.id === selectedId;

          // Card 1: L (Unlocked Flagship)
          if (inq.isUnlocked) {
            return (
              <div
                key={inq.id}
                onClick={() => handleCardClick(inq)}
                onMouseEnter={() => soundFX.playScouterBeep()}
                className={`relative group rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-950/40 via-neutral-900 to-black border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.4)]'
                    : 'bg-neutral-950/90 border-neutral-800 hover:border-rose-500/70 hover:shadow-[0_0_20px_rgba(225,29,72,0.25)]'
                }`}
              >
                {/* Subtle active glow indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-600/90 text-white font-mono text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div>
                  {/* Avatar Icon */}
                  <div className="w-24 h-24 mx-auto my-2 rounded-2xl bg-neutral-950 border-2 border-rose-500/50 group-hover:border-rose-400 overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all transform group-hover:scale-105">
                    <img
                      src="/l-character.png"
                      alt="L"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Character Info */}
                  <div className="text-center mt-3 mb-4">
                    <h3 className="font-['Cinzel_Decorative'] text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
                      {inq.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-rose-400 tracking-wider mt-0.5">
                      {inq.title}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400 mt-1">
                      Origin: {inq.origin}
                    </p>
                  </div>

                  {/* Quote preview */}
                  <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-300 font-mono italic leading-relaxed text-center">
                    &ldquo;{inq.quote}&rdquo;
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">Difficulty:</span>
                  <span className="text-rose-400 font-bold tracking-widest">
                    {inq.difficulty}
                  </span>
                </div>
              </div>
            );
          }

          // Cards 2 & 3: Mystery Placeholders
          const isHovered = hoveredMystery === inq.id;
          return (
            <div
              key={inq.id}
              onClick={() => handleCardClick(inq)}
              onMouseEnter={() => handleMysteryHover(inq)}
              onMouseLeave={() => setHoveredMystery(null)}
              className="relative rounded-2xl bg-neutral-950/60 p-6 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between select-none cursor-not-allowed group overflow-hidden"
            >
              {/* Mystery Lock Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-[10px]">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>LOCKED</span>
              </div>

              <div>
                {/* Silhouette Avatar */}
                <div className="w-20 h-20 mx-auto my-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 group-hover:text-amber-400 transition-all">
                  <HelpCircle className="w-10 h-10 animate-pulse text-neutral-600 group-hover:text-amber-400" />
                </div>

                {/* Mystery Info */}
                <div className="text-center mt-3 mb-4">
                  <h3 className="font-['Orbitron'] text-xl font-bold text-neutral-400 group-hover:text-amber-400 transition-colors">
                    {inq.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-neutral-400 tracking-wider mt-0.5">
                    {inq.title}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-1">
                    Origin: {inq.origin}
                  </p>
                </div>

                {/* Humorous note */}
                <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 font-mono text-center leading-relaxed">
                  {inq.mysteryNote}
                </div>
              </div>

              {/* Hover Secret Toast */}
              {isHovered && inq.hoverSecret && (
                <div className="mt-3 p-2 rounded bg-amber-950/80 border border-amber-500/50 text-[10px] font-mono text-amber-300 text-center animate-fade-in flex items-center justify-center gap-1">
                  <AlertOctagon className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{inq.hoverSecret}</span>
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Roster Status:</span>
                <span className="text-neutral-400 flex items-center gap-1">
                  <Skull className="w-3 h-3" />
                  <span>Season 2</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

