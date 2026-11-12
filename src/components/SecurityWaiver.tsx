import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, Key, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { opticalEngine } from '../utils/opticalEngine';
import { soundFX } from '../utils/sfx';

interface SecurityWaiverProps {
  candidateName: string;
  onConsentAndProceed: () => void;
  onBack: () => void;
}

export const SecurityWaiver: React.FC<SecurityWaiverProps> = ({
  candidateName,
  onConsentAndProceed,
  onBack,
}) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(opticalEngine.getApiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  const handleSaveApiKey = () => {
    soundFX.playScouterBeep();
    opticalEngine.setApiKey(apiKey);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  const handleProceed = () => {
    if (!hasConsented) return;
    soundFX.playDramaticSting();
    onConsentAndProceed();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="relative rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-rose-500/70 p-6 md:p-8 shadow-[0_0_40px_rgba(225,29,72,0.3)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-rose-500/60 flex items-center justify-center text-rose-400 font-serif font-black text-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              警
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] font-bold text-sm tracking-wider text-white">
                  SECURITY CLEARANCE PROTOCOL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-500/40">
                  CLEARANCE REQUIRED
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                NPA Task Force Biometric Consent // Subject: <strong className="text-rose-400">{candidateName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer transition-colors"
          >
            ← Back to Inquisitor
          </button>
        </div>

        {/* Clear & Transparent Consent Terms */}
        <div className="my-6 space-y-4">
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  100% In-Memory Local Processing
                </h4>
                <p className="text-xs font-mono text-neutral-300 mt-1 leading-relaxed">
                  Your camera stream is processed strictly in your local device memory for optical rPPG pulse waveforms and breathing cadence. Zero video frames or photos are saved, recorded, or sent to external servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-neutral-900">
              <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Satirical Entertainment & Non-Medical Notice
                </h4>
                <p className="text-xs font-mono text-neutral-300 mt-1 leading-relaxed">
                  Optical metrics measure relative physiological excitement and stress for comedy and entertainment. This software does not provide medical diagnoses or legal lie detection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-neutral-900">
              <Eye className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Webcam Optical Calibration
                </h4>
                <p className="text-xs font-mono text-neutral-300 mt-1 leading-relaxed">
                  Clicking proceed will prompt your browser for temporary camera permission to run a 5-second baseline calibration test.
                </p>
              </div>
            </div>
          </div>

          {/* Optional Presage API Key Drawer */}
          <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="flex items-center justify-between w-full text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Optional: Enter Presage SmartSpectra API Key (Defaults to In-Browser Optical Mode)</span>
              </div>
              {showApiKeyInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showApiKeyInput && (
              <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                <p className="text-[11px] font-mono text-neutral-400">
                  Paste your developer API key from{' '}
                  <a
                    href="https://physiology.presagetech.com/auth/register"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 underline hover:text-rose-300"
                  >
                    physiology.presagetech.com
                  </a>{' '}
                  to switch from simulation to live SDK mode.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="prsg_live_..."
                    className="flex-1 text-xs font-mono p-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
                {keySavedToast && (
                  <p className="text-emerald-400 font-mono text-[11px]">
                    ✓ Presage API Key saved to local storage!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Interactive Checkbox */}
          <div
            onClick={() => {
              soundFX.playClick();
              setHasConsented(!hasConsented);
            }}
            className="flex items-center gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-rose-500/60 cursor-pointer transition-colors"
          >
            {hasConsented ? (
              <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-neutral-500 shrink-0" />
            )}
            <label className="text-xs font-mono text-neutral-200 cursor-pointer select-none">
              I acknowledge the privacy terms and <strong className="text-white">consent to optical webcam tracking</strong> for this evaluation.
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-neutral-500">
            Clearance Status: {hasConsented ? <span className="text-emerald-400">READY</span> : <span className="text-rose-400">AWAITING SIGNATURE</span>}
          </div>

          <button
            onClick={handleProceed}
            disabled={!hasConsented}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-['Orbitron'] font-black text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <span>ACTIVATE CAMERA & CALIBRATE VITALS</span>
            <span className="text-amber-300">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

