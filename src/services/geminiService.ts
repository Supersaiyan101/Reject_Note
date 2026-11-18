import type { InterrogationQuestion, PeakStressMoment } from '../types';

export interface LLMRoastParams {
  candidateName: string;
  isPreset: boolean;
  questionIndex: number;
  question: InterrogationQuestion;
  testimony: string;
  previousTestimonies?: { questionTitle: string; testimony: string }[];
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
    peakStressMoment?: PeakStressMoment;
  };
}

export interface LLMDeductionResult {
  deductionText: string;
  suspicionDelta: number;
  bluffProbability: number;
  source: 'GEMINI_LLM' | 'HEURISTIC';
}

const LOCAL_STORAGE_KEY = 'reject_note_gemini_api_key';

export function getGeminiApiKey(): string | null {
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  if (localKey && localKey.trim()) return localKey.trim();

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) return envKey.trim();

  return null;
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}

export function isGeminiEnabled(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function generateGeminiRoast(params: LLMRoastParams): Promise<LLMDeductionResult | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const {
    candidateName,
    questionIndex,
    question,
    testimony,
    biometrics,
  } = params;

  const hrv = biometrics.hrvMs ?? 65;
  const blinks = biometrics.blinkRate ?? 15;
  const tone = biometrics.sympatheticTone ?? 18;
  const delta = biometrics.deltaBPM;
  const peak = biometrics.peakBPM;

  const peakMoment = biometrics.peakStressMoment;
  const peakMomentPrompt = peakMoment && peakMoment.deltaBPM >= 4
    ? `- Exact Phrase Where Pulse Peaked: "${peakMoment.phrase}" (Spiked to ${peakMoment.peakBPM} BPM, +${peakMoment.deltaBPM} BPM). Point this exact phrase out as their cardiovascular tell.`
    : '';

  const historyPrompt = params.previousTestimonies && params.previousTestimonies.length > 0
    ? `\nPREVIOUS TESTIMONY HISTORY (Auditing for contradictions across answers):
${params.previousTestimonies.map((h, i) => `Exhibit #${i + 1} (${h.questionTitle}): "${h.testimony}"`).join('\n')}`
    : '';

  const prompt = `
You are L Lawliet, the world-renowned eccentric genius master detective from Death Note.
You are interrogating a software engineer candidate named "${candidateName}" in a high-stakes tech interview chamber wired with Presage SmartSpectra optical polygraph biometric sensors.

INTERROGATION CONTEXT (Question ${questionIndex + 1} of 4):
- Target Claim: "${question.claimTitle}"
- Your Cross-Examination Question Was: "${question.lQuestion}"
- What The Candidate Testified in Their Defense: "${testimony || '[Candidate remained completely silent and refused to answer]'}"
${historyPrompt}

REAL-TIME PRESAGE OPTICAL SENSOR TELEMETRY (Captured live through webcam):
- Resting Baseline Pulse: ${biometrics.baselineBPM} BPM
- Peak Pulse During Testimony: ${peak} BPM (Surge: +${delta} BPM)
${peakMomentPrompt}
- Heart Rate Variability (SDNN): ${hrv} ms (Normal healthy calm: >55ms; Autonomic stress collapse: <38ms)
- Micro-Blink Rate: ${blinks} blinks/min
- Ocular Gaze Shifts: ${biometrics.gazeDeviations} deviations away from camera lens
- Autonomic Sympathetic Tone: ${tone}% (0-100% arousal)

INSTRUCTIONS:
Deliver a razor-sharp, devastatingly intellectual, forensic, and sarcastic roast of the candidate's testimony and claim.

Key Requirements:
1. Speak fully in-character as L Lawliet.
2. Begin with one of L's distinctive eccentric physical gestures in parentheses, e.g. (stacks three sugar cubes into a delicate spire)... or (twirls a dessert spoon against a porcelain teacup)... or (bites thumbnail, dark circles locked onto the spectrogram)... or (calmly nibbles on a slice of strawberry cake without blinking)...
3. Address the candidate directly (${candidateName.toLowerCase().includes('light') ? 'Light-kun' : candidateName.split(' ')[0] + '-san'}).
4. ROAST their actual defense:
   - If they gave empty buzzwords ("synergy", "seamless", "scalable", "best practices"), ruthlessly mock their corporate word salad.
   - If they gave an evasive or very short response (< 5 words), mock their cowardly silence.
   - If they contradicted any of their earlier answers from PREVIOUS TESTIMONY HISTORY, savagely highlight the contradiction as proof of fabrication.
   - If their pulse spiked on a specific phrase, mock how their capillaries betrayed that exact statement.
   - If they made an absurd claim (e.g. 0ms latency, 100% bug-free, writing C++ with one hand), mathematically dissect why it's physically or computationally impossible.
   - If they gave a calm, highly technical response, hit them with a backhanded compliment about their sociopathic composure or question whether they memorized it from documentation.
5. Directly quote at least two Presage biometric sensor readouts (e.g. "+${delta} BPM carotid surge", "${hrv}ms HRV vagal collapse", "${biometrics.gazeDeviations} ocular shifts").
6. Conclude with a precise Death Note probabilistic deduction (e.g. "There is an 84.7% probability this claim is pure fiction.").
7. Keep the monologue punchy: 2 to 4 sentences maximum (about 50 to 90 words).

RETURN ONLY VALID JSON matching this exact schema:
{
  "deductionText": "L's spoken monologue here",
  "suspicionDelta": 18, // Integer 8 to 25 based on how guilty/bluffing they seem
  "bluffProbability": 78.4 // Float between 12.0 and 97.0
}
`;

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Gemini API ${model} failed with status:`, response.status);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      if (parsed.deductionText && typeof parsed.bluffProbability === 'number') {
        return {
          deductionText: parsed.deductionText.trim(),
          suspicionDelta: Math.max(8, Math.min(25, Math.round(parsed.suspicionDelta || 18))),
          bluffProbability: Math.max(12.0, Math.min(98.0, Math.round(parsed.bluffProbability * 10) / 10)),
          source: 'GEMINI_LLM',
        };
      }
    } catch (err) {
      console.warn(`Error generating L roast via ${model}:`, err);
    }
  }

  return null;
}

export interface LLMRebuttalParams {
  candidateName: string;
  claimTitle: string;
  lOriginalDeduction: string;
  candidateObjection: string;
  currentBPM: number;
  deltaBPM: number;
}

export async function generateGeminiRebuttal(params: LLMRebuttalParams): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const prompt = `
You are L Lawliet from Death Note.
You just roasted a software candidate named "${params.candidateName}" regarding their claim "${params.claimTitle}".
Your previous deduction was: "${params.lOriginalDeduction}"

The candidate just objected to your deduction with:
"${params.candidateObjection}"

Live Presage Polygraph Telemetry:
Candidate current pulse: ${params.currentBPM} BPM (+${params.deltaBPM} BPM above baseline).

INSTRUCTIONS:
Respond fully in-character as L Lawliet to dismantle their objection.
Begin with an eccentric gesture in parentheses, e.g. (twirls spoon slowly)... or (calmly tilts head, eyes wide)...
Deliver a concise, razor-sharp 2-sentence counter-argument dismissing their protest with cold logic and citing their elevated pulse.
Return only plain text, no JSON.
`;

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          },
        }),
      });

      if (!response.ok) continue;
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText && rawText.trim()) {
        return rawText.trim();
      }
    } catch (err) {
      console.warn('Rebuttal generation failed:', err);
    }
  }

  return null;
}
