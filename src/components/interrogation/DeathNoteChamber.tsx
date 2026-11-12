import React, { useState, useEffect, useRef } from 'react';
import type { 
  CandidateDossier, 
  InquisitorProfile, 
  BaselineCalibration, 
  LiveVitals, 
  BiometricEvidence,
  InterrogationSummary,
  CameraState
} from '../../types';
import { generateQuestionsForDossier, synthesizeLDeduction } from '../../services/interrogationEngine';
import { candidateVoiceEngine } from '../../services/voiceEngine';
import { OpticalViewfinder } from '../OpticalViewfinder';
import { soundFX } from '../../utils/sfx';
import { realAudio } from '../../utils/realAudio';
import { lSpeechEngine } from '../../utils/speech';
import { 
  Mic, 
  MicOff, 
  Keyboard, 
  Send, 
  Activity, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  Eye,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface DeathNoteChamberProps {
  dossier: CandidateDossier;
  inquisitor: InquisitorProfile;
  baseline: BaselineCalibration;
  onComplete: (summary: InterrogationSummary) => void;
  onBack: () => void;
}

type ChamberPhase = 'QUESTION' | 'TESTIMONY' | 'DEDUCTION' | 'VERDICT_REVEAL';

export const DeathNoteChamber: React.FC<DeathNoteChamberProps> = ({
  dossier,
  inquisitor,
  baseline,
  onComplete,
  onBack,
}) => {
  // Generate 4 targeted questions for this candidate's resume
  const questions = useRef(generateQuestionsForDossier(dossier)).current;
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = questions[questionIdx];

  // Chamber flow phase
  const [phase, setPhase] = useState<ChamberPhase>('QUESTION');
  
  // Testimony inputs
  const [inputMode, setInputMode] = useState<'VOICE' | 'KEYBOARD'>('VOICE');
  const [testimonyText, setTestimonyText] = useState('');
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Biometrics harvest during testimony
  const [liveVitals, setLiveVitals] = useState<LiveVitals>({
    currentBPM: baseline.restingBPM,
    currentBreathingRate: baseline.restingBreathingRate,
    stressDeltaBPM: 0,
    waveform: [],
    signalQuality: 'OPTIMAL',
  });
  const [cameraState, setCameraState] = useState<CameraState>('ACTIVE');

  // Track peak BPM and gaze deviations during active testimony
  const peakBPMRef = useRef(baseline.restingBPM);
  const bpmReadingsRef = useRef<number[]>([]);
  const gazeDriftsRef = useRef(0);
  const testimonyStartTimeRef = useRef(0);

  // L 15-second deduction phase
  const [deductionTimer, setDeductionTimer] = useState(15.0);
  const [deductionLogs, setDeductionLogs] = useState<string[]>([]);
  const [activeDeduction, setActiveDeduction] = useState<{
    deductionText: string;
    suspicionDelta: number;
    bluffProbability: number;
  } | null>(null);

  // Game state
  const [suspicionPercent, setSuspicionPercent] = useState(12);
  const [evidenceLog, setEvidenceLog] = useState<BiometricEvidence[]>([]);
  const [isThemePlaying, setIsThemePlaying] = useState(true);

  // Start L's theme on mount
  useEffect(() => {
    try {
      if (!realAudio.isThemeActive()) {
        realAudio.toggleLTheme();
        setIsThemePlaying(true);
      }
    } catch {
      // Audio autoplay policy
    }
    return () => {
      candidateVoiceEngine.stopListening();
      lSpeechEngine.stop();
    };
  }, []);

  // When question changes, speak question and prepare testimony
  useEffect(() => {
    setPhase('QUESTION');
    setTestimonyText('');
    peakBPMRef.current = baseline.restingBPM;
    bpmReadingsRef.current = [];
    gazeDriftsRef.current = 0;

    // L vocally asks the question via Web Speech
    lSpeechEngine.speakAsL(currentQuestion.lQuestion);
  }, [questionIdx, currentQuestion, baseline.restingBPM]);

  // Handle vitals updates from Presage optical camera
  const handleVitalsUpdate = (vitals: LiveVitals) => {
    setLiveVitals(vitals);

    // If candidate is actively testifying, log peak BPM and detect gaze shifts
    if (phase === 'TESTIMONY') {
      if (vitals.currentBPM > peakBPMRef.current) {
        peakBPMRef.current = vitals.currentBPM;
      }
      bpmReadingsRef.current.push(vitals.currentBPM);

      // Randomly simulate occasional micro gaze drift if face box shifts
      if (Math.random() < 0.04) {
        gazeDriftsRef.current += 1;
      }
    }
  };

  // Toggle Voice Recognition
  const toggleVoiceRecording = async () => {
    if (isMicRecording) {
      candidateVoiceEngine.stopListening();
      setIsMicRecording(false);
      setAudioLevel(0);
    } else {
      soundFX.playClick();
      const supported = await candidateVoiceEngine.startListening({
        onTranscriptUpdate: (text) => {
          setTestimonyText(text);
        },
        onAudioLevel: (level) => {
          setAudioLevel(level);
        },
        onError: (err) => {
          console.warn('Voice error:', err);
        },
        onListeningStateChange: (state) => {
          setIsMicRecording(state);
        },
      });

      if (!supported && !candidateVoiceEngine.isSpeechRecognitionSupported()) {
        // Fallback to keyboard if browser has no speech recognition
        setInputMode('KEYBOARD');
      }
    }
  };

  // Candidate confirms testimony -> Starts 15-second L deduction
  const handleConfirmTestimony = () => {
    soundFX.playDramaticSting();
    candidateVoiceEngine.stopListening();
    setIsMicRecording(false);

    const durationSec = Math.max(2, Math.round((Date.now() - testimonyStartTimeRef.current) / 1000));
    const allBPM = bpmReadingsRef.current.length > 0 ? bpmReadingsRef.current : [liveVitals.currentBPM];
    const avgBPM = Math.round(allBPM.reduce((a, b) => a + b, 0) / allBPM.length);
    const peakBPM = Math.max(peakBPMRef.current, liveVitals.currentBPM);
    const deltaBPM = Math.max(0, peakBPM - baseline.restingBPM);

    const deduction = synthesizeLDeduction(currentQuestion, testimonyText, {
      baselineBPM: baseline.restingBPM,
      peakBPM,
      deltaBPM,
      avgBPM,
      gazeDeviations: gazeDriftsRef.current,
      durationSec,
    });

    setActiveDeduction(deduction);
    setPhase('DEDUCTION');
    setDeductionTimer(15.0);
    setDeductionLogs([
      `[00:01] Parsing candidate statement (${testimonyText.trim().split(/\s+/).length} words)...`,
      `[00:03] Presage rPPG: Peak pulse detected at ${peakBPM} BPM (+${deltaBPM} BPM surge).`,
    ]);
  };

  // 15-Second L Deductive Countdown
  useEffect(() => {
    if (phase !== 'DEDUCTION') return;

    let timeLeft = 15.0;
    const interval = setInterval(() => {
      timeLeft = Math.max(0, Math.round((timeLeft - 0.1) * 10) / 10);
      setDeductionTimer(timeLeft);

      // Play heartbeat thump every 1.2s to build anime tension
      if (Math.round(timeLeft * 10) % 12 === 0) {
        soundFX.playHeartbeat();
      }

      // Add forensic log lines as L computes
      if (timeLeft === 11.0) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:07] Comparing acoustic cadence against baseline polygraph...`,
        ]);
      } else if (timeLeft === 7.0) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:11] Gaze aversion index flagged: ${gazeDriftsRef.current} deviations recorded.`,
        ]);
      } else if (timeLeft === 3.0) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:14] Probability of deception calculating: ${activeDeduction?.bluffProbability}%...`,
        ]);
      }

      // At 00:00: Deductive verdict unlocked
      if (timeLeft <= 0) {
        clearInterval(interval);
        soundFX.playDramaticSting();
        setPhase('VERDICT_REVEAL');

        if (activeDeduction) {
          // Increase suspicion
          setSuspicionPercent((prev) => Math.min(100, prev + activeDeduction.suspicionDelta));

          // Log evidence
          const evidenceItem: BiometricEvidence = {
            questionId: currentQuestion.id,
            claimTitle: currentQuestion.claimTitle,
            candidateTestimony: testimonyText || '[Refused to testify]',
            baselineBPM: baseline.restingBPM,
            peakBPM: peakBPMRef.current,
            deltaBPM: Math.max(0, peakBPMRef.current - baseline.restingBPM),
            avgBPM: Math.round(
              bpmReadingsRef.current.length > 0
                ? bpmReadingsRef.current.reduce((a, b) => a + b, 0) / bpmReadingsRef.current.length
                : liveVitals.currentBPM
            ),
            gazeDeviations: gazeDriftsRef.current,
            fidgetIndex: Math.min(100, gazeDriftsRef.current * 18 + 20),
            durationSec: 15,
            deductionVerdict: activeDeduction.deductionText,
            suspicionAdded: activeDeduction.suspicionDelta,
          };
          setEvidenceLog((prev) => [...prev, evidenceItem]);

          // L speaks his verdict aloud
          lSpeechEngine.speakAsL(activeDeduction.deductionText);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, activeDeduction, currentQuestion, testimonyText, baseline.restingBPM, liveVitals.currentBPM]);

  // Advance to next question or final verdict
  const handleNextStep = () => {
    soundFX.playClick();
    lSpeechEngine.stop();

    if (questionIdx + 1 < questions.length) {
      setQuestionIdx((prev) => prev + 1);
    } else {
      // Completed all 4 claims -> Advance to Stage 5 Verdict!
      const totalSuspicion = suspicionPercent;
      onComplete({
        candidateName: dossier.name,
        inquisitorId: inquisitor.id,
        totalSuspicionPercent: totalSuspicion,
        evidenceLog,
        finalVerdict: totalSuspicion >= 65 ? 'GUILTY_REJECTED' : 'PROBATION_HIRED',
      });
    }
  };

  const liveDelta = Math.max(0, liveVitals.currentBPM - baseline.restingBPM);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 space-y-4">
      {/* Top Chamber Header & Suspicion Bar */}
      <div className="rounded-xl bg-neutral-950 p-4 border border-rose-500/50 shadow-[0_0_30px_rgba(225,29,72,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black border border-rose-500/60 flex items-center justify-center font-serif text-rose-400 text-xl font-black shadow-[0_0_12px_rgba(225,29,72,0.3)]">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel_Decorative'] font-bold text-sm tracking-wider text-white">
                DEATH NOTE // TASK FORCE INTERROGATION CHAMBER
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/50 font-mono text-[10px] font-bold">
                CLAIM {questionIdx + 1} OF {questions.length}
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400">
              Presage SmartSpectra Optical Polygraph Active // Inquisitor: {inquisitor.name}
            </p>
          </div>
        </div>

        {/* Global Suspicion Meter */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase">
              Cumulative Bluff Probability
            </span>
            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${suspicionPercent >= 70 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
              <span className="font-['Orbitron'] text-lg font-black text-white">
                {suspicionPercent}%
              </span>
            </div>
          </div>

          <div className="w-32 md:w-44 h-3 rounded-full bg-neutral-900 border border-neutral-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                suspicionPercent >= 75
                  ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.8)]'
                  : suspicionPercent >= 45
                  ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${suspicionPercent}%` }}
            />
          </div>

          <button
            onClick={() => {
              const active = realAudio.toggleLTheme();
              setIsThemePlaying(active);
            }}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle L's Theme Piano OST"
          >
            {isThemePlaying ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SPLIT-SCREEN CCTV DUEL (L's Desk vs Candidate Camera) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT WING: L'S COMMAND POST */}
        <div className="relative rounded-2xl bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-5 border-2 border-neutral-800 flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Ambient CRT Scanline effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-40 z-10" />

          {/* L Character Presentation */}
          <div className="relative flex items-center justify-center py-2 z-10">
            <div className="relative group">
              <img
                src="/l-character.png"
                alt="L Lawliet"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] animate-float"
              />
              {/* Eerie Red Pupil Glint when pulse is spiking */}
              {liveDelta >= 14 && (
                <div className="absolute top-[28%] left-[45%] w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-ping" />
              )}
            </div>
          </div>

          {/* L Status Badge */}
          <div className="relative z-20 flex items-center justify-between pt-3 border-t border-neutral-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-white font-bold tracking-wider">
                L LAWLIET // THE &ldquo;L&rdquo;-IE DETECTOR
              </span>
            </div>
            <span className="text-neutral-400">
              Deduction: <strong className="text-rose-400">100/100</strong>
            </span>
          </div>
        </div>

        {/* RIGHT WING: CANDIDATE'S PRESAGE SMART-SPECTRA CCTV HUD */}
        <div className="relative rounded-2xl bg-neutral-950 p-4 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden">
          {/* Viewport Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono text-[10px] font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                PRESAGE OPTICAL POLYGRAPH
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Subject: {dossier.name}
              </span>
            </div>

            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
              phase === 'TESTIMONY'
                ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-neutral-900 text-neutral-400 border-neutral-700'
            }`}>
              {phase === 'TESTIMONY' ? '● HARVESTING BIOMETRICS' : 'STANDBY AUDIT'}
            </span>
          </div>

          {/* Live Webcam Frame */}
          <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-neutral-800 bg-black">
            <OpticalViewfinder
              onVitalsUpdate={handleVitalsUpdate}
              onCameraStateChange={setCameraState}
              isLocked={true}
            />

            {/* High-Tech Telemetry Overlay HUD */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur-xs border border-white/10 text-[10px] font-mono space-y-0.5">
              <div className="text-neutral-400">
                Baseline: <span className="text-emerald-400 font-bold">{baseline.restingBPM} BPM</span>
              </div>
              <div className="text-neutral-400">
                Live Pulse: <span className="text-cyan-300 font-bold">{liveVitals.currentBPM} BPM</span>
              </div>
            </div>

            {/* Stress Delta Pill */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded font-mono text-[10px] font-bold border backdrop-blur-xs flex items-center gap-1 ${
              liveDelta >= 15
                ? 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse'
                : liveDelta >= 8
                ? 'bg-amber-950/90 text-amber-300 border-amber-600'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-600'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              <span>&Delta; {liveDelta >= 0 ? `+${liveDelta}` : liveDelta} BPM STRESS</span>
            </div>

            {/* Audio Waveform Meter when speaking */}
            {isMicRecording && (
              <div className="absolute bottom-2 inset-x-2 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-xs border border-rose-500/50 flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  VOICE INPUT DETECTED
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(4, Math.min(20, (audioLevel / 100) * (15 + (i % 5) * 4)))}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Footer */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Camera: <strong className={cameraState === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}>{cameraState}</strong></span>
            <span>Gaze Deviations: <strong className="text-rose-400">{gazeDriftsRef.current}</strong></span>
            <span>Signal: <strong className="text-cyan-400">{liveVitals.signalQuality}</strong></span>
          </div>
        </div>
      </div>

      {/* CINEMATIC VISUAL NOVEL DIALOGUE & TESTIMONY CONSOLE */}
      <div className="rounded-2xl bg-neutral-950 border-2 border-neutral-800 p-5 shadow-2xl space-y-4">
        {/* PHASE 1: L ASKS THE FORENSIC QUESTION */}
        {phase === 'QUESTION' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                L&apos;S CROSS-EXAMINATION // {currentQuestion.badge}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Target Claim: {currentQuestion.claimTitle}
              </span>
            </div>

            <p className="font-mono text-base md:text-lg text-white leading-relaxed pl-3 border-l-2 border-rose-500">
              &ldquo;{currentQuestion.lQuestion}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-neutral-400">
                {currentQuestion.lSubtext}
              </span>

              <button
                onClick={() => {
                  soundFX.playClick();
                  testimonyStartTimeRef.current = Date.now();
                  setPhase('TESTIMONY');
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                <span>TESTIFY BEFORE L &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: CANDIDATE'S ACTIVE TESTIMONY (UNTIMED / ZERO RUSH) */}
        {phase === 'TESTIMONY' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  CANDIDATE TESTIMONY STATION // PRESAGE SENSORS RECORDING
                </span>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputMode('VOICE')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inputMode === 'VOICE'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speak (Mic)</span>
                </button>

                <button
                  onClick={() => setInputMode('KEYBOARD')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inputMode === 'KEYBOARD'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Type (Text)</span>
                </button>
              </div>
            </div>

            {/* Input Surface */}
            {inputMode === 'VOICE' ? (
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleVoiceRecording}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isMicRecording
                        ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] animate-pulse'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                  >
                    {isMicRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isMicRecording ? 'Stop Recording' : 'Start Speaking Defense'}</span>
                  </button>

                  <span className="text-xs font-mono text-neutral-400">
                    {isMicRecording ? 'Listening to voice...' : 'Click to speak your defense into the microphone'}
                  </span>
                </div>

                <div className="min-h-16 p-3 rounded-lg bg-black/60 border border-neutral-800 font-mono text-sm text-neutral-200">
                  {testimonyText || (
                    <span className="text-neutral-500 italic">
                      Your spoken defense will appear here live in real-time...
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={testimonyText}
                  onChange={(e) => setTestimonyText(e.target.value)}
                  placeholder="Type your technical defense to L's cross-examination..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>
            )}

            {/* Confirmation Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-neutral-400">
                Take as much time as needed. When ready, submit to L for 15-second deduction.
              </span>

              <button
                onClick={handleConfirmTestimony}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <Send className="w-4 h-4" />
                <span>CONFIRM TESTIMONY &amp; SUBMIT &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: L&apos;S 15-SECOND DEDUCTIVE SEQUENCE (COUNTDOWN) */}
        {phase === 'DEDUCTION' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-4 h-4" />
                L DEDUCTIVE ENGINE PROCESSING BIOFEEDBACK
              </span>

              {/* 15-Second Digital Clock */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400 uppercase">Deduction Clock:</span>
                <span className="font-['Orbitron'] text-xl font-black text-rose-400 tracking-widest">
                  {deductionTimer.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Terminal Logs as L Computes */}
            <div className="p-4 rounded-xl bg-black border border-rose-950 font-mono text-xs space-y-1.5 text-neutral-300">
              {deductionLogs.map((log, i) => (
                <div key={i} className="text-rose-400/90 flex items-center gap-2">
                  <span className="text-neutral-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="text-neutral-500 animate-pulse">&gt; Analyzing autonomic stress indicators...</div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>L is correlating speech timestamps with Presage rPPG cardiovascular telemetry...</span>
              <span className="text-rose-400 animate-pulse font-bold">15-SECOND SCRUTINY</span>
            </div>
          </div>
        )}

        {/* PHASE 4: VERDICT REVEAL (L DELIVERS THE VERDICT) */}
        {phase === 'VERDICT_REVEAL' && activeDeduction && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                L&apos;S DEDUCTIVE VERDICT // DECEPTION PROBABILITY: {activeDeduction.bluffProbability}%
              </span>

              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-mono text-xs font-bold animate-pulse">
                +{activeDeduction.suspicionDelta}% SUSPICION
              </span>
            </div>

            <p className="font-mono text-base md:text-lg text-white leading-relaxed pl-3 border-l-2 border-rose-500">
              &ldquo;{activeDeduction.deductionText}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Abort Trial</span>
              </button>

              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(225,29,72,0.4)]"
              >
                <span>
                  {questionIdx + 1 < questions.length
                    ? `PROCEED TO CLAIM ${questionIdx + 2} \u2192`
                    : 'PROCEED TO FINAL VERDICT \u2192'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
