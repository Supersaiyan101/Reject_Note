import type { CandidateDossier, InterrogationQuestion, PeakStressMoment } from '../types';

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
        claimTitle: 'Covert Potato-Chip LCD Rig',
        lQuestion: 'Light-kun... you claim this covert edge-computed LCD display hidden inside a barbecue potato chip bag had 0ms latency and left zero grease on the lens. Testify: why barbecue chips, and why did your carotid pulse surge when I said "potato"?',
        lSubtext: 'Interrogating edge hardware claim & salt-to-silicon ratio under 64 cameras.',
        badge: 'POTATO CHIP PROTOCOL',
        expectedKeywords: ['chip', 'potato', 'eat', 'snack', 'exam', 'study', 'grease', 'lcd'],
        actingCue: 'Honor-student composure with calm indignation',
        suggestedDefense: "I'll take a potato chip... AND EAT IT! I was studying for university entrance exams, Ryuzaki! There is no law against having a snack!",
      },
      {
        id: 'q-preset-2',
        category: 'MEGALOMANIA',
        claimTitle: '40-Second Real-Time Incident SLA',
        lQuestion: 'A distributed queue SLA guaranteeing ticket resolution in precisely forty seconds... where every failed worker suffers acute cardiac arrest? Light-kun, there is an 89.4% probability you are describing the Kira killings. Explain this SLA.',
        lSubtext: 'Analyzing distributed incident resolution vs 40-second heart attack timing.',
        badge: '40-SEC KIRA SLA',
        expectedKeywords: ['sla', 'second', 'queue', 'cardiac', 'arrest', 'heart', 'engineer', 'backend'],
        actingCue: 'Offended engineer defending technical competence',
        suggestedDefense: 'Any competent backend engineer can build a 40-second automated queue! Accusing an honor student of murder over an SLA delay is completely absurd!',
      },
      {
        id: 'q-preset-3',
        category: 'BROADCAST_INTERCEPTION',
        claimTitle: 'Lind L. Tailor Broadcast Interception',
        lQuestion: 'Lind L. Tailor was a condemned death-row decoy broadcast exclusively in the Kanto region. The moment he taunted Kira, he died of a heart attack in forty seconds. Why did your gaze shift when I mentioned the Kanto broadcast?',
        lSubtext: 'Auditing televised broadcast trap and geographic localization.',
        badge: 'KANTO BROADCAST TRAP',
        expectedKeywords: ['broadcast', 'tv', 'kanto', 'bait', 'tailor', 'decoy', 'speculation'],
        actingCue: 'Righteous indignation against police overreach',
        suggestedDefense: 'You staged an illegal television broadcast using a condemned death-row inmate to bait a killer! Blaming an honor student watching TV in Kanto is baseless speculation!',
      },
      {
        id: 'q-preset-4',
        category: 'DIVINE_CONSENSUS',
        claimTitle: 'God of the New World Architecture',
        lQuestion: 'Divine Consensus is not a distributed computing protocol, Light-kun. You don\'t want to be a lead engineer at a tech firm. You want to be the God of the New World. State your true objective before Presage sensors.',
        lSubtext: 'Probing metaphysical consensus claims under optical polygraph.',
        badge: 'GOD COMPLEX AUDIT',
        expectedKeywords: ['god', 'world', 'crime', 'justice', 'safer', 'student', 'telemetry'],
        actingCue: 'Dramatic conviction defending a safer world',
        suggestedDefense: 'I am the top student in Japan! I only want to build technology that makes the world a safer, better place! How is that a crime, Ryuzaki?!',
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
        actingCue: 'Look straight at the camera and deliver a calm, structured technical defense.',
        suggestedDefense: `I architected ${mine.title} from the ground up, guaranteeing strict latency benchmarks and automated fault tolerance without regression.`,
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
      actingCue: 'Maintain steady eye contact and defend your metrics with composed logic.',
      suggestedDefense: 'Every metric cited in my resume was measured using continuous monitoring and verified in post-incident retrospectives.',
    },
    {
      id: 'q-fallback-timeline',
      category: 'TIMELINE_PARADOX',
      claimTitle: 'Career Velocity & Overlap',
      lQuestion: `${honorific}, looking at your chronological timeline, you claim mastery over multiple deep domains simultaneously. Defend how many hours per day you actually spent writing production code versus sitting in status meetings.`,
      lSubtext: 'Calculating temporal feasibility of declared experience.',
      badge: 'TIMELINE INTEGRITY',
      actingCue: 'Speak with calm focus on your daily code contribution and execution.',
      suggestedDefense: 'I structure my engineering hours with deep-work blocks, dedicating the majority of each day to code delivery and architecture.',
    },
    {
      id: 'q-fallback-teamwork',
      category: 'LEADERSHIP_SCRUTINY',
      claimTitle: 'Solo Contribution vs Team Effort',
      lQuestion: 'Your resume repeatedly states "spearheaded" and "revolutionized". Can you name three colleagues who would corroborate that you did not simply merge other engineers\' pull requests?',
      lSubtext: 'Testing git blame accuracy vs claimed sole authorship.',
      badge: 'COLLABORATION AUDIT',
      actingCue: 'Acknowledge teamwork while asserting your personal technical design ownership.',
      suggestedDefense: 'I collaborated closely with senior engineers, but the core system architecture and pull requests were designed and implemented directly by me.',
    },
    {
      id: 'q-fallback-git',
      category: 'EMERGENCY_COMPETENCE',
      claimTitle: 'Git Disaster Recovery Under Pressure',
      lQuestion: 'If you accidentally committed an unencrypted production API key to the main branch ten minutes before a release, describe your recovery steps without using git push --force. Let us see if your heart rate remains steady.',
      lSubtext: 'Observing cardiovascular reaction under incident simulation.',
      badge: 'DISASTER PROTOCOL',
      actingCue: 'Walk through your incident steps with surgical precision.',
      suggestedDefense: 'I would immediately revoke the compromised key in secrets management, rotate credentials, scrub history via git-filter-repo, and re-deploy.',
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
    peakStressMoment?: PeakStressMoment;
    previousTestimonies?: { questionTitle: string; testimony: string }[];
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

  const aiKeywords = ['ai', 'llm', 'gpt', 'rag', 'embedding', 'langchain', 'fine-tune', 'prompt', 'transformer', 'pytorch', 'openai'];
  const isAI = aiKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const streamingKeywords = ['kafka', 'stream', 'event', 'pubsub', 'partition', 'consumer', 'broker', 'rabbitmq', 'queue'];
  const isStreaming = streamingKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const graphqlKeywords = ['graphql', 'apollo', 'mutation', 'resolver', 'schema', 'rest', 'endpoint'];
  const isGraphQL = graphqlKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const rustKeywords = ['rust', 'borrow', 'lifetime', 'unsafe', 'cargo', 'mutex', 'tokio', 'memory'];
  const isRust = rustKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  const securityKeywords = ['jwt', 'token', 'auth', 'oauth', 'crypto', 'hash', 'bcrypt', 'encryption', 'ssl', 'tls'];
  const isSecurity = securityKeywords.some((k) => lowerTestimony.includes(k) || lowerClaim.includes(k));

  // Contradiction Detection against earlier testimonies
  let detectedContradiction: { prevTitle: string; reason: string } | null = null;
  if (biometrics.previousTestimonies && biometrics.previousTestimonies.length > 0) {
    for (const prev of biometrics.previousTestimonies) {
      const prevLower = prev.testimony.toLowerCase();
      // Check 1: Solo vs Team Paradox
      const prevClaimedSolo = prevLower.includes('sole') || prevLower.includes('solo') || prevLower.includes('alone') || prevLower.includes('by myself');
      const nowClaimsTeam = lowerTestimony.includes('our team') || lowerTestimony.includes('entire team') || lowerTestimony.includes('collaborated with') || lowerTestimony.includes('coordinated with') || lowerTestimony.includes('cross functional');
      if (prevClaimedSolo && nowClaimsTeam) {
        detectedContradiction = {
          prevTitle: prev.questionTitle,
          reason: 'claimed solo authorship earlier, but now pivots to team execution',
        };
        break;
      }

      // Check 2: 100% test coverage vs no tests / untested
      const prevClaimedPerfection = prevLower.includes('100%') || prevLower.includes('zero bug') || prevLower.includes('exhaustive test');
      const nowAdmitsRushing = lowerTestimony.includes('skipped test') || lowerTestimony.includes('no time') || lowerTestimony.includes('fast mvp') || lowerTestimony.includes('directly in prod');
      if (prevClaimedPerfection && nowAdmitsRushing) {
        detectedContradiction = {
          prevTitle: prev.questionTitle,
          reason: 'claimed flawless test rigor earlier, but now confesses to cutting corners',
        };
        break;
      }
    }
  }

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
  let bluffProb = 45.0;

  if (deltaBPM >= 8) bluffProb += 24.5;
  else if (deltaBPM >= 4) bluffProb += 12.0;
  else if (deltaBPM <= 2) bluffProb -= 12.0;

  if (hrv < 38) bluffProb += 14.0;
  else if (hrv > 60) bluffProb -= 10.0;

  if (gazeDeviations >= 2) bluffProb += 11.5;
  if (blinks >= 22) bluffProb += 7.5;

  if (wordCount === 0) bluffProb = 98.9;
  else if (wordCount < 4) bluffProb += 22.0;
  else if (hasTechnicalSubstance) bluffProb -= 14.0;
  else if (detectedBuzzwords.length >= 2) bluffProb += 12.0;

  bluffProb = Math.min(99.2, Math.max(12.4, Math.round(bluffProb * 10) / 10));

  let suspicionDelta = 14;
  if (bluffProb >= 85) suspicionDelta = 26;
  else if (bluffProb >= 70) suspicionDelta = 20;
  else if (bluffProb >= 50) suspicionDelta = 15;
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

  const peakMoment = biometrics.peakStressMoment;
  const hasPeakMoment = peakMoment && peakMoment.deltaBPM >= 5 && peakMoment.phrase.trim().length > 1;
  const temporalTell = hasPeakMoment
    ? ` Notice that your pulse spiked to ${peakMoment.peakBPM} BPM (+${peakMoment.deltaBPM} BPM above baseline) the exact instant you uttered "${peakMoment.phrase}".`
    : '';

  let deductionText = '';

  // =========================================================================
  // PRIORITY 1: CANDIDATE SUBMITTED EMPTY DIALOGUE / REMAINED COMPLETELY SILENT (0 words)
  // =========================================================================
  if (wordCount === 0) {
    if (biometrics.isPreset) {
      deductionText = `${lGesture} (stares in profound, chilling silence from the edge of his chair)... Absolute silence, Light-kun? Not a single word to defend "${question.claimTitle}"? When an innocent honor student is falsely accused of capital crimes, the natural human psychological reflex is immediate, indignant verbal protest. Yet you sat there in dead silence, submitting a completely blank response while Presage sensors logged your carotid pulse at ${peakBPM} BPM (+${deltaBPM} BPM above baseline) and sympathetic tone flared to ${tone}%. You remained silent because your genius intellect calculated that any alibi you invent on the spot will be shredded by my telemetry. In an interrogation room under 64 cameras, Light-kun... silence is not innocence. Silence is Kira's signature. Bluff probability: 98.9%.`;
      return { deductionText, suspicionDelta: 28, bluffProbability: 98.9 };
    } else {
      deductionText = `${lGesture} (spins a dessert spoon against porcelain, dark circles fixed on you)... A completely blank submission? Not a single syllable to defend "${question.claimTitle}", ${candidateHonorific}? When an engineer who allegedly built a production system sits in total silence under optical cross-examination, there is an 97.4% probability they have never touched the codebase. Presage sensors captured an autonomic tone of ${tone}% and ${gazeDeviations} averted gazes during your silence. You didn't submit an engineering defense—you submitted a silent confession. Bluff probability: 97.4%.`;
      return { deductionText, suspicionDelta: 28, bluffProbability: 97.4 };
    }
  }

  // =========================================================================
  // PRIORITY 2: MONOSYLLABIC / TERSE DEFLECTION (1 to 3 words, e.g. "no", "idk", "whatever")
  // =========================================================================
  if (wordCount < 4) {
    if (biometrics.isPreset) {
      deductionText = `${lGesture} (bites right thumbnail, eyes narrowing)... Exactly ${wordCount} word${wordCount === 1 ? '' : 's'}, Light-kun? "${testimony.trim()}"? A To-Oh University valedictorian defending his life with monosyllabic grunts? An innocent man provides context, dates, and evidence. A guilty mastermind trapped under 64 surveillance cameras provides the bare minimum, terrified that a single extra word will slip into a forensic admission. Observe your pulse: ${peakBPM} BPM (+${deltaBPM} BPM surge) and HRV down to ${hrv}ms. Your brevity is screaming what your voice refuses to say. Bluff probability: 95.4%.`;
      return { deductionText, suspicionDelta: 24, bluffProbability: 95.4 };
    } else {
      deductionText = `${lGesture} (tilts head at a 45-degree angle, pointing his index finger at your pulse trace)... Barely ${wordCount} word${wordCount === 1 ? '' : 's'} to defend "${question.claimTitle}", ${candidateHonorific}? "${testimony.trim()}" is not an architectural defense. When an engineer who supposedly authored this system retreats into monosyllabic deflection, the probability they are bluffing is virtually 93.6%. Presage rPPG clocked a +${deltaBPM} BPM carotid surge right as your gaze darted away ${gazeDeviations} times. Silence and evasion under polygraph are equally fatal. Bluff probability: 93.6%.`;
      return { deductionText, suspicionDelta: 24, bluffProbability: 93.6 };
    }
  }

  // =========================================================================
  // PRIORITY 3: LIGHT YAGAMI PRESET (Substantive Testimony, wordCount >= 4)
  // =========================================================================
  if (biometrics.isPreset) {
    if (qIndex === 0) {
      // Potato Chip LCD Rig
      const hasSnackWords = ['potato', 'chip', 'snack', 'eat', 'exam', 'study', 'grease', 'bag'].some((w) => lowerTestimony.includes(w));
      if (hasSnackWords) {
        if (deltaBPM <= 3) {
          deductionText = `${lGesture} (stacks a third sugar cube with surgical stillness)... "I'll take a potato chip... and eat it." Light-kun, you delivered that defense with terrifying, unruffled composure. Presage Ch.01 logged an unflinching ${peakBPM} BPM (+${deltaBPM} BPM delta). Most mortals would choke on a snack under 64 surveillance cameras. To remain this calm while eating snacks under suspicion of mass murder is either miraculous innocence... or the chilling psychological discipline of Kira himself. Bluff probability: ${bluffProb}%.`;
        } else {
          deductionText = `${lGesture} (leans forward, dark circles piercing)... You claim you were merely eating a potato chip while studying for university entrance exams. But look at the CCTV telemetry, Light-kun. The moment you insisted you were innocent, Presage rPPG logged a +${deltaBPM} BPM carotid surge to ${peakBPM} BPM, and your gaze shifted ${gazeDeviations} times. Even Japan's top student cannot hide micro-vascular vasodilation. You weren't eating a snack—you were executing criminals on a hidden LCD. Bluff probability: ${bluffProb}%.`;
        }
      } else {
        deductionText = `${lGesture} (calmly slides a strawberry into his mouth)... Light-kun, I specifically cross-examined you regarding the covert potato-chip LCD rig, yet you gave a tangential lecture on "${rawWords.slice(0, 3).join(' ')}". A classic diversionary tactic. Notice how during this diversion, Presage Ch.01 clocked your pulse climbing +${deltaBPM} BPM to ${peakBPM} BPM. When an honor student avoids a simple question about snacks, my suspicion rises by 15%. Bluff probability: ${bluffProb}%.`;
      }
    } else if (qIndex === 1) {
      // 40-sec SLA
      const hasSLAWords = ['40', 'forty', 'second', 'queue', 'sla', 'incident', 'cardiac', 'heart', 'backend', 'engineer'].some((w) => lowerTestimony.includes(w));
      if (hasSLAWords) {
        deductionText = `${lGesture} (twirls a dessert spoon against his porcelain saucer)... A distributed incident queue guaranteeing ticket resolution in precisely forty seconds. You argue any competent backend engineer could build such an SLA. But tell me, Light-kun: why did your heart rate climb by +${deltaBPM} BPM to ${peakBPM} BPM and your HRV collapse to ${hrv}ms the moment I linked forty seconds to fatal cardiac arrest? You didn't architect an engineering pipeline, Light-kun—you architected an alibi for death. Bluff probability: ${bluffProb}%.`;
      } else {
        deductionText = `${lGesture} (bites thumbnail)... You speak ${wordCount} words, yet you carefully circumvented the 40-second delay. Presage Ch.02 clocked your autonomic tone spiking to ${tone}%. Forty seconds is the exact clinical delay of a Kira execution. An innocent engineer would show me system metrics; you showed me cardiovascular distress. Bluff probability: ${bluffProb}%.`;
      }
    } else if (qIndex === 2) {
      // Lind L. Tailor Kanto Broadcast Trap
      const hasBroadcastWords = ['broadcast', 'tailor', 'tv', 'kanto', 'bait', 'trap', 'inmate', 'decoy', 'speculation'].some((w) => lowerTestimony.includes(w));
      if (hasBroadcastWords) {
        deductionText = `${lGesture} (bites thumb, eyes narrowing)... You claim my television broadcast was an illegal bait trap using a condemned death-row decoy. You are entirely correct: it was a trap. And Kira walked directly into it. What fascinates me is that while you denounce my broadcast as 'baseless speculation', Presage Ch.03 clocked your blink rate surging to ${blinks}/min and your ocular alignment drifting ${gazeDeviations} times. Your autonomic nervous system is reliving that exact humiliation on live television. Bluff probability: ${bluffProb}%.`;
      } else {
        deductionText = `${lGesture} (tilts head at a 45-degree angle, pointing at your spectrogram)... You avoid discussing Lind L. Tailor altogether, Light-kun. During that broadcast, Kira murdered a decoy process in seconds of provocation. As we revisit that day, your carotid pulse climbed +${deltaBPM} BPM to ${peakBPM} BPM. Your body remembers the trap even if your tongue refuses to admit it. Bluff probability: ${bluffProb}%.`;
      }
    } else {
      // God of the New World Architecture
      const hasGodWords = ['god', 'world', 'justice', 'safer', 'safe', 'crime', 'technology', 'student'].some((w) => lowerTestimony.includes(w));
      if (hasGodWords) {
        deductionText = `${lGesture} (stares through dark circles in profound silence)... 'A safer world through technology'... such noble, deceptive rhetoric, Light-kun. Yet observe your carotid spectrogram: sympathetic arousal flared to ${tone}%, your carotid pulse hit ${peakBPM} BPM, and your vagal tone collapsed to ${hrv}ms. That is the exact physiological signature of megalomaniacal euphoria. You do not wish to write software for humanity, Light-kun. You want to be God of the New World. Telemetry does not bow before gods. Bluff probability: ${bluffProb}%.`;
      } else {
        deductionText = `${lGesture} (crouches tightly, knees pressed to chest)... Even when pressed on your grand architecture, you offer evasive rhetoric. Presage optical telemetry confirms a +${deltaBPM} BPM carotid surge and ${gazeDeviations} gaze evasions. You cannot outsmart optical biometrics, Light-kun. Every heartbeat brings you closer to the gallows. Bluff probability: ${bluffProb}%.`;
      }
    }
    return { deductionText, suspicionDelta, bluffProbability: bluffProb };
  }

  // =========================================================================
  // PRIORITY 4: CUSTOM CANDIDATES (Substantive Testimony, wordCount >= 4)
  // =========================================================================
  if (detectedContradiction) {
    deductionText = `${lGesture} (stops his dessert spoon in mid air, dark circles piercing straight through you)... A fatal contradiction, ${candidateHonorific}. In your defense of "${detectedContradiction.prevTitle}", you testified that you ${detectedContradiction.reason}. Yet here you stand under Presage polygraph, reversing your deposition. When an engineer contradicts their own prior statement, it proves beyond mathematical doubt that they are fabricating their experience in real time. Carotid pulse surge: +${deltaBPM} BPM.${temporalTell} Bluff probability: 97.8%.`;
    return {
      deductionText,
      suspicionDelta: 28,
      bluffProbability: 97.8,
    };
  } else if (isAutoFill) {
    deductionText = `${lGesture} (calmly eats a pastry)... You claim to have 'guaranteed strict p99 benchmarks without regression from the ground up', yet you failed to quote a single profiling tool or memory boundary. Spouting rehearsed elevator pitches while your carotid pulse accelerates by +${deltaBPM} BPM is the classic forensic signature of an imposter reciting Medium articles. Bluff probability: ${bluffProb}%.`;
  } else if (hasAbsurdClaim) {
    deductionText = `${lGesture} (stacks sugar cubes)... Zero latency and 100% bug free operation? ${candidateHonorific}, not even Google, NASA, or the High Court operates without failure modes. Claiming computational perfection in front of optical biometric sensors is sheer comedic hubris. Your pulse surged +${deltaBPM} BPM the moment you said it. Bluff probability: ${bluffProb}%.`;
  } else if (detectedBuzzwords.length >= 2) {
    const bwStr = detectedBuzzwords.slice(0, 2).map((w) => `"${w}"`).join(' and ');
    deductionText = `${lGesture} You string together corporate buzzwords like ${bwStr} the way amateur magicians deploy smoke bombs. When an engineer actually writes the code, they speak in algorithms, race conditions, and unit tests—not LinkedIn marketing copy. Presage optical telemetry clocked ${gazeDeviations} ocular shifts and an HRV of ${hrv}ms. Bluff probability: ${bluffProb}%.`;
  } else if (isAI) {
    deductionText = `${lGesture} (calmly nibbles on a strawberry)... Calling a commercial completion endpoint and wrapping three prompt templates in a tutorial UI does not make you an artificial intelligence engineer, ${candidateHonorific}. When I probe on gradient descent, loss convergence, and token entropy, your pulse surged +${deltaBPM} BPM.${temporalTell} You are not training neural models; you are a glorified JSON proxy. Bluff probability: ${bluffProb}%.`;
  } else if (isStreaming) {
    deductionText = `${lGesture} Claiming enterprise event streaming with Kafka while your consumer group rebalancing lags by forty minutes during partitions is sheer fantasy, ${candidateHonorific}. Presage rPPG clocked a +${deltaBPM} BPM carotid surge and an HRV collapse to ${hrv}ms.${temporalTell} You did not engineer fault tolerant pubsub; you built a distributed message cemetery. Bluff probability: ${bluffProb}%.`;
  } else if (isGraphQL) {
    deductionText = `${lGesture} (stacks sugar cubes)... You praise GraphQL for eliminating over-fetching, yet you left your schema exposed to quadratic N+1 query cascades and circular depth bombs. Notice how your blink rate jumped to ${blinks}/min and pulse surged +${deltaBPM} BPM.${temporalTell} One complex nested query would crash your entire cluster. Bluff probability: ${bluffProb}%.`;
  } else if (isRust) {
    deductionText = `${lGesture} Ah, Rust... the language where developers spend forty hours battling borrow checker lifetime semantics only to wrap the production engine in an unsafe pointer dereference. Your pulse climbed +${deltaBPM} BPM to ${peakBPM} BPM.${temporalTell} Memory safety on paper does not cure architectural negligence. Bluff probability: ${bluffProb}%.`;
  } else if (isSecurity) {
    deductionText = `${lGesture} Storing unencrypted session tokens in client localStorage with zero rotation policies is not cryptographic security, ${candidateHonorific}. It is an open door for cross site script execution. Presage optical sensors captured ${gazeDeviations} ocular shifts and a +${deltaBPM} BPM cardiac surge.${temporalTell} Bluff probability: ${bluffProb}%.`;
  } else if (isFrontend) {
    if (deltaBPM <= 3 && hasTechnicalSubstance) {
      deductionText = `${lGesture} Remarkable. You defended DOM reconciliation and client state management with an unruffled pulse (+${deltaBPM} BPM, ${hrv}ms HRV). Either you truly understand browser rendering pipelines... or you are an extraordinarily cold-blooded candidate who rehearsed in front of a mirror. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `${lGesture} Wrapping a third-party UI component and blindly passing props down twelve layers is not 'frontend architecture', ${candidateHonorific}. When I probed on re-render performance, Presage Ch.01 logged a +${deltaBPM} BPM carotid surge right as your gaze drifted away ${gazeDeviations} times. You built a tutorial app and called it an enterprise client. Probability of resume bluffing: ${bluffProb}%.`;
    }
  } else if (isBackend) {
    if (deltaBPM >= 6) {
      deductionText = `${lGesture} Ah, 'microservices'... the universal industry excuse to take a simple 50-line monolith and introduce fifteen distributed points of network failure. Your heart rate climbed by +${deltaBPM} BPM to ${peakBPM} BPM the moment I mentioned circuit breakers.${temporalTell} You didn't architect a resilient backend, ${candidateHonorific}—you built a network latency generator. Bluff probability: ${bluffProb}%.`;
    } else {
      deductionText = `${lGesture} (twirls spoon)... You speak of scalable APIs, yet Presage Ch.02 caught your HRV tightening to ${hrv}ms under cross-examination.${temporalTell} An engineer who actually benchmarked event-loop starvation does not exhibit sympathetic distress when asked about connection pools. Bluff probability: ${bluffProb}%.`;
    }
  } else if (isDatabase) {
    deductionText = `${lGesture} Slapping a Redis cache in front of an unindexed SQL query does not make you a database engineer, ${candidateHonorific}. It merely delays database deadlock until Black Friday traffic spikes. Presage sensors captured ${blinks} blinks/min and a +${deltaBPM} BPM pulse jump.${temporalTell} You've never run an EXPLAIN query in production. Bluff probability: ${bluffProb}%.`;
  } else if (isDevOps) {
    deductionText = `${lGesture} Copying YAML manifests from StackOverflow and pushing to a cloud cluster does not constitute 'cloud orchestration', ${candidateHonorific}. When I mentioned an unhandled SIGTERM at 3:00 AM, your pulse climbed +${deltaBPM} BPM to ${peakBPM} BPM.${temporalTell} You don't have a disaster recovery plan—you have an emergency prayer. Bluff probability: ${bluffProb}%.`;
  } else if (hasTechnicalSubstance && deltaBPM <= 3) {
    deductionText = `${lGesture} (observes CCTV with quiet fascination)... Remarkable. You defended "${question.claimTitle}" while your pulse sat at an unflinching ${peakBPM} BPM (+${deltaBPM} BPM delta, ${hrv}ms HRV). Most engineers stammer or fidget when cross-examined on production failures. For you to maintain such cold physiological stillness suggests either undeniable technical competence... or you are an extraordinarily polished sociopath. Initial bluff probability: ${bluffProb}%.`;
  } else {
    deductionText = `${lGesture} You delivered ${wordCount} words on "${question.claimTitle}", ${candidateHonorific}. Yet observe your carotid trace: your pulse climbed +${deltaBPM} BPM, sympathetic tone flared to ${tone}%, and you averted your gaze ${gazeDeviations} times.${temporalTell} While your voice attempted confidence, your micro-circulation reveals undeniable apprehension. Calculated probability of resume puffery: ${bluffProb}%.`;
  }

  return {
    deductionText,
    suspicionDelta,
    bluffProbability: bluffProb,
  };
}
