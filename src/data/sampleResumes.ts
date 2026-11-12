import type { CandidateDossier } from '../types';

export const LIGHT_YAGAMI_DOSSIER: CandidateDossier = {
  name: 'Light Yagami',
  title: 'Software Engineering Intern | National Police Agency Task Force',
  education: 'To-Oh University // Top Entrance Score: 100% (Valedictorian)',
  summary: 'Valedictorian at To-Oh University with research experience at the National Police Agency Task Force. Specializing in high-performance C++ systems, edge hardware engineering, and zero-latency distributed automation.',
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
Software Engineering Intern | National Police Agency Task Force

SUMMARY:
Valedictorian at To-Oh University with research experience at the National Police Agency Task Force. Specializing in high-performance C++ systems, edge hardware engineering, and zero-latency distributed automation.

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

// Intelligent parser for user-uploaded custom resumes
export function parseCustomResume(fileName: string, text: string): CandidateDossier {
  // 1. Sanitize text: filter out binary/PDF artifacts and empty lines
  const rawLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const cleanLines = rawLines.filter((l) => {
    const s = l.trim();
    if (s.startsWith('%') || s.startsWith('<<') || s.startsWith('>>') || s.endsWith('obj') || s === 'endobj') {
      return false;
    }
    if (/^[0-9]+\s+[0-9]+\s+obj/i.test(s)) return false;
    if (/^(\/|stream|endstream|xref|trailer|startxref)/i.test(s)) return false;
    if (/ReportLab Generated/i.test(s)) return false;
    return true;
  });

  const lines = cleanLines.length > 0 ? cleanLines : rawLines;

  // 2. Extract Candidate Name (First clean line that looks like a name or filename)
  let candidateName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
  for (const line of lines.slice(0, 4)) {
    const isHeader = /^(education|experience|skills|projects|summary|objective|curriculum|resume)/i.test(line);
    const hasContact = /(@|http|www|\.com|\+?\d{2,})/i.test(line);
    const isAlpha = /^[a-zA-Z\s.'-]+$/.test(line);
    if (!isHeader && !hasContact && isAlpha && line.length >= 2 && line.length <= 40) {
      candidateName = line;
      break;
    }
  }

  // 3. Extract Professional Title
  const titleKeywords = [
    'software engineer', 'full stack', 'frontend', 'backend', 'developer',
    'architect', 'intern', 'analyst', 'lead', 'devops', 'engineer', 'specialist',
    'cloud engineer', 'data scientist', 'machine learning'
  ];
  let extractedTitle = '';
  for (const line of lines.slice(0, 8)) {
    const lLower = line.toLowerCase();
    if (titleKeywords.some((kw) => lLower.includes(kw)) && line.length < 65) {
      extractedTitle = line.replace(/^[|•\-\s]+/, '').trim();
      break;
    }
  }
  const candidateTitle = extractedTitle || 'Software Engineer';

  // 4. Extract Education
  const eduKeywords = ['university', 'college', 'b.s.', 'm.s.', 'b.tech', 'b.e.', 'computer science', 'degree', 'institute', 'bachelor', 'master'];
  let extractedEdu = '';
  for (const line of lines) {
    const lLower = line.toLowerCase();
    if (eduKeywords.some((kw) => lLower.includes(kw)) && line.length < 80) {
      extractedEdu = line.replace(/^[|•\-\s]+/, '').trim();
      break;
    }
  }
  const candidateEdu = extractedEdu || 'B.S. in Computer Science & Engineering';

  // 5. Extract Real Intro / Summary Paragraph
  let extractedSummary = '';
  const summaryHeaderIdx = lines.findIndex((l) =>
    /^(summary|about|profile|objective|bio|professional summary):?$/i.test(l)
  );
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    extractedSummary = lines[summaryHeaderIdx + 1];
    if (lines[summaryHeaderIdx + 2] && lines[summaryHeaderIdx + 2].length > 25 && !lines[summaryHeaderIdx + 2].startsWith('-')) {
      extractedSummary += ' ' + lines[summaryHeaderIdx + 2];
    }
  } else {
    // Look for first substantive sentence paragraph (longer than 45 chars, not a bullet)
    const candidateP = lines.slice(1, 10).find((l) => 
      l.length >= 45 && 
      !l.startsWith('-') && 
      !l.startsWith('•') && 
      !/@|www|http/i.test(l) &&
      !/^(education|skills|experience|projects)/i.test(l)
    );
    if (candidateP) {
      extractedSummary = candidateP;
    }
  }
  const candidateSummary =
    extractedSummary ||
    'Software engineer with a focus on building scalable systems, clean architecture, and reliable services.';

  // 6. Extract 4 Active Project / Experience Claim Cards
  const bulletLines = lines.filter((l) =>
    /^[-*•\d.]\s+/.test(l) ||
    /^(built|developed|architected|engineered|designed|led|created|implemented|optimized|scaled|managed|deployed|spearheaded|automated)\b/i.test(l)
  );

  const landmines: CandidateDossier['flaggedLandmines'] = [];
  const defaultBadges = ['CORE ARCHITECTURE', 'PERFORMANCE METRIC', 'DATABASE & STORAGE', 'CLOUD DEPLOYMENT'];

  for (let i = 0; i < Math.min(4, bulletLines.length); i++) {
    const cleanLine = bulletLines[i].replace(/^[-*•\d.]\s+/, '').trim();
    const words = cleanLine.split(/\s+/);
    const shortTitle = words.slice(0, 5).join(' ').replace(/[,;:.]$/, '');
    landmines.push({
      id: `custom-claim-${i + 1}`,
      category: i % 2 === 0 ? 'TECHNICAL_SCRUTINY' : 'PERFORMANCE_AUDIT',
      title: shortTitle.length > 3 ? shortTitle : `Engineering Achievement #${i + 1}`,
      claimText: cleanLine,
      suspicionPercent: Math.round((92 + Math.random() * 6) * 10) / 10,
      lInterrogationAngle: `Candidate-kun... can you defend this claim under optical polygraph scrutiny?`,
      badge: defaultBadges[i] || 'SYSTEM CLAIM',
    });
  }

  // If fewer than 4 bullets found in resume, fill remaining with smart technical probes
  const fallbackClaims = [
    {
      title: 'Scalable System Architecture',
      claimText: 'Engineered maintainable software components and automated workflows with zero regression downtime.',
      badge: 'SYSTEM DESIGN',
      category: 'TECHNICAL_SCRUTINY' as const,
    },
    {
      title: 'High-Throughput API Resilience',
      claimText: 'Delivered secure REST APIs and microservice communication under strict p99 latency benchmarks.',
      badge: 'API RESILIENCE',
      category: 'PERFORMANCE_AUDIT' as const,
    },
    {
      title: 'Data Modeling & Query Tuning',
      claimText: 'Optimized schema indices and caching layers to minimize database connection starvation.',
      badge: 'DATABASE INTEGRITY',
      category: 'TECHNICAL_SCRUTINY' as const,
    },
    {
      title: 'Production Incident Recovery',
      claimText: 'Maintained resilient deployment cadence and handled unexpected production alerts without service interruption.',
      badge: 'INCIDENT PROTOCOL',
      category: 'PERFORMANCE_AUDIT' as const,
    },
  ];

  let fIdx = 0;
  while (landmines.length < 4 && fIdx < fallbackClaims.length) {
    const fb = fallbackClaims[fIdx];
    landmines.push({
      id: `custom-fallback-${landmines.length + 1}`,
      category: fb.category,
      title: fb.title,
      claimText: fb.claimText,
      suspicionPercent: Math.round((93 + Math.random() * 5) * 10) / 10,
      lInterrogationAngle: 'Can your autonomic pulse verify that you implemented this without copying boilerplate?',
      badge: fb.badge,
    });
    fIdx++;
  }

  return {
    name: candidateName,
    title: candidateTitle,
    education: candidateEdu,
    summary: candidateSummary,
    buzzwordCount: 4200,
    powerLevel: 'SPECIAL GRADE',
    isPreset: false,
    flaggedLandmines: landmines.slice(0, 4),
    rawText: text,
  };
}
