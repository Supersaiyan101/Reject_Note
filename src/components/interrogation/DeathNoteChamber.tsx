import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { 
  CandidateDossier, 
  InquisitorProfile, 
  BaselineCalibration, 
  LiveVitals, 
  BiometricEvidence,
  InterrogationSummary,
  CameraState,
  PeakStressMoment
} from '../../types';
import { generateQuestionsForDossier, synthesizeLDeduction } from '../../services/interrogationEngine';
import { candidateVoiceEngine } from '../../services/voiceEngine';
import { generateGeminiRoast, isGeminiEnabled } from '../../services/geminiService';
import { OpticalViewfinder } from '../OpticalViewfinder';
import { soundFX } from '../../utils/sfx';
import { realAudio } from '../../utils/realAudio';
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
  Clock,
  Zap,
  Sparkles
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
  const questions = useMemo(() => generateQuestionsForDossier(dossier), [dossier]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = questions[questionIdx];

  // Chamber flow phase
  const [phase, setPhase] = useState<ChamberPhase>('QUESTION');
  
  // Testimony inputs
  const [inputMode, setInputMode] = useState<'VOICE' | 'KEYBOARD'>('VOICE');
  const [testimonyText, setTestimonyText] = useState('');
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);

  // Biometrics harvest during testimony
  const [liveVitals, setLiveVitals] = useState<LiveVitals>({
    currentBPM: baseline.restingBPM,
    currentBreathingRate: baseline.restingBreathingRate,
    stressDeltaBPM: 0,
    waveform: [],
    respirationWaveform: [],
    signalQuality: 'OPTIMAL',
    isFaceLocked: true,
    faceConfidence: 1.0,
    motionEnergy: 0,
    faceStatus: 'LOCKED',
    hrvMs: 75,
    blinkRate: 14,
    sympatheticTone: 10,
    gazeAlignment: 'LOCKED',
  });
  const [cameraState, setCameraState] = useState<CameraState>('ACTIVE');

  // Track peak BPM and gaze deviations during active testimony
  const peakBPMRef = useRef(baseline.restingBPM);
  const bpmReadingsRef = useRef<number[]>([]);
  const timedSamplesRef = useRef<{ phrase: string; bpm: number; deltaBPM: number; timestampMs: number }[]>([]);
  const peakStressMomentRef = useRef<PeakStressMoment | undefined>(undefined);
  const [gazeDrifts, setGazeDrifts] = useState(0);
  const lastGazeDriftTimeRef = useRef(0);
  const testimonyStartTimeRef = useRef(0);

  // L 15-second deduction phase
  const [deductionTimer, setDeductionTimer] = useState(15.0);
  const [deductionLogs, setDeductionLogs] = useState<string[]>([]);
  const [activeDeduction, setActiveDeduction] = useState<{
    deductionText: string;
    suspicionDelta: number;
    bluffProbability: number;
    source?: 'GEMINI_LLM' | 'HEURISTIC';
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
    };
  }, []);

  // When question changes, prepare question and start theme music
  useEffect(() => {
    setPhase('QUESTION');
    setTestimonyText('');
    peakBPMRef.current = baseline.restingBPM;
    bpmReadingsRef.current = [];
    setGazeDrifts(0);

    // L's theme plays during cross-examination
    realAudio.playLTheme();
    setIsThemePlaying(true);
    soundFX.playDramaticSting();
  }, [questionIdx, currentQuestion, baseline.restingBPM]);

  // Handle vitals updates from Presage optical camera
  const handleVitalsUpdate = (vitals: LiveVitals) => {
    setLiveVitals(vitals);

    // If candidate is actively testifying, log peak BPM and detect genuine gaze shifts
    if (phase === 'TESTIMONY') {
      if (vitals.currentBPM > peakBPMRef.current) {
        peakBPMRef.current = vitals.currentBPM;
      }
      bpmReadingsRef.current.push(vitals.currentBPM);

      // Detect genuine gaze drift or head evasion, debounced to at most once per 2 seconds
      const now = Date.now();
      if ((vitals.faceStatus === 'NOT_CENTERED' || vitals.gazeAlignment === 'EVADING') && (now - lastGazeDriftTimeRef.current > 2000)) {
        lastGazeDriftTimeRef.current = now;
        setGazeDrifts((prev) => prev + 1);
      }

      // Time-correlated biometric phrase tracking
      if (testimonyTextRef.current && testimonyTextRef.current.trim().length > 0) {
        const words = testimonyTextRef.current.trim().split(/\s+/);
        const phraseSlice = words.slice(-4).join(' ');
        const delta = Math.max(0, vitals.currentBPM - baseline.restingBPM);
        timedSamplesRef.current.push({
          phrase: phraseSlice,
          bpm: vitals.currentBPM,
          deltaBPM: delta,
          timestampMs: now - testimonyStartTimeRef.current,
        });
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
      setVoiceWarning(null);
      const supported = await candidateVoiceEngine.startListening({
        onTranscriptUpdate: (text) => {
          setTestimonyText(text);
          setVoiceWarning(null);
        },
        onAudioLevel: (level) => {
          setAudioLevel(level);
        },
        onError: (err) => {
          console.warn('Voice error:', err);
          if (err === 'not-allowed' || err === 'mic-permission-denied') {
            setVoiceWarning('Microphone permission blocked. Please allow mic access in your browser or switch to Keyboard mode.');
          } else if (err === 'network') {
            setVoiceWarning('Speech recognition blocked by browser shield (Brave blocks Google speech API by default). Mic level is active — type defense below or enable Google services in brave://settings/privacy.');
          } else if (err !== 'no-speech') {
            setVoiceWarning(`Speech recognition note: ${err}. You can type directly in keyboard mode.`);
          }
        },
        onListeningStateChange: (state) => {
          setIsMicRecording(state);
        },
      });

      if (!supported && !candidateVoiceEngine.isSpeechRecognitionSupported()) {
        setVoiceWarning('Browser speech recognition not supported in this browser. Switching to Keyboard mode.');
        setInputMode('KEYBOARD');
      }
    }
  };

  // Stable refs to decouple the timer effect from high-frequency camera frame loops
  const activeDeductionRef = useRef(activeDeduction);
  activeDeductionRef.current = activeDeduction;

  const liveVitalsRef = useRef(liveVitals);
  liveVitalsRef.current = liveVitals;

  const testimonyTextRef = useRef(testimonyText);
  testimonyTextRef.current = testimonyText;

  const gazeDriftsRef = useRef(gazeDrifts);
  gazeDriftsRef.current = gazeDrifts;

  const handleRevealVerdict = useCallback(() => {
    const deduction = activeDeductionRef.current;
    if (!deduction) return;

    soundFX.playDramaticSting();
    setPhase('VERDICT_REVEAL');
    setSuspicionPercent((prev) => Math.min(100, prev + deduction.suspicionDelta));

    const vitalsNow = liveVitalsRef.current;
    const evidenceItem: BiometricEvidence = {
      questionId: currentQuestion.id,
      claimTitle: currentQuestion.claimTitle,
      candidateTestimony: testimonyTextRef.current || '[Refused to testify]',
      baselineBPM: baseline.restingBPM,
      peakBPM: peakBPMRef.current,
      deltaBPM: Math.max(0, peakBPMRef.current - baseline.restingBPM),
      avgBPM: Math.round(
        bpmReadingsRef.current.length > 0
          ? bpmReadingsRef.current.reduce((a, b) => a + b, 0) / bpmReadingsRef.current.length
          : vitalsNow.currentBPM
      ),
      gazeDeviations: gazeDriftsRef.current,
      fidgetIndex: Math.min(100, gazeDriftsRef.current * 18 + 20),
      durationSec: Math.max(2, Math.round((Date.now() - testimonyStartTimeRef.current) / 1000)),
      deductionVerdict: deduction.deductionText,
      suspicionAdded: deduction.suspicionDelta,
      hrvMs: vitalsNow.hrvMs,
      blinkRate: vitalsNow.blinkRate,
      sympatheticTone: vitalsNow.sympatheticTone,
      peakStressMoment: peakStressMomentRef.current,
    };
    setEvidenceLog((prev) => [...prev, evidenceItem]);

    realAudio.playLTheme();
    setIsThemePlaying(true);
  }, [currentQuestion, baseline.restingBPM]);

  // Candidate confirms testimony -> Starts 6-second L deduction
  const handleConfirmTestimony = () => {
    soundFX.playDramaticSting();
    candidateVoiceEngine.stopListening();
    setIsMicRecording(false);

    const durationSec = Math.max(2, Math.round((Date.now() - testimonyStartTimeRef.current) / 1000));
    const allBPM = bpmReadingsRef.current.length > 0 ? bpmReadingsRef.current : [liveVitals.currentBPM];
    const avgBPM = Math.round(allBPM.reduce((a, b) => a + b, 0) / allBPM.length);
    const peakBPM = Math.max(peakBPMRef.current, liveVitals.currentBPM);
    const deltaBPM = Math.max(0, peakBPM - baseline.restingBPM);

    // Extract highest stress phrase from timed samples
    let peakMoment: PeakStressMoment | undefined = undefined;
    if (timedSamplesRef.current.length > 0) {
      const sorted = [...timedSamplesRef.current].sort((a, b) => b.deltaBPM - a.deltaBPM);
      if (sorted[0] && sorted[0].deltaBPM >= 4 && sorted[0].phrase.trim().length > 1) {
        peakMoment = {
          phrase: sorted[0].phrase,
          peakBPM: sorted[0].bpm,
          deltaBPM: sorted[0].deltaBPM,
          timestampMs: sorted[0].timestampMs,
        };
      }
    }
    peakStressMomentRef.current = peakMoment;

    const deduction = synthesizeLDeduction(currentQuestion, testimonyText, {
      candidateName: dossier.name,
      isPreset: dossier.isPreset,
      questionIndex: questionIdx,
      baselineBPM: baseline.restingBPM,
      peakBPM,
      deltaBPM,
      avgBPM,
      gazeDeviations: gazeDrifts,
      durationSec,
      hrvMs: liveVitals.hrvMs,
      blinkRate: liveVitals.blinkRate,
      sympatheticTone: liveVitals.sympatheticTone,
      peakStressMoment: peakMoment,
    });

    setActiveDeduction(deduction);
    activeDeductionRef.current = deduction;
    setPhase('DEDUCTION');
    setDeductionTimer(6.0);
    setDeductionLogs([
      `[00:01] Parsing candidate statement (${testimonyText.trim().split(/\s+/).length} words)...`,
      `[00:02] Presage rPPG: Peak pulse detected at ${peakBPM} BPM (+${deltaBPM} BPM surge).`,
      ...(peakMoment ? [`[00:02] Temporal Tell: Heart rate surged while saying "${peakMoment.phrase}".`] : []),
    ]);

    // Asynchronously call Gemini LLM for an unhinged, dynamic, bespoke roast
    if (isGeminiEnabled()) {
      setDeductionLogs((prev) => [
        ...prev,
        `[00:02] Querying Gemini Neural AI for real-time psychoanalysis...`,
      ]);
      generateGeminiRoast({
        candidateName: dossier.name,
        isPreset: dossier.isPreset,
        questionIndex: questionIdx,
        question: currentQuestion,
        testimony: testimonyText,
        biometrics: {
          baselineBPM: baseline.restingBPM,
          peakBPM,
          deltaBPM,
          avgBPM,
          gazeDeviations: gazeDrifts,
          durationSec,
          hrvMs: liveVitals.hrvMs,
          blinkRate: liveVitals.blinkRate,
          sympatheticTone: liveVitals.sympatheticTone,
        },
      }).then((llmResult) => {
        if (llmResult) {
          setActiveDeduction(llmResult);
          activeDeductionRef.current = llmResult;
          setDeductionLogs((prev) => [
            ...prev,
            `[00:03] Gemini 2.0 Flash: Synthesized forensic roast with 100% precision.`,
          ]);
        }
      });
    }
  };

  // 6-Second L Deductive Countdown (decoupled from liveVitals frame rate)
  useEffect(() => {
    if (phase !== 'DEDUCTION') return;

    let timeLeft = 6.0;
    const interval = setInterval(() => {
      timeLeft = Math.max(0, Math.round((timeLeft - 0.1) * 10) / 10);
      setDeductionTimer(timeLeft);

      // Play heartbeat thump every 1.2s to build anime tension
      if (Math.round(timeLeft * 10) % 12 === 0) {
        soundFX.playHeartbeat();
      }

      // Add forensic log lines as L computes
      if (timeLeft === 4.5) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:03] Presage Ch.02: Evaluating HRV autonomic tone & vagal suppression...`,
        ]);
      } else if (timeLeft === 3.0) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:04] Presage Ch.03: Micro-saccades & ${gazeDriftsRef.current} gaze aversions verified.`,
        ]);
      } else if (timeLeft === 1.5) {
        setDeductionLogs((prev) => [
          ...prev,
          `[00:05] Deception probability synthesized: ${activeDeductionRef.current?.bluffProbability}%...`,
        ]);
      }

      // At 00:00: Deductive verdict unlocked
      if (timeLeft <= 0) {
        clearInterval(interval);
        handleRevealVerdict();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, handleRevealVerdict]);

  // Advance to next question or final verdict
  const handleNextStep = () => {
    soundFX.playClick();

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
              isLocked={false}
              showSharingan={false}
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
            <span>Gaze Deviations: <strong className="text-rose-400">{gazeDrifts}</strong></span>
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
                  peakBPMRef.current = liveVitals.currentBPM;
                  bpmReadingsRef.current = [liveVitals.currentBPM];
                  timedSamplesRef.current = [];
                  peakStressMomentRef.current = undefined;
                  setGazeDrifts(0);
                  // Stop music so candidate speaks in high-stakes silence
                  realAudio.pauseLTheme();
                  setIsThemePlaying(false);
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
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

                    {/* Live Audio VU Level Bar */}
                    {isMicRecording && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-400">Mic Level:</span>
                        <div className="w-20 h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-75"
                            style={{ width: `${Math.max(8, audioLevel)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-mono text-neutral-400">
                    {isMicRecording ? 'Recording microphone speech...' : 'Click to speak your defense'}
                  </span>
                </div>

                {voiceWarning && (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/50 text-[11px] font-mono text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p>{voiceWarning}</p>
                      <button
                        type="button"
                        onClick={() => setInputMode('KEYBOARD')}
                        className="text-xs text-amber-200 underline font-bold cursor-pointer hover:text-white"
                      >
                        Switch to Type (Text) Mode
                      </button>
                    </div>
                  </div>
                )}

                <div className="min-h-16 p-3 rounded-lg bg-black/60 border border-neutral-800 font-mono text-sm text-neutral-200">
                  {testimonyText || (
                    <span className="text-neutral-500 italic">
                      Your spoken defense will appear here live in real-time...
                    </span>
                  )}
                </div>

                {/* Quick Auto-Fill suggestion pill */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Need quick testimony?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestimonyText(currentQuestion.suggestedDefense || `I architected this project from the ground up, guaranteeing strict p99 latency benchmarks and automated fault tolerance without regression.`);
                    }}
                    className="text-neutral-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                  >
                    Auto-Fill Statement
                  </button>
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
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Need quick testimony?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestimonyText(currentQuestion.suggestedDefense || `I architected this project from the ground up, guaranteeing strict p99 latency benchmarks and automated fault tolerance without regression.`);
                    }}
                    className="text-neutral-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                  >
                    Auto-Fill Statement
                  </button>
                </div>
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

              {/* Deduction Digital Clock & Fast-Forward Action */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRevealVerdict}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(225,29,72,0.3)]"
                  title="Skip analysis countdown and reveal L's verdict immediately"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reveal Verdict Now &rarr;</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Clock:</span>
                  <span className="font-['Orbitron'] text-xl font-black text-rose-400 tracking-widest">
                    {deductionTimer.toFixed(1)}s
                  </span>
                </div>
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
              <div className="text-neutral-500 animate-pulse">&gt; Analyzing Presage autonomic stress telemetry...</div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>L is correlating speech timestamps with Presage rPPG cardiovascular telemetry...</span>
              <span className="text-rose-400 animate-pulse font-bold">BIOFEEDBACK SCRUTINY</span>
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

              <div className="flex items-center gap-2">
                {activeDeduction.source === 'GEMINI_LLM' && (
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500 font-mono text-[10px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                    <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                    <span>GEMINI AI LIVE</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-mono text-xs font-bold animate-pulse">
                  +{activeDeduction.suspicionDelta}% SUSPICION
                </span>
              </div>
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
