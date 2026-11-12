import type { CandidateDossier, InterrogationQuestion } from '../types';

export function generateQuestionsForDossier(dossier: CandidateDossier): InterrogationQuestion[] {
  // 1. If Light Yagami Preset: use the authentic Death Note battle questions
  if (dossier.isPreset) {
    return [
      {
        id: 'q-preset-1',
        category: 'HARDWARE_ANOMALY',
        claimTitle: 'Covert Potato-Chip LCD Workstation',
        lQuestion: 'Light-kun... you claim this covert edge-computed LCD rig had 0ms latency and left zero grease on the lens. Testify: why barbecue chips, and why did your pulse surge when I said "potato"?',
        lSubtext: 'Interrogating edge hardware claim & salt-to-silicon ratio.',
        badge: 'POTATO CHIP PROTOCOL',
        expectedKeywords: ['chip', 'lcd', 'covert', 'zero', 'monitor', 'grease'],
      },
      {
        id: 'q-preset-2',
        category: 'MEGALOMANIA',
        claimTitle: '40-Second Autonomous Incident SLA',
        lQuestion: 'A distributed pipeline guaranteeing ticket resolution in precisely 40 seconds via fatal cardiac arrest? Light-kun, there is an 87.4% probability you are describing the Kira killings. Explain this SLA.',
        lSubtext: 'Analyzing distributed incident resolution vs heart attack timing.',
        badge: '40-SEC KIRA SLA',
        expectedKeywords: ['sla', 'second', 'pipeline', 'kira', 'cardiac', 'arrest'],
      },
      {
        id: 'q-preset-3',
        category: 'TIMELINE_PARADOX',
        claimTitle: 'Bimanual Multi-Threaded C++ Multitasking',
        lQuestion: 'Junior Kanto Tennis Champion... you claim to write lock-free memory-safe C++ with your left hand while solving differential equations with your right. No human writes memory-safe C++ with one hand. Defend your concurrency model.',
        lSubtext: 'Auditing bimanual multi-threading vs physical human limitation.',
        badge: 'C++ GOD COMPLEX',
        expectedKeywords: ['c++', 'thread', 'lock', 'free', 'memory', 'concurrency'],
      },
      {
        id: 'q-preset-4',
        category: 'BUZZWORD_OVERFLOW',
        claimTitle: 'Quantum Cloud Synergy Deployment',
        lQuestion: 'Divine Consensus is not an industry-standard consensus protocol. That is a god complex. Candidate-kun, what occurs when your distributed node fails to achieve godhood?',
        lSubtext: 'Probing metaphysical consensus claims in cloud infrastructure.',
        badge: 'DIVINE CONSENSUS',
        expectedKeywords: ['divine', 'consensus', 'cloud', 'god', 'distributed'],
      },
    ];
  }

  // 2. Custom / Normal Uploaded Resumes: Scan rawText for real-world technical skills
  const text = (dossier.rawText || dossier.summary || '').toLowerCase();
  const questions: InterrogationQuestion[] = [];

  // Check Frontend / React
  if (text.includes('react') || text.includes('vue') || text.includes('frontend') || text.includes('css') || text.includes('javascript') || text.includes('typescript')) {
    questions.push({
      id: 'q-custom-frontend',
      category: 'TECHNICAL_SCRUTINY',
      claimTitle: 'Frontend State & Architecture Claim',
      lQuestion: 'Candidate-kun... you claim proficiency in modern frontend frameworks. Explain why your components re-render unpredictably, or did your pulse surge because you blindly wrap everything in useCallback without understanding dependency arrays?',
      lSubtext: 'Auditing DOM reconciliation and re-render profiling.',
      badge: 'FRONTEND ARCHITECTURE',
      expectedKeywords: ['render', 'hook', 'state', 'dom', 'component', 'props'],
    });
  }

  // Check Backend / APIs / Node / Python
  if (text.includes('api') || text.includes('node') || text.includes('python') || text.includes('backend') || text.includes('microservice') || text.includes('express') || text.includes('fastapi')) {
    questions.push({
      id: 'q-custom-backend',
      category: 'PERFORMANCE_AUDIT',
      claimTitle: 'High-Throughput API Resilience',
      lQuestion: 'You claim to have architected scalable backend APIs. When your event loop blocks on heavy synchronous operations under peak traffic, how do you prevent connection pool starvation? Your respiration rate suggests you have never profiled production leaks.',
      lSubtext: 'Investigating async I/O bottlenecks and memory profiling.',
      badge: 'BACKEND RESILIENCE',
      expectedKeywords: ['event', 'loop', 'async', 'pool', 'latency', 'load'],
    });
  }

  // Check Databases / SQL
  if (text.includes('sql') || text.includes('postgres') || text.includes('database') || text.includes('mongo') || text.includes('redis') || text.includes('query')) {
    questions.push({
      id: 'q-custom-database',
      category: 'DATA_INTEGRITY',
      claimTitle: 'Database Indexing & Query Optimization',
      lQuestion: 'You claim database optimization. When an unindexed query triggers a sequential scan on ten million records during peak business hours, what is your mitigation strategy, or do you merely increase database replica instances and hope for the best?',
      lSubtext: 'Cross-examining query execution plans and index selectivity.',
      badge: 'SQL FORENSICS',
      expectedKeywords: ['index', 'query', 'scan', 'table', 'cache', 'database'],
    });
  }

  // Check Cloud / DevOps / Docker / Kubernetes / AWS
  if (text.includes('docker') || text.includes('kubernetes') || text.includes('aws') || text.includes('cloud') || text.includes('ci/cd') || text.includes('devops')) {
    questions.push({
      id: 'q-custom-devops',
      category: 'INFRASTRUCTURE_RISK',
      claimTitle: 'Cloud Deployment Reliability',
      lQuestion: 'You list cloud orchestration and zero-downtime deployments. If a container enters a CrashLoopBackOff state due to an unhandled SIGTERM signal at 3:00 AM, how does your ingress controller avoid dropped connections? Speak clearly.',
      lSubtext: 'Evaluating distributed container lifecycle management.',
      badge: 'CLOUD ORCHESTRATION',
      expectedKeywords: ['container', 'cluster', 'deploy', 'kubernetes', 'crash', 'health'],
    });
  }

  // Fallback questions for general / less technical resumes so we always have at least 4 questions
  const fallbackBank: InterrogationQuestion[] = [
    {
      id: 'q-fallback-metrics',
      category: 'METRIC_VERIFICATION',
      claimTitle: 'Quantified Impact Verification',
      lQuestion: 'You cited significant percentage improvements and business metrics on your resume. Were these numbers independently audited with telemetry, or did you calculate them five minutes prior to exporting your PDF?',
      lSubtext: 'Forensic audit of unverifiable resume percentage claims.',
      badge: 'METRIC AUDIT',
    },
    {
      id: 'q-fallback-timeline',
      category: 'TIMELINE_PARADOX',
      claimTitle: 'Career Velocity & Overlap',
      lQuestion: 'Candidate-kun, looking at your chronological timeline, you claim mastery over multiple deep domains simultaneously. Defend how many hours per day you actually spent writing code versus sitting in status meetings.',
      lSubtext: 'Calculating temporal feasibility of declared experience.',
      badge: 'TIMELINE INTEGRITY',
    },
    {
      id: 'q-fallback-teamwork',
      category: 'LEADERSHIP_SCRUTINY',
      claimTitle: 'Solo Contribution vs Team Effort',
      lQuestion: 'Your resume repeatedly states "spearheaded" and "revolutionized". Can you name three colleagues who would corroborate that you did not simply merge other engineers\' pull requests?',
      lSubtext: 'Testing git blame accuracy vs claimed sole authorship.',
      badge: 'COLLABORATION AUDIT',
    },
    {
      id: 'q-fallback-git',
      category: 'EMERGENCY_COMPETENCE',
      claimTitle: 'Git Disaster Recovery Under Pressure',
      lQuestion: 'If you accidentally committed an unencrypted production API key to the main branch ten minutes before a release, describe your recovery steps without using git push --force. Let us see if your heart rate remains steady.',
      lSubtext: 'Observing cardiovascular reaction under incident simulation.',
      badge: 'DISASTER PROTOCOL',
    },
  ];

  // Fill up to 4 questions
  let fallbackIndex = 0;
  while (questions.length < 4 && fallbackIndex < fallbackBank.length) {
    questions.push(fallbackBank[fallbackIndex]);
    fallbackIndex++;
  }

  return questions.slice(0, 4);
}

