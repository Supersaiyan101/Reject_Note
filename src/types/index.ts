export type AppStage = 
  | 'STAGE_1_LOBBY'
  | 'STAGE_2_ROSTER'
  | 'STAGE_3_CALIBRATION'
  | 'STAGE_4_INTERROGATION'
  | 'STAGE_5_VERDICT';

export interface FlaggedLandmine {
  id: string;
  category: 'MEGALOMANIA' | 'TIMELINE_PARADOX' | 'HARDWARE_ANOMALY' | 'BUZZWORD_OVERFLOW';
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
  sweetTooth: number; // e.g. 9000
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
