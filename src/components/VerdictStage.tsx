import React, { useEffect, useState } from 'react';
import type { InterrogationSummary } from '../types';
import { soundFX } from '../utils/sfx';
import { realAudio } from '../utils/realAudio';
import { RotateCcw, AlertTriangle, Heart, Eye, Download, Check, FileJson, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerdictStageProps {
  summary: InterrogationSummary;
  onRestart: () => void;
}

export const VerdictStage: React.FC<VerdictStageProps> = ({ summary, onRestart }) => {
  const isRejected = summary.finalVerdict === 'GUILTY_REJECTED';
  const [hasExported, setHasExported] = useState(false);

  const handleExportTelemetry = () => {
    soundFX.playClick();
    const payload = {
      auditTimestamp: new Date().toISOString(),
      sdkProvider: 'Presage Technologies SmartSpectra SDK',
      sdkApiVersion: '3.5.0',
      authStatus: import.meta.env.VITE_PRESAGE_API_KEY ? 'AUTHENTICATED' : 'LOCAL_CLIENT_FALLBACK',
      candidate: {
        name: summary.candidateName,
        inquisitor: summary.inquisitorId,
        finalVerdict: summary.finalVerdict,
        bluffSuspicionScore: `${summary.totalSuspicionPercent}%`,
      },
      biometricEvidenceLog: summary.evidenceLog.map((e, i) => ({
        index: i + 1,
        questionId: e.questionId,
        claimTitle: e.claimTitle,
        testimony: e.candidateTestimony,
        pulseBaselineBPM: e.baselineBPM,
        pulsePeakBPM: e.peakBPM,
        pulseSurgeDeltaBPM: e.deltaBPM,
        heartRateVariabilitySDNN: e.hrvMs ? `${e.hrvMs} ms` : 'N/A',
        blinkRatePerMin: e.blinkRate ?? 14,
        sympatheticTonePercent: e.sympatheticTone ? `${e.sympatheticTone}%` : 'N/A',
        ocularGazeDrifts: e.gazeDeviations,
        fidgetIndex: `${e.fidgetIndex}/100`,
        lForensicVerdict: e.deductionVerdict,
        suspicionPenaltyAdded: `+${e.suspicionAdded}%`,
      })),
      compliance: {
        cameraConsentGranted: true,
        dataRetentionPolicy: 'Ephemeral Client-Side Memory Only',
        hackathonChallenge: 'DEV Presage SmartSpectra SDK Challenge',
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rejectnote-presage-telemetry-${summary.candidateName.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setHasExported(true);
  };

  useEffect(() => {
    // Stop all background audio when entering verdict
    realAudio.stopAll();

    // Play final verdict sting
    soundFX.playDramaticSting();

    // If probationary pass, trigger celebratory confetti
    if (!isRejected) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isRejected]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className={`rounded-2xl bg-gradient-to-b from-neutral-950 via-neutral-900 to-black border-2 p-6 md:p-10 shadow-2xl relative overflow-hidden ${
        isRejected
          ? 'border-rose-600 shadow-[0_0_60px_rgba(225,29,72,0.35)]'
          : 'border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.35)]'
      }`}>
        {/* Subtle Ambient Scanline */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-25" />

        {/* Top Header Badge */}
        <div className="text-center space-y-3 relative z-10">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center font-serif text-4xl font-black border-2 shadow-2xl ${
            isRejected
              ? 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(225,29,72,0.5)]'
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
          }`}>
            {isRejected ? '死' : '通'}
          </div>

          <span className={`font-mono text-xs font-bold tracking-widest uppercase block ${
            isRejected ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            STAGE 5 // FINAL BIOFEEDBACK SENTENCE
          </span>

          <h2 className="font-['Cinzel_Decorative'] text-3xl md:text-5xl font-black text-white tracking-wider">
            {isRejected ? 'NAME INSCRIBED IN REJECT NOTE' : 'PROBATIONARY PASS GRANTED'}
          </h2>

          <p className="text-xs md:text-sm font-mono text-neutral-300 max-w-lg mx-auto">
            {isRejected
              ? 'Presage SmartSpectra optical sensors confirmed critical autonomic distress under cross-examination. Candidate is disqualified from the engineering pipeline.'
              : 'Candidate heart rate and micro-expressions remained resilient throughout L\'s forensic cross-examination.'}
          </p>
        </div>

        {/* The Reject Note Notebook Surface */}
        <div className="my-8 p-6 rounded-2xl bg-black/90 border border-neutral-800 shadow-inner relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs font-mono">
            <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Official RejectNote Inscription
            </span>
            <span className="text-neutral-500">
              Examined by L Lawliet // Chief Inquisitor
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Candidate Name</span>
              <strong className="text-white font-mono text-base">{summary.candidateName}</strong>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Bluff Probability</span>
              <strong className={`font-mono text-base ${isRejected ? 'text-rose-400' : 'text-emerald-400'}`}>
                {summary.totalSuspicionPercent}%
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Execution SLA</span>
              <strong className="text-amber-400 font-mono text-base">40 SECONDS</strong>
            </div>
          </div>

          {/* Biometric Evidence Log */}
          {summary.evidenceLog.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
              <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider block">
                Presage Optical Forensic Telemetry Log ({summary.evidenceLog.length} Claims Audited):
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {summary.evidenceLog.map((evidence, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="text-rose-400">#{idx + 1}</span> {evidence.claimTitle}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        evidence.deltaBPM >= 12 ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      }`}>
                        +{evidence.deltaBPM} BPM STRESS
                      </span>
                    </div>

                    <p className="text-neutral-400 text-[11px] italic pl-2 border-l border-neutral-700">
                      &ldquo;{evidence.candidateTestimony}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500 pt-1">
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Heart className="w-3 h-3 text-rose-400" />
                        Peak: {evidence.peakBPM} BPM (+{evidence.deltaBPM} &Delta;)
                      </span>
                      {evidence.hrvMs && (
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Activity className="w-3 h-3 text-cyan-400" />
                          HRV: {evidence.hrvMs} ms
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Eye className="w-3 h-3 text-amber-400" />
                        Ocular Shifts: {evidence.gazeDeviations}
                      </span>
                      {evidence.blinkRate && (
                        <span className="text-neutral-400">
                          Blinks: {evidence.blinkRate}/m
                        </span>
                      )}
                      <span className="text-rose-400 font-bold ml-auto">
                        Bluff Risk Added: +{evidence.suspicionAdded}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <button
            onClick={handleExportTelemetry}
            className={`px-6 py-3 rounded-xl font-mono text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border ${
              hasExported
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-neutral-500'
            }`}
          >
            {hasExported ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
            <span className="flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-rose-400" />
              <span>{hasExported ? 'TELEMETRY EXPORTED (.JSON)' : 'EXPORT PRESAGE AUDIT (.JSON)'}</span>
            </span>
          </button>

          <button
            onClick={onRestart}
            className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(225,29,72,0.4)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>AUDIT ANOTHER CANDIDATE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
