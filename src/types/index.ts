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
