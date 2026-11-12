import React, { useState, useEffect } from 'react';
import type { CandidateDossier } from '../types';
import { ArrowRight, RotateCcw, FileCheck, Award, Sparkles, ShieldAlert, Activity } from 'lucide-react';
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
  const [psycheMode, setPsycheMode] = useState<'bliss' | 'panic'>('bliss');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Alternate: 4.2 seconds bliss, 1.4 seconds panic
    const interval = setInterval(() => {
      setPsycheMode((prev) => (prev === 'bliss' ? 'panic' : 'bliss'));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const activeMode = isHovered ? 'panic' : psycheMode;
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-rose-500/70 p-6 md:p-8 shadow-[0_0_40px_rgba(225,29,72,0.3)]">
        {/* Top Dossier Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 font-serif font-black text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              申
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] font-bold text-sm tracking-wider text-white">
                  CANDIDATE APPLICATION DOSSIER
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-mono text-[10px] font-bold">
                  INTAKE REGISTERED
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Applicant Intake File // Awaiting Inquisitor Cross-Examination
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
              <span>Submit Another CV</span>
            </button>
          </div>
        </div>

        {/* Candidate Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          {/* Col 1 & 2: Candidate Bio & Submitted Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-700 flex items-center justify-center font-['Cinzel_Decorative'] text-rose-400 text-3xl font-bold shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                {dossier.isPreset ? '夜' : '申'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <span>{dossier.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-normal border border-neutral-700">
                    Applicant #001
                  </span>
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
              <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Submitted Career Mission Statement:
              </span>
              &ldquo;{dossier.summary}&rdquo;
            </div>
          </div>

          {/* Col 3: Candidate Psyche Projection (Gojo Flowers vs Higuruma Despair) */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`rounded-xl bg-neutral-950 p-4 border transition-all duration-300 flex flex-col justify-between ${
              activeMode === 'panic' 
                ? 'border-rose-600/70 shadow-[0_0_25px_rgba(225,29,72,0.3)]' 
                : 'border-pink-500/40 shadow-[0_0_20px_rgba(244,114,182,0.15)]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  activeMode === 'panic' ? 'text-rose-400' : 'text-pink-400'
                }`}>
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Psyche Projection
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors ${
                  activeMode === 'panic'
                    ? 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse'
                    : 'bg-pink-950/70 text-pink-300 border-pink-700/50'
                }`}>
                  {activeMode === 'panic' ? 'AUDIT PANIC' : 'EGO: "NAH, I\'D WIN"'}
                </span>
              </div>

              {/* Dynamic GIF Viewport */}
              <div className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 group">
                <img
                  src={activeMode === 'panic' ? '/candidate-audit-despair.gif' : '/candidate-ego-bliss.gif'}
                  alt={activeMode === 'panic' ? 'Audit Despair' : 'Ego Bliss'}
                  className="w-full h-full object-cover object-center transition-all duration-200"
                />

                {/* Subtle CRT Scanline Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40" />

                {/* Top Corner Label */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs border border-white/10 text-[9px] font-mono text-neutral-300 uppercase">
                  {activeMode === 'panic' ? '⚠️ Pulse Surge' : '🌸 Baseline Ego'}
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-2 inset-x-2 px-2 py-1 rounded bg-black/80 backdrop-blur-xs border border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={activeMode === 'panic' ? 'text-rose-400 font-bold' : 'text-pink-300 font-medium'}>
                    {activeMode === 'panic' ? '188 BPM // Heart Rate Breach' : '62 BPM // Untouchable Calm'}
                  </span>
                  <span className="text-[9px] text-neutral-400 hidden sm:inline">
                    {activeMode === 'panic' ? 'CRITICAL' : 'SPECIAL GRADE'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-neutral-400 mt-2">
                {activeMode === 'panic' 
                  ? 'Projected Cross-Exam Reality: Complete existential breakdown under L.' 
                  : 'Self-Assessed Intake Vibe: 100% confidence, entirely untouched.'}
              </p>
            </div>

            {/* Verification status footer */}
            <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Intake Verification:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  Pending Ocular Audit
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Polygraph Status:</span>
                <span>Uncalibrated (Stage 3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* REGISTERED CANDIDATE CLAIMS & ACHIEVEMENTS */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="font-['Orbitron'] text-base font-bold text-white uppercase tracking-wider">
                Submitted Portfolio Claims ({dossier.flaggedLandmines.length} Key Achievements)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline-block">
              Recorded for live trial verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.flaggedLandmines.map((claim) => (
              <div
                key={claim.id}
                className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-cyan-300 border border-neutral-700">
                      {claim.badge}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                      <span>Status:</span>
                      <strong className="text-amber-400 font-normal">Pending Audit</strong>
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white mb-2">
                    {claim.title}
                  </h5>

                  <p className="text-xs font-mono text-neutral-300 leading-relaxed bg-black/50 p-3 rounded-lg border border-neutral-800/90 mb-3">
                    &ldquo;{claim.claimText}&rdquo;
                  </p>
                </div>

                <div className="pt-2.5 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>Cross-Examination:</span>
                  <span className="text-rose-400 font-semibold tracking-wider uppercase text-[10px] bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
                    Sealed for Trial
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Applicant portfolio locked. Choose your examiner to commence the audit.</span>
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
