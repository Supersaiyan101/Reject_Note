import React from 'react';
import { Sparkles, Eye } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full py-8 md:py-12 px-4 text-center overflow-hidden">
      {/* Background Anime "Menacing" Glyphs (ゴゴゴ) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-4 left-6 md:left-24 text-rose-500/20 text-4xl md:text-6xl font-black font-serif animate-menacing">
          ゴ
        </span>
        <span className="absolute top-16 left-12 md:left-36 text-rose-500/25 text-3xl md:text-5xl font-black font-serif animate-menacing" style={{ animationDelay: '0.4s' }}>
          ゴ
        </span>
        <span className="absolute top-28 left-20 md:left-48 text-rose-500/30 text-5xl md:text-7xl font-black font-serif animate-menacing" style={{ animationDelay: '0.8s' }}>
          ゴ
        </span>

        <span className="absolute top-8 right-8 md:right-28 text-rose-500/20 text-4xl md:text-6xl font-black font-serif animate-menacing" style={{ animationDelay: '0.3s' }}>
          ゴ
        </span>
        <span className="absolute top-20 right-14 md:right-40 text-rose-500/25 text-3xl md:text-5xl font-black font-serif animate-menacing" style={{ animationDelay: '0.7s' }}>
          ゴ
        </span>
        <span className="absolute top-32 right-20 md:right-52 text-rose-500/30 text-5xl md:text-7xl font-black font-serif animate-menacing" style={{ animationDelay: '1.1s' }}>
          ゴ
        </span>
      </div>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Scouter Power Level Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-widest mb-5 shadow-[0_0_20px_rgba(34,197,94,0.2)] animate-scouter">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>SCOUTER READING: POWER LEVEL CRITICAL</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black font-bold text-[10px]">
            9001+
          </span>
        </div>

        {/* Dragon Ball Thematic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 uppercase drop-shadow-[0_4px_20px_rgba(225,29,72,0.4)]">
          <span className="block font-['Bangers'] tracking-wider text-rose-500 transform -rotate-1 hover:rotate-0 transition-transform">
            HIS BUZZWORD COUNT...
          </span>
          <span className="block font-['Orbitron'] text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 bg-clip-text text-transparent">
            IS OVER 9000!!!
          </span>
        </h1>

        {/* Sub-headline: Keikaku meme */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-medium max-w-2xl mb-4 leading-relaxed">
          Your <span className="text-rose-400 font-bold underline decoration-rose-500/50">Favourite Anime Characters</span> roast your resume. Sensors read your pulse.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 text-xs sm:text-sm font-mono italic max-w-xl">
          <Eye className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            &ldquo;Everything is proceeding according to plan. <span className="text-rose-400 font-bold not-italic">Just not yours...</span>&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
};

