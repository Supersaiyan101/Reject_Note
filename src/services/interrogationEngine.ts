import type { CandidateDossier, InterrogationQuestion } from '../types';

export function getCandidateHonorific(fullName: string): string {
  const clean = (fullName || '').trim();
  if (!clean || clean.toLowerCase() === 'candidate' || clean.toLowerCase() === 'unknown') {
    return 'Candidate-kun';
  }
  if (clean.toLowerCase() === 'light yagami' || clean.toLowerCase() === 'light') {
    return 'Light-kun';
  }
  const firstName = clean.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  return firstName ? `${firstName}-san` : 'Candidate-kun';
}

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

  const honorific = getCandidateHonorific(dossier.name);

  // 2. Custom Uploaded Resumes: derive questions directly from the candidate's actual extracted claims
  if (dossier.flaggedLandmines && dossier.flaggedLandmines.length > 0) {
    return dossier.flaggedLandmines.slice(0, 4).map((mine, index) => {
      const claimText = mine.claimText || mine.title;
      const lower = claimText.toLowerCase();

      let lQuestion = '';
      let lSubtext = '';

      if (lower.includes('%') || lower.includes('reduced') || lower.includes('increased') || lower.includes('improved') || lower.includes('optimized') || /\d+x\b/i.test(lower)) {
        lQuestion = `${honorific}... regarding "${mine.title}": you cite quantified performance metrics in this claim. Were these figures verified with independent telemetry and controlled benchmarks, or did you estimate them during resume drafting? State your exact measurement methodology.`;
        lSubtext = `Auditing empirical metric integrity and benchmark reproducibility.`;
      } else if (lower.includes('api') || lower.includes('backend') || lower.includes('microservice') || lower.includes('distributed') || lower.includes('service')) {
        lQuestion = `${honorific}... you claim to have built "${mine.title}". When downstream services experience cascading network timeouts under peak concurrency, what is your circuit-breaker and fallback policy? Let us see if your cardiovascular rhythm reflects production certainty.`;
        lSubtext = `Cross-examining distributed fault isolation and failure modes.`;
      } else if (lower.includes('database') || lower.includes('sql') || lower.includes('data') || lower.includes('cache') || lower.includes('redis') || lower.includes('postgres')) {
        lQuestion = `Regarding "${mine.title}"... when concurrent transactions trigger lock contention or cache desynchronization, how do you prevent stale reads and transaction deadlocks? Defend your consistency model without waving your hands.`;
        lSubtext = `Evaluating data integrity, transaction isolation levels, and caching guarantees.`;
      } else if (lower.includes('frontend') || lower.includes('react') || lower.includes('ui') || lower.includes('web') || lower.includes('component')) {
        lQuestion = `${honorific}... you list "${mine.title}". In modern client-side architectures, how do you profile re-render bottlenecks and manage memory leaks in long-running sessions? Defend the architectural decisions behind this implementation.`;
        lSubtext = `Auditing DOM reconciliation profiling and client state architecture.`;
      } else if (lower.includes('cloud') || lower.includes('docker') || lower.includes('kubernetes') || lower.includes('devops') || lower.includes('pipeline') || lower.includes('ci/cd')) {
        lQuestion = `${honorific}... regarding "${mine.title}": if an automated deployment introduces a silent regression that passes health checks at midnight, what is your automated canary and rollback strategy? Speak with architectural precision.`;
        lSubtext = `Forensic audit of deployment reliability and automated disaster recovery.`;
      } else if (lower.includes('lead') || lower.includes('spearheaded') || lower.includes('managed') || lower.includes('architected')) {
        lQuestion = `You state that you spearheaded "${mine.title}". Specifically, which portions of this system did you personally design and write from scratch versus adopting third-party boilerplates or team contributions? I am observing your micro-circulation.`;
        lSubtext = `Testing solo authorship vs coordination and third-party dependencies.`;
      } else {
        lQuestion = `${honorific}... you claim "${mine.title}". Walk me through the single most difficult engineering trade-off you accepted in this design, and what broke when you first deployed it. Real systems always fail before they scale.`;
        lSubtext = `Auditing technical trade-off comprehension under optical polygraph.`;
      }

      return {
        id: mine.id || `q-custom-${index + 1}`,
        category: mine.category || 'TECHNICAL_SCRUTINY',
        claimTitle: mine.title,
        lQuestion,
        lSubtext,
        badge: mine.badge || `CLAIM #${index + 1}`,
      };
    });
  }

  // 3. Fallback bank for minimal text
  const fallbackBank: InterrogationQuestion[] = [
    {
      id: 'q-fallback-metrics',
      category: 'METRIC_VERIFICATION',
      claimTitle: 'Quantified Impact Verification',
      lQuestion: `${honorific}... you cited significant percentage improvements and business metrics on your resume. Were these numbers independently audited with telemetry, or did you calculate them five minutes prior to exporting your PDF?`,
      lSubtext: 'Forensic audit of unverifiable resume percentage claims.',
      badge: 'METRIC AUDIT',
    },
    {
      id: 'q-fallback-timeline',
      category: 'TIMELINE_PARADOX',
      claimTitle: 'Career Velocity & Overlap',
      lQuestion: `${honorific}, looking at your chronological timeline, you claim mastery over multiple deep domains simultaneously. Defend how many hours per day you actually spent writing production code versus sitting in status meetings.`,
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

  return fallbackBank.slice(0, 4);
}

// Synthesize L's deductive response based on candidate testimony + Presage optical biometrics
export function synthesizeLDeduction(
  question: InterrogationQuestion,
  testimony: string,
  biometrics: {
    candidateName?: string;
    isPreset?: boolean;
    questionIndex?: number;
    baselineBPM: number;
    peakBPM: number;
    deltaBPM: number;
    avgBPM: number;
    gazeDeviations: number;
    durationSec: number;
    hrvMs?: number;
    blinkRate?: number;
    sympatheticTone?: number;
  }
): {
  deductionText: string;
  suspicionDelta: number;
  bluffProbability: number;
} {
  const { deltaBPM, peakBPM, gazeDeviations } = biometrics;
  const hrv = biometrics.hrvMs ?? 65;
  const blinks = biometrics.blinkRate ?? 15;
  const tone = biometrics.sympatheticTone ?? 18;
  const qIndex = biometrics.questionIndex ?? 0;

  const candidateHonorific = getCandidateHonorific(biometrics.candidateName || '');

  // 1. Lexical and Semantic Analysis of Testimony
  const rawWords = testimony.trim().split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;
  const isEvasive = wordCount < 5;
  const isDetailed = wordCount >= 18;

  // Technical domain vocabulary test: Did the candidate mention concrete engineering concepts?
  const techLexicon = [
    'latency', 'throughput', 'concurrency', 'thread', 'index', 'cache', 'p99',
    'tradeoff', 'trade-off', 'benchmark', 'async', 'distributed', 'failure',
    'isolate', 'rollback', 'schema', 'cluster', 'mutex', 'transaction',
    'memory', 'cpu', 'load', 'scale', 'tested', 'bottleneck', 'replica',
    'partition', 'queue', 'circuit', 'canary', 'idempotent', 'sharding'
  ];
  const matchedTechTerms = techLexicon.filter((kw) => testimony.toLowerCase().includes(kw));
  const hasTechSubstance = matchedTechTerms.length >= 2;

  // 2. Multi-Sensor Autonomic Scoring (Calibrated for realistic ±0 to 12 BPM variance)
  let bluffProb = 40.0;

  // Cardiovascular delta
  if (deltaBPM >= 8) {
    bluffProb += 24.5; // Significant autonomic arousal
  } else if (deltaBPM >= 4) {
    bluffProb += 10.0; // Moderate interview tension
  } else if (deltaBPM <= 2) {
    bluffProb -= 14.0; // Calm, steady composure
  }

  // Heart Rate Variability (SDNN: vagal reserve)
  if (hrv < 38) {
    bluffProb += 14.0; // Autonomic suppression
  } else if (hrv > 60) {
    bluffProb -= 10.0; // Parasympathetic balance
  }

  // Ocular behavior (debounced gaze shifts & micro-blinks)
  if (gazeDeviations >= 2) {
    bluffProb += 10.5;
  }
  if (blinks >= 22) {
    bluffProb += 6.5;
  }

  // Verbal content adjustments
  if (isEvasive) {
    bluffProb += 22.0; // Refusing technical explanation
  } else if (hasTechSubstance) {
    bluffProb -= 14.0; // Provided actual architectural mechanism
  } else if (!hasTechSubstance && isDetailed) {
    bluffProb += 8.0; // Verbose fluff / buzzwords without substance
  }

  // Clamp probability to realistic forensic bounds
  bluffProb = Math.min(96.4, Math.max(12.8, Math.round(bluffProb * 10) / 10));

  // Determine Suspicion gauge increase (out of 25% max per claim)
  let suspicionDelta = 14;
  if (bluffProb >= 80) suspicionDelta = 25;
  else if (bluffProb >= 65) suspicionDelta = 20;
  else if (bluffProb >= 45) suspicionDelta = 14;
  else suspicionDelta = 8;

  // 3. Cycle L's Distinctive Physical Mannerisms Across Questions
  const mannerisms = [
    '(stacks two sugar cubes into a delicate column)...',
    '(twirls a metal spoon against a porcelain teacup)...',
    '(bites the nail of his right thumb, dark circles locked onto the CCTV spectrogram)...',
    '(crouches tightly on the edge of his swivel chair, chin resting on his knees)...'
  ];
  const lGesture = mannerisms[qIndex % mannerisms.length];

  // 4. Construct Surgical, In-Character L Forensic Monologue
  let deductionText = '';

  if (isEvasive) {
    // SCENARIO 1: Refused to elaborate / Terse deflection (<5 words)
    deductionText = `${lGesture} ${candidateHonorific}... you offer barely ${wordCount} words to defend "${question.claimTitle}". In my experience, when an engineer retreats into brevity under forensic scrutiny, it is almost never because the architecture is self-evident—it is because probing any deeper will collapse the facade. Presage sensors captured an autonomic tone of ${tone}%. There is a ${bluffProb}% probability of deliberate exaggeration.`;
  } else if (hasTechSubstance && deltaBPM <= 3 && hrv >= 54) {
    // SCENARIO 2: Calm, Confident & Technically Substantive
    deductionText = `${lGesture} Remarkable. You articulated specific technical mechanisms (${matchedTechTerms.slice(0, 3).join(', ')}) while Presage Sensor Ch.01 logged your pulse at a tranquil ${peakBPM} BPM (+${deltaBPM} BPM delta, ${hrv}ms HRV). Most candidates experience cardiovascular acceleration when pressed on failure modes. You speak like someone who actually wrote the unit tests and diagnosed production bottlenecks. Calculated deception probability is low: ${bluffProb}%.`;
  } else if (hasTechSubstance && (deltaBPM >= 7 || hrv < 42 || gazeDeviations >= 2)) {
    // SCENARIO 3: Technically articulate, but visibly nervous / physiological spike
    deductionText = `${lGesture} You cited legitimate architectural concepts (${matchedTechTerms.slice(0, 3).join(', ')}), ${candidateHonorific}. Yet observe your carotid pulse trace: your heart rate accelerated +${deltaBPM} BPM to ${peakBPM} BPM, and you averted your gaze ${gazeDeviations} times. Your textbook knowledge is sound, but your micro-circulation reveals acute apprehension regarding real production ownership. Probability of resume padding: ${bluffProb}%.`;
  } else if (!hasTechSubstance && deltaBPM <= 3) {
    // SCENARIO 4: Calm, but talking in vague generalities / buzzwords
    deductionText = `${lGesture} You delivered ${wordCount} words on "${question.claimTitle}" with stone-cold physiological stillness (+${deltaBPM} BPM variance). Yet despite your calm vitals, your defense relied entirely on superficial buzzwords without a single verifiable metric or trade-off. You possess the chilling composure of someone skilled at corporate interview storytelling. Initial bluff probability: ${bluffProb}%.`;
  } else if (!hasTechSubstance && deltaBPM >= 7) {
    // SCENARIO 5: Vague answer + High physiological spike (Obvious bluff)
    deductionText = `${lGesture} Look at the polygraph readout, ${candidateHonorific}. When pressed on "${question.claimTitle}", your explanation offered no concrete architecture, while Presage rPPG recorded a cardiovascular surge of +${deltaBPM} BPM (peaking at ${peakBPM} BPM) and ${blinks} blinks/min. High autonomic arousal paired with vague hand-waving is the unmistakable forensic signature of resume inflation. Probability of deception: ${bluffProb}%.`;
  } else {
    // SCENARIO 6: Balanced / Standard Technical Interview Response
    deductionText = `${lGesture} You delivered ${wordCount} words explaining "${question.claimTitle}". Presage Sensor Ch.01 logged a modest +${deltaBPM} BPM pulse variance and an HRV of ${hrv}ms. While your narrative was coherent, your autonomic telemetry reflects subtle tension when questioned on edge cases. I calculate a deception probability of ${bluffProb}%.`;
  }

  return {
    deductionText,
    suspicionDelta,
    bluffProbability: bluffProb,
  };
}
