export type AppStage = 
  | 'STAGE_1_LOBBY'
  | 'STAGE_2_ROSTER'
  | 'STAGE_3_CALIBRATION'
  | 'STAGE_4_INTERROGATION'
  | 'STAGE_5_VERDICT';

export interface FlaggedLandmine {
  id: string;
  category: string;
  title: string;
  claimText: string;
  suspicionPercent: number; // e.g., 99.8%
  lInterrogationAngle: string;
  badge: string;
}

export interface CandidateDossier {
  name: string;
  title: string;
  education: string;
  summary: string;
  buzzwordCount: number;
  powerLevel: string;
  flaggedLandmines: FlaggedLandmine[];
  rawText: string;
  isPreset: boolean;
}

export type InquisitorId = 'L' | 'MYSTERY_HR' | 'MYSTERY_GHOST';

export interface InquisitorStats {
  deduction: number; // 0 - 100
  mercy: number; // 0 - 100
  sweetTooth: string; // e.g. "500 Cubes / Day"
  opticalSensitivity: string; // e.g. "MAX"
}

export interface InquisitorProfile {
  id: InquisitorId;
  name: string;
  title: string;
  origin: string;
  quote: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'NIGHTMARE' | 'UNKNOWN';
  isUnlocked: boolean;
  mysteryNote?: string;
  hoverSecret?: string;
  stats?: InquisitorStats;
  voicePhrase?: string;
}

// STAGE 3: CALIBRATION & HARDWARE TYPES
export type OpticalMode = 'BROWSER_OPTICAL' | 'PRESAGE_SDK';
export type CameraState = 'INIT' | 'REQUESTING' | 'ACTIVE' | 'ERROR' | 'DENIED';

export interface BaselineCalibration {
  restingBPM: number;
  restingBreathingRate: number;
  calibratedAt: string;
  opticalMode: OpticalMode;
  isReady: boolean;
}

export interface LiveVitals {
  currentBPM: number;
  currentBreathingRate: number;
  stressDeltaBPM: number;
  waveform: number[];
  signalQuality: 'OPTIMAL' | 'FAIR' | 'SEARCHING';
}

// STAGE 4: INTERROGATION & FORENSIC TYPES
export interface InterrogationQuestion {
  id: string;
  claimTitle: string;
  category: string;
  lQuestion: string;
  lSubtext: string;
  badge: string;
  expectedKeywords?: string[];
}

export interface BiometricEvidence {
  questionId: string;
  claimTitle: string;
  candidateTestimony: string;
  baselineBPM: number;
  peakBPM: number;
  deltaBPM: number;
  avgBPM: number;
  gazeDeviations: number;
  fidgetIndex: number;
  durationSec: number;
  deductionVerdict: string;
  suspicionAdded: number;
}

export interface InterrogationSummary {
  candidateName: string;
  inquisitorId: InquisitorId;
  totalSuspicionPercent: number;
  evidenceLog: BiometricEvidence[];
  finalVerdict: 'GUILTY_REJECTED' | 'PROBATION_HIRED';
}
