import type { InquisitorProfile } from '../types';

export const INQUISITORS: InquisitorProfile[] = [
  {
    id: 'L',
    name: 'L',
    title: 'The "L"-ie Detector',
    origin: 'Death Note',
    quote: 'There is a 99.7% probability your resume is a complete bluff.',
    difficulty: 'NIGHTMARE',
    isUnlocked: true,
    stats: {
      deduction: 100,
      mercy: 0,
      sweetTooth: 9001,
      opticalSensitivity: 'MAX',
    },
    voicePhrase: 'Light-kun... do you truly believe your heart rate will not betray you? Let us begin the trial.',
  },
  {
    id: 'MYSTERY_HR',
    name: '???',
    title: 'CLASSIFIED BY HR',
    origin: 'Mystery Anime',
    quote: '[REDACTED PENDING EXECUTIVE BACKGROUND CHECK]',
    difficulty: 'UNKNOWN',
    isUnlocked: false,
    mysteryNote: 'Waiting for background check & drug test to clear...',
    hoverSecret: 'ACCESS DENIED: Candidate clearance level insufficient.',
  },
  {
    id: 'MYSTERY_GHOST',
    name: '???',
    title: 'GHOSTED THE RECRUITER',
    origin: 'Mystery Anime',
    quote: '[EXAMINER WAS LAST SEEN AT A HACKATHON AFTERPARTY]',
    difficulty: 'UNKNOWN',
    isUnlocked: false,
    mysteryNote: 'Currently interviewing at 14 other startups simultaneously...',
    hoverSecret: 'STATUS: Backpacking across Shibuya on a self-discovery gap year.',
  },
];

