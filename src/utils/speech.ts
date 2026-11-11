// Web Speech API Voice Engine tuned for L (Lawliet)

class LSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public speakAsL(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find an analytical / British or deep calm voice if possible
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('UK') ||
          v.name.includes('British') ||
          v.name.includes('Daniel') ||
          v.name.includes('Male') ||
          v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('en')) || null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // L's signature speech parameters: slow, calm, deadpan, slightly lower pitch
    utterance.pitch = 0.82;
    utterance.rate = 0.88;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    this.synth.speak(utterance);
  }
}

export const lSpeechEngine = new LSpeechEngine();
