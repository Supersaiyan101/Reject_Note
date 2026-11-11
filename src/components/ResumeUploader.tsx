import React, { useState, useRef } from 'react';
import { Upload, Zap, FileText, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { soundFX } from '../utils/sfx';

interface ResumeUploaderProps {
  onLoadLightYagami: () => void;
  onCustomResume: (fileName: string, text: string) => void;
  disabled?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onLoadLightYagami,
  onCustomResume,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    soundFX.playScouterBeep();
    const reader = new FileReader();

    // Read plain text directly
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onCustomResume(file.name, content);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim() || disabled) return;
    soundFX.playScouterBeep();
    onCustomResume('Pasted_Resume.txt', pastedText);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* CARD 1: FAST-TRACK 1-CLICK DEMO (LIGHT YAGAMI) */}
        <div className="relative group rounded-2xl bg-gradient-to-b from-rose-950/40 via-neutral-900 to-neutral-950 p-6 border-2 border-rose-500/50 hover:border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.2)] transition-all duration-300 flex flex-col justify-between">
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[11px] font-bold tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            OFFICIAL HACKATHON DEMO
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="text-xs font-mono text-rose-400 font-semibold tracking-wider uppercase">
                Candidate Preset #01
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-500/40">
                READY TO AUDIT
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                <span className="font-['Cinzel_Decorative'] text-rose-400 text-3xl font-black">
                  夜
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                  Light Yagami
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Valedictorian, To-Oh University
                </p>
                <p className="text-xs text-rose-400/90 font-mono mt-0.5">
                  &ldquo;Divine Lead System Architect&rdquo;
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-xs text-neutral-300 font-mono bg-neutral-950/70 p-3 rounded-lg border border-neutral-800">
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">▶</span>
                <span>Claim: Covert Potato-Chip LCD Surveillance Rig (0ms latency).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">▶</span>
                <span>Claim: 40-Second SLA on incident termination.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">▶</span>
                <span>Scouter Reading: <strong className="text-amber-400">9001 Buzzwords</strong> detected.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playDramaticSting();
              onLoadLightYagami();
            }}
            disabled={disabled}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-['Orbitron'] font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_4px_30px_rgba(225,29,72,0.6)] transform active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>LOAD LIGHT YAGAMI&apos;S DOSSIER</span>
          </button>
        </div>

        {/* CARD 2: CUSTOM RESUME UPLOAD */}
        <div className="relative rounded-2xl bg-neutral-900/60 p-6 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-neutral-400 font-semibold tracking-wider uppercase">
                Custom Applicant
              </span>
              <span className="text-xs font-mono text-neutral-500">
                PDF / TXT
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-950/20 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
                  : 'border-neutral-700/80 hover:border-neutral-500 bg-neutral-950/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.md"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-white">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Drop your CV here or <span className="text-rose-400 underline">Browse</span>
              </p>
              <p className="text-xs text-neutral-400 font-mono">
                Accepts .txt, .pdf, or paste plain text below
              </p>
            </div>

            {/* Accordion toggle for direct text pasting */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowPasteArea(!showPasteArea)}
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPasteArea ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>Or paste raw resume bullet points</span>
              </button>

              {showPasteArea && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={4}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your education, skills, and proudest tech boasts here..."
                    className="w-full text-xs font-mono p-3 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-rose-500 placeholder:text-neutral-600 resize-none"
                  />
                  <button
                    onClick={handlePasteSubmit}
                    disabled={!pastedText.trim() || disabled}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>Audit Pasted Content</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Files are processed 100% in-browser memory. No data is stored.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