// Synthesize L's deductive response based on candidate testimony + Presage optical biometrics
export function synthesizeLDeduction(
  question: InterrogationQuestion,
  testimony: string,
  biometrics: {
    baselineBPM: number;
    peakBPM: number;
    deltaBPM: number;
    avgBPM: number;
    gazeDeviations: number;
    durationSec: number;
  }
): {
  deductionText: string;
  suspicionDelta: number;
  bluffProbability: number;
} {
  const { deltaBPM, peakBPM, gazeDeviations } = biometrics;
  const wordCount = testimony.trim().split(/\s+/).filter(Boolean).length;
  const hasSubstance = wordCount >= 6;

  // Calculate deception probability based on biofeedback
  let bluffProb = 50.0;

  if (deltaBPM >= 18) {
    bluffProb += 32.4;
  } else if (deltaBPM >= 10) {
    bluffProb += 18.2;
  } else if (deltaBPM >= 5) {
    bluffProb += 6.5;
  } else {
    bluffProb -= 14.0;
  }

  if (gazeDeviations >= 3) {
    bluffProb += 11.5;
  }
  if (!hasSubstance) {
    bluffProb += 15.0; // Evading the question
  }

  bluffProb = Math.min(99.4, Math.max(12.8, Math.round(bluffProb * 10) / 10));

  // Determine Suspicion gauge increase (out of 25% per question)
  let suspicionDelta = 20;
  if (bluffProb >= 85) suspicionDelta = 25;
  else if (bluffProb >= 70) suspicionDelta = 20;
  else if (bluffProb >= 50) suspicionDelta = 14;
  else suspicionDelta = 8;

  // Compose in-character deductive monologue
  let deductionText = '';

  if (deltaBPM >= 16) {
    deductionText = `Candidate-kun... while defending ${question.claimTitle}, your pulse experienced an alarming cardiovascular surge: from a calm ${biometrics.baselineBPM} BPM up to ${peakBPM} BPM (+${deltaBPM} BPM spike). In clinical polygraph terms, this is an undeniable tell. Furthermore, you averted your gaze ${gazeDeviations} times. There is a ${bluffProb}% probability of deliberate bluffing.`;
  } else if (deltaBPM >= 8) {
    deductionText = `Interesting. You delivered ${wordCount} words, yet your heart rate steadily climbed by +${deltaBPM} BPM, and Presage detected ocular drift. While your vocal delivery sounded rehearsed, your autonomic nervous system reveals measurable anxiety. The probability of deception stands at ${bluffProb}%.`;
  } else if (hasSubstance && deltaBPM < 8) {
    deductionText = `Remarkable... your pulse remained relatively stable at +${deltaBPM} BPM, and your gaze held within normal limits. Either your technical comprehension of ${question.claimTitle} is authentic... or you are an exceptionally cold-blooded deceiver. I calculate an initial bluff probability of ${bluffProb}%.`;
  } else {
    deductionText = `You offered an evasive defense of only ${wordCount} words, yet your vitals registered significant agitation (+${deltaBPM} BPM). Silence is not an alibi in this room. Probability of deception: ${bluffProb}%.`;
  }

  return {
    deductionText,
    suspicionDelta,
    bluffProbability: bluffProb,
  };
}

