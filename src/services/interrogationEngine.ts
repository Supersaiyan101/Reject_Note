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

  const wordCount = testimony.trim().split(/\s+/).filter(Boolean).length;
  const isEvasive = wordCount < 5;
  const isSubstantive = wordCount >= 10;

  // 1. Calculate deception probability based on calibrated Presage multi-sensor telemetry
  let bluffProb = 42.0;

  // Cardiovascular delta weighting (calibrated for realistic ±0 to 12 BPM variance)
  if (deltaBPM >= 8) {
    bluffProb += 26.5; // Genuine cardiovascular agitation
  } else if (deltaBPM >= 4) {
    bluffProb += 12.0; // Moderate autonomic tension
  } else if (deltaBPM <= 2) {
    bluffProb -= 14.0; // Calm, steady composure
  }

  // Heart Rate Variability (vagal nerve suppression check)
  if (hrv < 38) {
    bluffProb += 14.0; // Autonomic fight-or-flight collapse
  } else if (hrv > 62) {
    bluffProb -= 10.0; // Healthy parasympathetic tone
  }

  // Ocular behavior (debounced gaze shifts & micro-blinks)
  if (gazeDeviations >= 2) {
    bluffProb += 11.0;
  }
  if (blinks >= 22) {
    bluffProb += 6.5;
  }

  // Verbal substance check
  if (isEvasive) {
    bluffProb += 18.0; // Avoiding technical accountability
  } else if (isSubstantive) {
    bluffProb -= 8.0; // Provided actual architectural defense
  }

  // Clamp probability to realistic forensic bounds
  bluffProb = Math.min(96.8, Math.max(14.2, Math.round(bluffProb * 10) / 10));

  // Determine Suspicion gauge increase (out of 25% max per claim)
  let suspicionDelta = 14;
  if (bluffProb >= 80) suspicionDelta = 25;
  else if (bluffProb >= 65) suspicionDelta = 20;
  else if (bluffProb >= 45) suspicionDelta = 14;
  else suspicionDelta = 8;

  // 2. Determine Biofeedback Tier
  const isCalm = deltaBPM <= 3 && hrv >= 56 && gazeDeviations <= 1;
  const isAgitated = deltaBPM >= 7 || hrv < 42 || gazeDeviations >= 2;

  // 3. Compose In-Character, Bespoke L Deductive Monologue for each specific claim
  let deductionText = '';
  const qId = question.id;

  if (qId === 'q-preset-1') {
    // QUESTION 1: Potato-Chip LCD Workstation
    if (isEvasive) {
      deductionText = `Light-kun... you offer barely ${wordCount} words to defend a covert edge-computing rig concealed in a barbecue chip bag? An engineer who engineered an ungreased 0ms LCD would quote hardware specifications, yet you deflect with silence. Presage sensors detect an autonomic tone of ${tone}%. Bluff probability: ${bluffProb}%.`;
    } else if (isCalm) {
      deductionText = `(stacks two sugar cubes into a delicate column)... Light-kun, you defend the barbecue chip LCD with surgical composure. Presage Sensor Ch.01 registers your pulse at a tranquil ${peakBPM} BPM (+${deltaBPM} BPM delta), while your HRV sits at an unruffled ${hrv}ms. Most candidates stammer when questioned about grease residue on high-precision optics. For you to remain this physiologically serene under surveillance is either proof of innocence... or the chilling composure of a serial deceiver. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `(leans forward, eyes fixed on the CCTV)... Look at the telemetry graph, Light-kun. The moment I pressed on thermal dissipation inside the foil bag, your pulse climbed to ${peakBPM} BPM (+${deltaBPM} BPM surge) and you averted your gaze ${gazeDeviations} times. Your vocal tone attempted defiance, but your micro-circulation reveals undeniable cardiovascular tension. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `(bites right thumb thoughtfully)... You spoke ${wordCount} words detailing your covert monitor. Presage Ch.01 logged a modest +${deltaBPM} BPM rise, and your blink rate hovered at ${blinks}/min. You understand the edge architecture, yet your autonomic nervous system reveals subtle hesitation regarding the physical feasibility. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-preset-2') {
    // QUESTION 2: 40-Second Autonomous Incident SLA
    if (isEvasive) {
      deductionText = `Refusing to explain why your incident resolution pipeline executes in precisely forty seconds? That forty-second interval is the trademark signature of Kira's cardiac arrest executions. Silence in front of Presage optical sensors is not an alibi, Light-kun. Bluff probability: ${bluffProb}%.`;
    } else if (isCalm) {
      deductionText = `(twirls a metal spoon in empty coffee cup)... A distributed queue that resolves critical incidents in exactly forty seconds—the exact time it takes for a heart attack to manifest after a name is written. Yet your pulse held flat at ${peakBPM} BPM (a mere +${deltaBPM} BPM variance). Either your automated cron jobs truly operate with supernatural punctuality... or you are testing my intellect with a brazen confession disguised as infrastructure. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `(crouches tightly on the chair edge)... Light-kun! Your pulse surged +${deltaBPM} BPM up to ${peakBPM} BPM, and your HRV dropped to ${hrv}ms the instant I mentioned the Kira killings. An innocent software engineer explaining a message broker does not experience vagal nerve collapse. Presage rPPG captured your exact autonomic tell. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `Interesting. You delivered a technical explanation of ${wordCount} words, yet Presage Ch.02 recorded sympathetic arousal rising to ${tone}%. You attempted to normalize the 40-second SLA as a standard batch threshold, but your cardiovascular rhythm betray an unmistakable defensive spike (+${deltaBPM} BPM). Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-preset-3') {
    // QUESTION 3: Bimanual Multi-Threaded C++ Multitasking
    if (isEvasive) {
      deductionText = `Light-kun, you claim to write lock-free memory-safe C++ with your left hand while solving calculus with your right, yet you provide zero explanation of your memory barriers. One cannot hand-wave atomic synchronization in front of Presage sensors. Bluff probability: ${bluffProb}%.`;
    } else if (isCalm) {
      deductionText = `(eats a single strawberry without looking away)... Lock-free atomic C++ with the non-dominant hand while computing differential equations. Your pulse barely wavered at +${deltaBPM} BPM, and your gaze alignment remained locked dead-center. As the Junior Kanto Tennis Champion, your bi-hemispheric motor coordination is genuinely extraordinary. But whether that code was truly thread-safe without mutex contention... I calculate a remaining bluff probability of ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `(points right index finger at the waveform)... Your pulse climbed to ${peakBPM} BPM (+${deltaBPM} BPM spike) with ${blinks} blinks/min and ${gazeDeviations} ocular drifts. Truly lock-free memory safety requires immense cognitive concentration; attempting it simultaneously with differential equations overloaded your autonomic nervous system. The telemetry does not lie. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You delivered ${wordCount} words on atomic CAS operations. Presage logged a mild cardiovascular elevation of +${deltaBPM} BPM and an HRV of ${hrv}ms. You possess the theoretical knowledge, Light-kun, but your biometrics reveal that writing C++ with your left hand was an exaggeration of your true workflow. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-preset-4') {
    // QUESTION 4: Divine Consensus
    if (isEvasive) {
      deductionText = `Silence when cross-examined on your 'Divine Consensus'? When asked what occurs when your node fails to achieve godhood, you offer no failover plan. Megalomania is not a high-availability architecture, Light-kun. Bluff probability: ${bluffProb}%.`;
    } else if (isCalm) {
      deductionText = `(stares through dark circles with quiet intensity)... You defend 'Divine Consensus' with eerie, stone-cold stillness (+${deltaBPM} BPM pulse delta, ${hrv}ms HRV). Most engineers would smile or concede the hyperbole. You, however, defend becoming a god with absolute physiological sincerity. That chilling psychological conviction is precisely why you remain my primary suspect. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `Candidate-kun! Your pulse spiked +${deltaBPM} BPM to ${peakBPM} BPM, and your sympathetic tone flared to ${tone}%! Divine Consensus is not an engineering consensus protocol—it is the hubris of someone who believes they are untouchable. Presage optical telemetry has stripped away your god complex. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `(spins a porcelain saucer)... You spoke ${wordCount} words attempting to rationalize divine authority as a distributed fault-tolerance model. Presage Sensor Ch.01 detected a +${deltaBPM} BPM rise and ${gazeDeviations} micro-glances away from the lens. Even you recognize the absurdity of replacing Paxos with godhood. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-custom-frontend') {
    // CUSTOM FRONTEND
    if (isCalm) {
      deductionText = `(stacks sugar cubes)... Candidate-kun, your pulse held remarkably steady at +${deltaBPM} BPM while defending your frontend architecture. Your HRV remained at ${hrv}ms. You understand DOM reconciliation and avoid blind useCallback wrapping. Either you are a rare, disciplined frontend engineer... or you memorized these performance talking points five minutes ago. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `Look at your carotid pulse readout. The moment I mentioned unpredictable re-renders and memory leaks, your heart rate spiked by +${deltaBPM} BPM to ${peakBPM} BPM, with ${gazeDeviations} ocular shifts. Your code re-renders uncontrollably, Candidate-kun, and your autonomic system knows it. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You delivered ${wordCount} words on frontend state. Presage logged a mild +${deltaBPM} BPM pulse variance and ${blinks} blinks/min. You have built interfaces, but your micro-circulation reveals measurable anxiety regarding complex state synchronization. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-custom-backend') {
    // CUSTOM BACKEND
    if (isCalm) {
      deductionText = `(twirls coffee spoon)... When asked about event loop blocking and connection pool starvation, your pulse barely shifted (+${deltaBPM} BPM) and sympathetic tone stayed at ${tone}%. You demonstrate calm familiarity with async I/O bottlenecks. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `Your pulse surged +${deltaBPM} BPM (peaking at ${peakBPM} BPM) right when I asked about production connection pool starvation. You claim high-throughput API architecture, yet your autonomic response reveals you have never stress-tested a system under real distributed load. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You provided ${wordCount} words on backend resilience. Presage Sensor Ch.01 noted a moderate +${deltaBPM} BPM rise. You understand the architectural theory, but your physiological telemetry suggests you rely heavily on auto-scaling rather than true connection profiling. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-custom-database') {
    // CUSTOM DATABASE
    if (isCalm) {
      deductionText = `(bites thumb)... Sequential table scans on ten million records. You answered with complete cardiovascular stillness (+${deltaBPM} BPM delta, ${hrv}ms HRV). You understand B-tree index selectivity and composite keys without flinching. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `An unindexed query in production triggered this exact reaction: your pulse accelerated +${deltaBPM} BPM to ${peakBPM} BPM, and you averted your eyes ${gazeDeviations} times. You do not optimize slow queries—you merely restart the replica and pray. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You offered ${wordCount} words on query optimization. Presage Ch.02 detected sympathetic arousal rising to ${tone}%. You have run EXPLAIN ANALYZE, but your biometrics reveal that database lock contention still causes you genuine stress. Bluff probability: ${bluffProb}%.`;
    }
  } else if (qId === 'q-custom-devops') {
    // CUSTOM DEVOPS / KUBERNETES
    if (isCalm) {
      deductionText = `(observes CCTV monitors)... Zero-downtime deployment during an unhandled SIGTERM crash loop. Your pulse remained rock-solid at +${deltaBPM} BPM. You demonstrate legitimate operational resilience under simulated disaster conditions. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `Candidate-kun, your pulse surged by +${deltaBPM} BPM the moment I mentioned a CrashLoopBackOff at 3:00 AM! Presage Ch.03 logged ${blinks} blinks/min and ocular evasion. You copy Helm charts without understanding container lifecycle hooks. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You gave ${wordCount} words on cloud deployment. Presage recorded a +${deltaBPM} BPM pulse variance. You understand container deployment, but your cardiovascular telemetry indicates your disaster recovery protocol is largely improvisation. Bluff probability: ${bluffProb}%.`;
    }
  } else {
    // GENERAL / FALLBACK QUESTIONS
    if (isEvasive) {
      deductionText = `You offered an evasive defense of only ${wordCount} words regarding ${question.claimTitle}. Presage sensors detected an autonomic tension score of ${tone}%. Silence will not substantiate an unverifiable resume claim. Bluff probability: ${bluffProb}%.`;
    } else if (isCalm) {
      deductionText = `(stacks sugar cubes)... Your pulse remained steady at +${deltaBPM} BPM (${peakBPM} BPM peak), with an HRV of ${hrv}ms. You answered with measured composure. Either your experience with ${question.claimTitle} is fully authentic, or you are an exceptionally disciplined candidate. Bluff probability: ${bluffProb}%.`;
    } else if (isAgitated) {
      deductionText = `Look at the polygraph trace for ${question.claimTitle}: your pulse surged by +${deltaBPM} BPM, HRV collapsed to ${hrv}ms, and ocular shifts were recorded ${gazeDeviations} times. Your autonomic nervous system reveals significant anxiety regarding this claim. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `You spoke ${wordCount} words in defense of ${question.claimTitle}. Presage Sensor Ch.01 logged a moderate +${deltaBPM} BPM rise. While your verbal narrative was coherent, your autonomic telemetry reflects standard interview apprehension. Bluff probability: ${bluffProb}%.`;
    }
  }

  return {
    deductionText,
    suspicionDelta,
    bluffProbability: bluffProb,
  };
}

