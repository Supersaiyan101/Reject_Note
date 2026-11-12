import type { CandidateDossier } from '../types';

export const LIGHT_YAGAMI_DOSSIER: CandidateDossier = {
  name: 'Light Yagami',
  title: 'Divine Lead System Architect & Chief Justice Optimizer',
  education: 'To-Oh University // Top Entrance Score: 100% (Valedictorian)',
  summary: 'Supreme honors prodigy with unmatched deductive intellect, flawless tennis mechanics, and 10+ years of self-appointed moral superiority. "Nah, I\'d win." "I am creating an ideal, bug-free world."',
  buzzwordCount: 9001,
  powerLevel: 'OVER 9,000!',
  isPreset: true,
  flaggedLandmines: [
    {
      id: 'landmine-1',
      category: 'HARDWARE_ANOMALY',
      title: 'Covert Potato-Chip LCD Workstation',
      claimText: 'Engineered and deployed an edge-computed miniature LCD monitor hidden inside a bag of barbecue potato chips; maintained steady heart rate while taking a potato chip... AND EATING IT.',
      suspicionPercent: 99.7,
      lInterrogationAngle: 'Light-kun... you claim this rig had 0ms latency and left zero grease on the lens. But why did your pulse spike by 24 BPM when I mentioned potato chips?',
      badge: 'POTATO CHIP PROTOCOL',
    },
    {
      id: 'landmine-2',
      category: 'MEGALOMANIA',
      title: '40-Second Autonomous Incident SLA',
      claimText: 'Architected a real-time event-driven distributed pipeline guaranteeing complete ticket resolution within precisely 40 seconds (failure mode: unexpected cardiac arrest).',
      suspicionPercent: 99.9,
      lInterrogationAngle: 'A 40-second SLA that results in fatal heart attacks? Light-kun, there is an 87.4% probability you are describing the Kira killings.',
      badge: '40-SEC KIRA SLA',
    },
    {
      id: 'landmine-3',
      category: 'TIMELINE_PARADOX',
      title: 'Bimanual Multi-Threaded C++ Multitasking',
      claimText: 'Junior Kanto Tennis Champion; claims to write lock-free memory-safe C++ with his left hand while solving differential equations with his right.',
      suspicionPercent: 96.8,
      lInterrogationAngle: 'No human writes memory-safe C++ with one hand while eating chips with the other. The probability of complete bluff is virtually 100%.',
      badge: 'C++ GOD COMPLEX',
    },
    {
      id: 'landmine-4',
      category: 'BUZZWORD_OVERFLOW',
      title: 'Quantum Cloud Synergy Deployment',
      claimText: 'Revolutionized microservices using Kubernetes, Rust, WebAssembly, and Divine Consensus algorithms to eliminate 100% of human error.',
      suspicionPercent: 94.2,
      lInterrogationAngle: 'Divine consensus? Light-kun, that is not an industry protocol. That is a god complex.',
      badge: 'DIVINE CONSENSUS',
    },
  ],
  rawText: `LIGHT YAGAMI
To-Oh University, Valedictorian
Divine Lead System Architect

SUMMARY:
Supreme honors prodigy with unmatched deductive intellect, flawless tennis mechanics, and 10+ years of self-appointed moral superiority. Over 9,000 verified buzzwords. "I am creating an ideal, bug-free world."

EXPERIENCE:
National Police Agency Task Force | Lead Cyber Investigator Intern
- Collaborated closely with an annoying British detective who will not stop staring at my vitals and eating strawberry cake.
- Solved 100% of cyber cold cases with zero false positives.
- Maintained a completely calm 68 BPM resting heart rate under 64 camera angles.

PROJECTS:
1. Covert Potato-Chip LCD Workstation
   Engineered and deployed an edge-computed miniature LCD monitor hidden inside a bag of barbecue potato chips; maintained steady heart rate while taking a potato chip... AND EATING IT.
2. 40-Second Autonomous Incident SLA
   Architected a real-time event-driven distributed pipeline guaranteeing complete ticket resolution within precisely 40 seconds (failure mode: unexpected cardiac arrest).
3. Bimanual Multi-Threaded C++ Multitasking
   Junior Kanto Tennis Champion; claims to write lock-free memory-safe C++ with his left hand while solving differential equations with his right.`,
};

// Generic parser for user-uploaded custom resumes
export function parseCustomResume(fileName: string, text: string): CandidateDossier {
  const buzzwords = [
    'kubernetes', 'docker', 'rust', 'c++', 'ai', 'neural', 'cloud', 'blockchain',
    'distributed', 'agile', 'scrum', 'microservices', 'quantum', 'synergy',
    'full-stack', 'paradigm', 'optimization', 'machine learning', 'llm', 'zero downtime'
  ];

  let detectedCount = 0;
  const lower = text.toLowerCase();
  buzzwords.forEach((bw) => {
    const matches = lower.match(new RegExp(`\\b${bw}\\b`, 'g'));
    if (matches) detectedCount += matches.length * 420; // Anime inflated scouter math
  });

  const finalBuzzwordCount = Math.max(9001, detectedCount + Math.floor(Math.random() * 2000));

  // Extract candidate name from first line or filename
  const firstLine = text.split('\n')[0]?.trim();
  const candidateName = firstLine && firstLine.length < 35 ? firstLine : fileName.replace(/\.[^/.]+$/, '');

  return {
    name: candidateName || 'Anonymous Applicant',
    title: 'Senior 10x Full-Stack Operative',
    education: 'Classified Self-Taught Academy // Level 99 Coding Ninja',
    summary: `Extracted ${detectedCount} high-density tech buzzwords from candidate document. Scouter readings indicate excessive confidence and high probability of bluffing.`,
    buzzwordCount: finalBuzzwordCount,
    powerLevel: 'OVER 9,000!',
    isPreset: false,
    flaggedLandmines: [
      {
        id: 'custom-1',
        category: 'BUZZWORD_OVERFLOW',
        title: 'High-Density Buzzword Concentration',
        claimText: `Document contains an overwhelming concentration of tech jargon (${finalBuzzwordCount} scouter points).`,
        suspicionPercent: 95.4,
        lInterrogationAngle: 'You loaded your CV with buzzwords. But can your pulse remain calm when I ask you to explain how they actually work?',
        badge: 'BUZZWORD OVERLOAD',
      },
      {
        id: 'custom-2',
        category: 'TIMELINE_PARADOX',
        title: 'Senior Velocity Anomaly',
        claimText: 'Claims extensive multi-year architectural mastery across incompatible technology generations.',
        suspicionPercent: 93.1,
        lInterrogationAngle: 'Your timeline contains severe temporal paradoxes. Let us see if your respiration rate agrees.',
        badge: 'TIMELINE PARADOX',
      },
      {
        id: 'custom-3',
        category: 'MEGALOMANIA',
        title: 'Single-Handed Optimization Boast',
        claimText: 'Boasts of single-handedly refactoring enterprise architecture without introducing regression bugs.',
        suspicionPercent: 97.2,
        lInterrogationAngle: 'Zero regressions on an enterprise rewrite? That is scientifically impossible. Presage sensors will expose the truth.',
        badge: 'UNREALISTIC BOAST',
      },
    ],
    rawText: text,
  };
}
