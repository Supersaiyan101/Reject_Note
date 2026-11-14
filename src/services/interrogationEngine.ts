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

// Autonomous Deep Linguistic Roaster: Generates bespoke, hilarious, savage LLM-grade roasts with ZERO API keys required!
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
  const lowerTestimony = testimony.toLowerCase().trim();
  const lowerClaim = question.claimTitle.toLowerCase();
  const rawWords = testimony.trim().split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;

  // 1. Lexical Keyword Detection
  const buzzwordBank = [
    'spearheaded', 'synergy', 'seamless', 'scalable', 'robust', 'optimized',
    'streamlined', 'cutting-edge', 'best practices', 'end-to-end', 'agile',
    'mission-critical', 'state-of-the-art', 'world-class', 'revolutionized'
  ];
  const detectedBuzzwords = buzzwordBank.filter((bw) => lowerTestimony.includes(bw));

  const frontendKeywords = ['react', 'vue', 'angular', 'tailwind', 'css', 'next', 'ui', 'component', 'redux', 'dom', 'hooks', 'state'];
  const isFrontend = frontendKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const backendKeywords = ['api', 'microservice', 'node', 'python', 'fastapi', 'express', 'endpoint', 'django', 'backend', 'server'];
  const isBackend = backendKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const dbKeywords = ['sql', 'postgres', 'mongo', 'redis', 'database', 'query', 'cache', 'table', 'indexing', 'lock', 'deadlock'];
  const isDatabase = dbKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const devopsKeywords = ['docker', 'kubernetes', 'k8s', 'aws', 'cloud', 'ci/cd', 'deploy', 'cluster', 'terraform', 'ingress', 'canary'];
  const isDevOps = devopsKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const technicalVocabulary = [
    'latency', 'throughput', 'concurrency', 'thread', 'index', 'cache', 'p99',
    'tradeoff', 'benchmark', 'async', 'distributed', 'failure', 'isolate',
    'rollback', 'schema', 'cluster', 'mutex', 'transaction', 'memory', 'cpu',
    'load', 'scale', 'bottleneck', 'replica', 'partition', 'queue', 'circuit'
  ];
  const matchedTechTerms = technicalVocabulary.filter((kw) => lowerTestimony.includes(kw));
  const hasTechnicalSubstance = matchedTechTerms.length >= 2;

  // Check for auto-filled statement
  const isAutoFill = lowerTestimony.includes('ground up') || lowerTestimony.includes('strict p99') || lowerTestimony.includes('zero regression');

  // Check for superhuman or impossible claims
  const hasAbsurdClaim = lowerTestimony.includes('0ms') || lowerTestimony.includes('100%') || lowerTestimony.includes('never failed') || lowerTestimony.includes('zero bugs');

  // 2. Multi-Sensor Autonomic Scoring
  let bluffProb = 42.0;

  if (deltaBPM >= 8) bluffProb += 24.5;
  else if (deltaBPM >= 4) bluffProb += 10.0;
  else if (deltaBPM <= 2) bluffProb -= 14.0;

  if (hrv < 38) bluffProb += 14.0;
  else if (hrv > 60) bluffProb -= 10.0;

  if (gazeDeviations >= 2) bluffProb += 10.5;
  if (blinks >= 22) bluffProb += 6.5;

  if (wordCount < 5) bluffProb += 22.0;
  else if (hasTechnicalSubstance) bluffProb -= 14.0;
  else if (detectedBuzzwords.length >= 2) bluffProb += 12.0;

  bluffProb = Math.min(97.2, Math.max(12.4, Math.round(bluffProb * 10) / 10));

  let suspicionDelta = 14;
  if (bluffProb >= 80) suspicionDelta = 25;
  else if (bluffProb >= 65) suspicionDelta = 20;
  else if (bluffProb >= 45) suspicionDelta = 14;
  else suspicionDelta = 8;

  // 3. Cycle Distinctive Physical Mannerisms Across Questions
  const mannerisms = [
    '(stacks three sugar cubes into a delicate spire with surgical precision)...',
    '(twirls a dessert spoon against his porcelain saucer, dark circles fixed on you)...',
    '(bites his right thumbnail, watching the CCTV spectrogram flicker)...',
    '(crouches tightly on the edge of the swivel chair, knees pressed against his chest)...',
    '(calmly slides a strawberry into his mouth while analyzing your carotid wave)...',
    '(tilts head at a 45-degree angle, pointing his index finger at your pulse trace)...'
  ];
  const lGesture = mannerisms[qIndex % mannerisms.length];

  // 4. Construct Bespoke, Hilarious, Savage L Forensic Monologue
  let deductionText = '';

  // BRANCH A: Light Yagami Preset Special Cases
  if (biometrics.isPreset) {
    if (qIndex === 0) {
      // Potato Chip LCD
      if (deltaBPM <= 2) {
        deductionText = `${lGesture} Light-kun... you defend eating barbecue potato chips while watching an edge-computed LCD with terrifying composure. Presage Ch.01 logged a flat ${peakBPM} BPM (+${deltaBPM} BPM delta). Most mortals would choke on a potato chip under 64 surveillance cameras. To remain this calm is either miraculous innocence... or the chilling discipline of Kira himself. Bluff probability: ${bluffProb}%.`;
      } else {
        deductionText = `${lGesture} (leans forward)... Look at the CCTV telemetry, Light-kun. Your pulse accelerated by +${deltaBPM} BPM to ${peakBPM} BPM right when you explained how you handled barbecue grease without staining the mini LCD. Even a top student cannot hide micro-vascular vasodilation from Presage sensors. Bluff probability: ${bluffProb}%.`;
      }
    } else if (qIndex === 1) {
      // 40-sec SLA
      deductionText = `${lGesture} A distributed queue SLA guaranteeing ticket resolution in precisely forty seconds... the exact clinical delay of a Kira cardiac arrest. Your heart rate spiked +${deltaBPM} BPM and Presage Ch.02 clocked your HRV collapsing to ${hrv}ms. You didn't design an incident pipeline, Light-kun—you designed an alibi. Bluff probability: ${bluffProb}%.`;
    } else if (qIndex === 2) {
      // Bimanual C++
      deductionText = `${lGesture} Writing lock-free atomic C++ with your left hand while computing differential equations with your right? Your blink rate jumped to ${blinks}/min and you averted your gaze ${gazeDeviations} times. Even the Junior Kanto Tennis Champion cannot bypass the physiological limits of human neural hemispheres. Bluff probability: ${bluffProb}%.`;
    } else {
      // Divine Consensus
      deductionText = `${lGesture} (stares through dark circles)... 'Divine Consensus' is not a Byzantine fault tolerance algorithm. That is an unadulterated god complex. You defend becoming a god while Presage sensors clock sympathetic arousal at ${tone}%. Telemetry does not bow before gods, Light-kun. Bluff probability: ${bluffProb}%.`;
    }
    return { deductionText, suspicionDelta, bluffProbability: bluffProb };
  }

  // BRANCH B: Candidate Refused to Elaborate / Terse Deflection (< 5 words)
  if (wordCount < 5) {
    deductionText = `${lGesture} Barely ${wordCount} words to defend "${question.claimTitle}"? ${candidateHonorific}... when an engineer who supposedly engineered this system retreats into monosyllabic deflection, there is an 93.4% probability they merely merged someone else's pull request while taking credit in the retrospective. Presage sensors captured an autonomic tone of ${tone}%. Silence is the loudest confession in this room. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH C: Candidate Used the Auto-Filled Defiant Elevator Pitch
  else if (isAutoFill) {
    deductionText = `${lGesture} You claim to have 'guaranteed strict p99 benchmarks without regression from the ground up', yet you failed to quote a single profiling tool or memory boundary. Spouting rehearsed elevator pitches while your carotid pulse accelerates by +${deltaBPM} BPM is the classic forensic signature of an imposter reciting Medium articles. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH D: Candidate Claimed Superhuman / Impossible Feats (0ms, 100% bug-free)
  else if (hasAbsurdClaim) {
    deductionText = `${lGesture} (calmly eats a pastry)... Zero latency and 100% bug-free operation? ${candidateHonorific}, not even Google, NASA, or the High Court operates without failure modes. Claiming computational perfection in front of optical biometric sensors is sheer comedic hubris. Your pulse surged +${deltaBPM} BPM the moment you said it. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH E: Candidate Overloaded Corporate Buzzwords
  else if (detectedBuzzwords.length >= 2) {
    const bwStr = detectedBuzzwords.slice(0, 2).map((w) => `"${w}"`).join(' and ');
    deductionText = `${lGesture} You string together corporate buzzwords like ${bwStr} the way amateur magicians deploy smoke bombs. When an engineer actually writes the code, they speak in algorithms, race conditions, and unit tests—not LinkedIn marketing copy. Presage optical telemetry clocked ${gazeDeviations} ocular shifts and an HRV of ${hrv}ms. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH F: Specific Domain Roasts (Frontend / React)
  else if (isFrontend) {
    if (deltaBPM <= 3 && hasTechnicalSubstance) {
      deductionText = `${lGesture} Remarkable. You defended DOM reconciliation and client state management with an unruffled pulse (+${deltaBPM} BPM, ${hrv}ms HRV). Either you truly understand browser rendering pipelines... or you are an extraordinarily cold-blooded candidate who rehearsed in front of a mirror. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `${lGesture} Wrapping a third-party UI component and blindly passing props down twelve layers is not 'frontend architecture', ${candidateHonorific}. When I probed on re-render performance, Presage Ch.01 logged a +${deltaBPM} BPM carotid surge right as your gaze drifted away ${gazeDeviations} times. You built a tutorial app and called it an enterprise client. Probability of resume bluffing: ${bluffProb}%.`;
    }
  }
  // BRANCH G: Specific Domain Roasts (Backend / Microservices)
  else if (isBackend) {
    if (deltaBPM >= 6) {
      deductionText = `${lGesture} Ah, 'microservices'... the universal industry excuse to take a simple 50-line monolith and introduce fifteen distributed points of network failure. Your heart rate climbed by +${deltaBPM} BPM to ${peakBPM} BPM the moment I mentioned circuit breakers. You didn't architect a resilient backend, ${candidateHonorific}—you built a network latency generator. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `${lGesture} (twirls spoon)... You speak of scalable APIs, yet Presage Ch.02 caught your HRV tightening to ${hrv}ms under cross-examination. An engineer who actually benchmarked event-loop starvation does not exhibit sympathetic distress when asked about connection pools. Bluff probability: ${bluffProb}%.`;
    }
  }
  // BRANCH H: Specific Domain Roasts (Database / SQL / Redis)
  else if (isDatabase) {
    deductionText = `${lGesture} Slapping a Redis cache in front of an unindexed SQL query does not make you a database engineer, ${candidateHonorific}. It merely delays database deadlock until Black Friday traffic spikes. Presage sensors captured ${blinks} blinks/min and a +${deltaBPM} BPM pulse jump. You've never run an EXPLAIN query in production. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH I: Specific Domain Roasts (DevOps / Docker / Kubernetes)
  else if (isDevOps) {
    deductionText = `${lGesture} Copying YAML manifests from StackOverflow and pushing to a cloud cluster does not constitute 'cloud orchestration', ${candidateHonorific}. When I mentioned an unhandled SIGTERM at 3:00 AM, your pulse climbed +${deltaBPM} BPM to ${peakBPM} BPM. You don't have a disaster recovery plan—you have an emergency prayer. Bluff probability: ${bluffProb}%.`;
  }
  // BRANCH J: Highly Technical and Calm (Deep Respect / Cold Suspicion)
  else if (hasTechnicalSubstance && deltaBPM <= 3) {
    deductionText = `${lGesture} (observes CCTV with quiet fascination)... Remarkable. You defended "${question.claimTitle}" while your pulse sat at an unflinching ${peakBPM} BPM (+${deltaBPM} BPM delta, ${hrv}ms HRV). Most engineers stammer or fidget when cross-examined on production failures. For you to maintain such cold physiological stillness suggests either undeniable technical competence... or you are an extraordinarily polished sociopath. Initial bluff probability: ${bluffProb}%.`;
  }
  // BRANCH K: General Roast with Live Biometrics
  else {
    deductionText = `${lGesture} You delivered ${wordCount} words on "${question.claimTitle}", ${candidateHonorific}. Yet observe your carotid trace: your pulse climbed +${deltaBPM} BPM, sympathetic tone flared to ${tone}%, and you averted your gaze ${gazeDeviations} times. While your voice attempted confidence, your micro-circulation reveals undeniable apprehension. Calculated probability of resume puffery: ${bluffProb}%.`;
  }

  return {
    deductionText,
    suspicionDelta,
    bluffProbability: bluffProb,
  };
}
