import React, { useState, useEffect } from 'react';
import type { InquisitorProfile } from '../types';
import { Volume2, VolumeX, ArrowRight, Brain, Zap, Music, ChevronLeft, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/sfx';
import { realAudio } from '../utils/realAudio';

interface LShowcaseProps {
  inquisitor: InquisitorProfile;
  candidateName: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const LShowcase: React.FC<LShowcaseProps> = ({
  inquisitor,
  candidateName,
  onConfirm,
  onBack,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isThemePlaying, setIsThemePlaying] = useState(false);

  useEffect(() => {
    return () => {
      realAudio.stopAll();
    };
  }, []);

  const handlePlayRealVoice = () => {
    if (isPlayingVoice) {
      realAudio.stopLVoice();
      setIsPlayingVoice(false);
      return;
    }

    soundFX.playClick();
    setIsPlayingVoice(true);
    realAudio.playLVoice(() => {
      setIsPlayingVoice(false);
    });
  };

  const handleToggleTheme = () => {
    soundFX.playClick();
    const active = realAudio.toggleLTheme();
    setIsThemePlaying(active);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="relative rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-rose-500/70 p-6 md:p-8 shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden">
        {/* Procedural Giant Gothic "L" Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="font-['Cinzel_Decorative'] text-[280px] md:text-[380px] font-black text-rose-500/[0.04] leading-none animate-pulse">
            L
          </span>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-rose-500/80 to-transparent shadow-[0_0_20px_#e11d48]" />

        <div className="relative z-10">
          {/* Top Inquisitor Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-rose-500 flex items-center justify-center text-rose-400 font-['Cinzel_Decorative'] font-black text-3xl shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                L
              </div>
              <div>
                <h3 className="font-['Cinzel_Decorative'] text-2xl font-black text-white flex items-center gap-2">
                  <span>{inquisitor.name}</span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/80 font-bold">
                    {inquisitor.title}
                  </span>
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Assigned to interrogate candidate: <span className="text-white font-bold">{candidateName}</span>
                </p>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                realAudio.stopAll();
                onBack();
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Resume Dossier</span>
            </button>
          </div>

          {/* Main Grid: Avatar vs Combat Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
            {/* Left Column: Visual Key Art & Audio Controls */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              {/* REAL L ARTWORK CONTAINER */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-neutral-950 border-2 border-rose-500/70 p-2 shadow-[0_0_40px_rgba(225,29,72,0.4)] overflow-hidden group">
                <img
                  src="/l-character.png"
                  alt="L (Lawliet) Death Note"
                  className="w-full h-full object-cover object-top rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle vignette over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-2xl" />

                {/* Badge on artwork */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/80">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-400 animate-spin" />
                    L Lawliet
                  </span>
                  <span className="text-neutral-400">Death Note</span>
                </div>
              </div>

              {/* Dual Audio Controls: Real Voice & L's Theme */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                {/* Real Voice Button */}
                <button
                  onClick={handlePlayRealVoice}
                  className={`flex-1 w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-mono text-xs transition-all cursor-pointer ${
                    isPlayingVoice
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
                  }`}
                >
                  {isPlayingVoice ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>Speaking...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Real Voice Clip</span>
                    </>
                  )}
                </button>

                {/* L's Theme OST Button */}
                <button
                  onClick={handleToggleTheme}
                  title="Toggle L's Theme Piano OST"
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-mono text-xs transition-all cursor-pointer ${
                    isThemePlaying
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                  }`}
                >
                  <Music className={`w-3.5 h-3.5 ${isThemePlaying ? 'text-emerald-400 animate-bounce' : 'text-neutral-400'}`} />
                  <span>{isThemePlaying ? 'OST Playing' : "L's Theme"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Inquisitor Protocol & Radar Stats */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
                  Interrogation Protocol
                </span>
                <p className="text-sm font-mono text-white leading-relaxed">
                  &ldquo;There is a 99.7% probability your resume is a complete bluff. I will inspect your capillary blood volume and pulse rate through the camera as you defend your claims.&rdquo;
                </p>
              </div>

              {/* Stat Bars */}
              <div className="space-y-3 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs font-mono">
                {/* Deduction */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-rose-400" />
                      Deductive Intellect:
                    </span>
                    <span className="text-rose-400 font-bold">100 / 100</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full w-full" />
                  </div>
                </div>

                {/* Mercy */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Mercy / Pity:</span>
                    <span className="text-neutral-500 font-bold">0 / 100 (NONE)</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-neutral-800 h-full w-0" />
                  </div>
                </div>

                {/* Sweet Tooth */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Sweet Tooth / Sugar Rush:
                    </span>
                    <span className="text-amber-400 font-bold">OVER 9000!</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full w-full animate-pulse" />
                  </div>
                </div>

                {/* Optical Sensitivity */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Presage Optical Sensitivity:</span>
                    <span className="text-emerald-400 font-bold">MAX (0.1ms PPG)</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Weapon of Choice Box */}
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Weapon of Choice:</span>
                <span className="text-rose-400 font-bold">
                  THE REJECT NOTE + Sugar Cubes
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Confirmation CTA */}
          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-neutral-400">
              Selected Inquisitor: <strong className="text-white">L (The &ldquo;L&rdquo;-ie Detector)</strong>
            </div>

            <button
              onClick={() => {
                soundFX.playDramaticSting();
                realAudio.stopAll();
                onConfirm();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-['Orbitron'] font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)] transform hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer animate-pulse-glow"
            >
              <span>CONFIRM L: ENTER THE INTERROGATION</span>
              <ArrowRight className="w-5 h-5 text-amber-300 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
