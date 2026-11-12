// Web Speech API and Web Audio Analyzer for Candidate Voice Testimony

export interface VoiceEngineCallbacks {
  onTranscriptUpdate: (transcript: string, isFinal: boolean) => void;
  onAudioLevel?: (level: number) => void; // 0 to 100
  onError?: (error: string) => void;
  onListeningStateChange?: (isListening: boolean) => void;
}

// Window typing for speech recognition
interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SpeechRecognition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webkitSpeechRecognition?: any;
}

export class CandidateVoiceEngine {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening = false;
  private hasFatalError = false;
  private restartTimeout: number | null = null;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private callbacks: VoiceEngineCallbacks | null = null;
  private currentTranscript = '';

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              this.currentTranscript += ' ' + piece;
            } else {
              interimTranscript += piece;
            }
          }
          const fullText = (this.currentTranscript + ' ' + interimTranscript).trim();
          this.callbacks?.onTranscriptUpdate(fullText, false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (
            event.error === 'network' ||
            event.error === 'not-allowed' ||
            event.error === 'service-not-allowed'
          ) {
            this.hasFatalError = true;
          }
          this.callbacks?.onError?.(event.error);
        };

        this.recognition.onend = () => {
          if (this.isListening && !this.hasFatalError) {
            if (this.restartTimeout) window.clearTimeout(this.restartTimeout);
            this.restartTimeout = window.setTimeout(() => {
              if (this.isListening && !this.hasFatalError) {
                try {
                  this.recognition?.start();
                } catch {
                  // Ignore already started
                }
              }
            }, 300);
          } else {
            this.isListening = false;
            this.callbacks?.onListeningStateChange?.(false);
          }
        };
      } catch (err) {
        console.warn('SpeechRecognition constructor failed:', err);
        this.recognition = null;
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null && !this.hasFatalError;
  }

  public async startListening(callbacks: VoiceEngineCallbacks): Promise<boolean> {
    this.callbacks = callbacks;
    this.currentTranscript = '';
    this.hasFatalError = false;

    // 1. Start Audio Meter via Web Audio API
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtx();
        const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const pollAudioLevel = () => {
          if (!this.analyser || !this.isListening) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          this.callbacks?.onAudioLevel?.(normalized);
          this.animFrameId = requestAnimationFrame(pollAudioLevel);
        };
        pollAudioLevel();
      }
    } catch (err) {
      console.warn('Microphone audio level capture warning:', err);
      this.callbacks?.onError?.('mic-permission-denied');
    }

    // 2. Start Speech Recognition
    if (this.recognition) {
      try {
        this.isListening = true;
        this.recognition.start();
        this.callbacks?.onListeningStateChange?.(true);
        return true;
      } catch {
        // Recognition might already be running, reset and try once
        try {
          this.recognition.abort();
          this.recognition.start();
          this.isListening = true;
          this.callbacks?.onListeningStateChange?.(true);
          return true;
        } catch (e2) {
          console.warn('Failed to start speech recognition:', e2);
        }
      }
    }

    // Fallback: mic audio level still works even if speech recognition is unsupported/blocked
    this.isListening = true;
    this.callbacks?.onListeningStateChange?.(true);
    return false;
  }

  public stopListening() {
    this.isListening = false;
    if (this.restartTimeout) {
      window.clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    this.callbacks?.onListeningStateChange?.(false);

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Ignore
      }
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  public getFinalTranscript(): string {
    return this.currentTranscript.trim();
  }
}

export const candidateVoiceEngine = new CandidateVoiceEngine();
