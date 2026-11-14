import React, { useState } from 'react';
import { Volume2, VolumeX, Activity, Key, Brain, Sparkles, X, ExternalLink } from 'lucide-react';
import { soundFX } from '../utils/sfx';
import { opticalEngine } from '../utils/opticalEngine';
import { getGeminiApiKey, setGeminiApiKey, isGeminiEnabled } from '../services/geminiService';

export const Header: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const hasPresageKey = Boolean(opticalEngine.getApiKey());
  const [hasGeminiKey, setHasGeminiKey] = useState(isGeminiEnabled());
  const [showBrainModal, setShowBrainModal] = useState(false);
  const [geminiInput, setGeminiInput] = useState(getGeminiApiKey() || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFX.playScouterBeep();
    }
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(geminiInput);
    setHasGeminiKey(isGeminiEnabled());
    setSaveSuccess(true);
    soundFX.playClick();
    setTimeout(() => {
      setSaveSuccess(false);
      setShowBrainModal(false);
    }, 1000);
  };

  return (
    <>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini LLM Brain Button */}
            <button
              onClick={() => setShowBrainModal(true)}
              title={hasGeminiKey ? 'Gemini 2.0 Flash AI Roast Brain Active' : 'Click to enable Gemini AI LLM Roasting'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                hasGeminiKey
                  ? 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-purple-600 hover:text-purple-300'
              }`}
            >
              <Brain className={`w-3.5 h-3.5 ${hasGeminiKey ? 'text-purple-400 animate-pulse' : 'text-neutral-500'}`} />
              <span className="font-semibold">{hasGeminiKey ? 'L BRAIN: GEMINI AI' : 'L BRAIN: CONNECT AI'}</span>
            </button>

            {/* Presage SDK Key Status Pill */}
            <div
              title={hasPresageKey ? 'Official Presage SmartSpectra API Key Authenticated' : 'No API Key configured - Running local CV'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                hasPresageKey
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400'
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${hasPresageKey ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
              <span className="font-semibold">{hasPresageKey ? 'PRESAGE: AUTH' : 'PRESAGE: LOCAL'}</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>OPTICAL: ON</span>
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

      {/* Gemini AI Brain Configuration Modal */}
      {showBrainModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-neutral-950 border-2 border-purple-500/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative space-y-4">
            <button
              onClick={() => setShowBrainModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Brain className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-['Cinzel_Decorative'] font-bold text-lg text-white">
                  L&apos;S NEURAL BRAIN UPLINK
                </h3>
                <p className="text-xs font-mono text-purple-300/80">
                  Powered by Google Gemini 2.0 Flash
                </p>
              </div>
            </div>

            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              Connect Google Gemini to replace rule-based deductions with an unhinged, dynamic AI intellect that roasts your actual spoken defense and Presage biometric telemetry in real-time.
            </p>

            <form onSubmit={handleSaveGeminiKey} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Gemini API Key (Google AI Studio):
                </label>
                <input
                  type="password"
                  value={geminiInput}
                  onChange={(e) => setGeminiInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono text-xs focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                >
                  <span>Get Free Key (Google AI Studio)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>100% Client-Side</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{saveSuccess ? 'UPLINK ESTABLISHED!' : 'SAVE & ACTIVATE GEMINI BRAIN'}</span>
                </button>
                {hasGeminiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeminiApiKey('');
                      setGeminiInput('');
                      setHasGeminiKey(false);
                      soundFX.playClick();
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-rose-400 font-mono text-xs border border-rose-900/60 cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


