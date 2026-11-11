import React from 'react';
import type { CandidateDossier } from '../types';
import { AlertTriangle, ArrowRight, RotateCcw, Skull, Flame, FileCheck, Brain } from 'lucide-react';
import { soundFX } from '../utils/sfx';

interface DossierCardProps {
  dossier: CandidateDossier;
  onProceed: () => void;
  onReset: () => void;
}

export const DossierCard: React.FC<DossierCardProps> = ({
  dossier,
  onProceed,
  onReset,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-rose-500/70 p-6 md:p-8 shadow-[0_0_40px_rgba(225,29,72,0.3)]">
        {/* Top Dossier Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/60 flex items-center justify-center text-rose-400 font-serif font-black text-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              審
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] font-bold text-sm tracking-wider text-rose-400">
                  CLASSIFIED CANDIDATE DOSSIER
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                  HIGH SUSPICION
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Prepared for Lead Inquisitor // Presage Optical Interrogation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFX.playClick();
                onReset();
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Audit Another CV</span>
            </button>
          </div>
        </div>

        {/* Candidate Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          {/* Col 1 & 2: Candidate Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-700 flex items-center justify-center font-['Cinzel_Decorative'] text-rose-400 text-3xl font-bold shrink-0">
                {dossier.isPreset ? '夜' : '申'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                  {dossier.name}
                </h3>
                <p className="text-xs text-rose-400 font-mono font-medium">
                  {dossier.title}
                </p>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  🎓 {dossier.education}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs text-neutral-300 font-mono leading-relaxed">
              <span className="text-rose-400 font-bold uppercase tracking-wider block mb-1">
                Executive Profile Summary:
              </span>
              &ldquo;{dossier.summary}&rdquo;
            </div>
          </div>

          {/* Col 3: Scouter Metrics Box */}
          <div className="rounded-xl bg-neutral-950 p-5 border border-emerald-500/40 flex flex-col justify-between shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Threat Classification
                </span>
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              </div>

              <div className="font-['Orbitron'] text-2xl font-black text-amber-400 tracking-tight my-1">
                CLASS-S (CRITICAL)
              </div>

              <p className="text-[11px] font-mono text-neutral-400">
                Verified Buzzwords: <span className="text-emerald-400 font-bold">{dossier.buzzwordCount.toLocaleString()}</span> points
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Optical Stress Risk:</span>
                <span className="text-rose-400 font-bold">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span>Poker Face Reliability:</span>
                <span className="text-neutral-500">Uncalibrated</span>
              </div>
            </div>
          </div>
        </div>

        {/* FLAGGED LANDMINES LIST */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="font-['Orbitron'] text-base font-bold text-white uppercase tracking-wider">
              Flagged Landmines to Grill ({dossier.flaggedLandmines.length} High-Risk Claims)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.flaggedLandmines.map((landmine) => (
              <div
                key={landmine.id}
                className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-rose-500/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      {landmine.badge}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">
                      Bluff Risk: {landmine.suspicionPercent}%
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <Skull className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{landmine.title}</span>
                  </h5>

                  <p className="text-xs font-mono text-neutral-300 leading-relaxed bg-black/40 p-2.5 rounded border border-neutral-800 mb-3">
                    &ldquo;{landmine.claimText}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 text-[11px] font-mono text-rose-400/90 italic flex items-start gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>L&apos;s Interrogation Target: &ldquo;{landmine.lInterrogationAngle}&rdquo;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Target Dossier Prepared. Inquisitor is waiting.</span>
          </div>

          <button
            onClick={() => {
              soundFX.playDramaticSting();
              onProceed();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-['Orbitron'] font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)] transform hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer animate-pulse-glow"
          >
            <span>PROCEED TO INQUISITOR SELECTION</span>
            <ArrowRight className="w-5 h-5 text-amber-300 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};
