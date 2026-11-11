// Real Anime Voice and Soundtrack Controller for L (Death Note)
// Includes real-time DSP de-reverb filtering & tail-gating to remove room echo

class RealAudioController {
  private voiceAudio: HTMLAudioElement | null = null;
  private themeAudio: HTMLAudioElement | null = null;
  private isThemePlaying = false;
  private audioCtx: AudioContext | null = null;
  private voiceSource: MediaElementAudioSourceNode | null = null;
  private isAudioHooked = false;
  private voiceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.voiceAudio = new Audio('/l-voice-intro.mp3');
      this.themeAudio = new Audio('/l-theme.mp3');
      this.themeAudio.loop = true;
      this.themeAudio.volume = 0.35;
    }
  }

  // Setup Web Audio de-reverberation filter chain
  private initVoiceDSP() {
    if (this.isAudioHooked || !this.voiceAudio || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      this.voiceSource = this.audioCtx.createMediaElementSource(this.voiceAudio);

      // 1. High-Pass filter: Cuts the boomy low-end room reverberation (< 260Hz)
      const highPass = this.audioCtx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 260;

      // 2. Peaking EQ Notch: Cuts the boxy hollow room reflection (480Hz)
      const notch = this.audioCtx.createBiquadFilter();
      notch.type = 'peaking';
      notch.frequency.value = 480;
      notch.gain.value = -9.0;
      notch.Q.value = 1.8;

      // 3. High-shelf cut: Tames metallic room flutter echo (> 4200Hz)
      const highShelf = this.audioCtx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.value = 4200;
      highShelf.gain.value = -4.0;

      // 4. Dynamics Compressor: Tightens vocal punch and suppresses the ambient reverb decay
      const compressor = this.audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 8;
      compressor.ratio.value = 4.5;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.12;

      // Connect DSP chain
      this.voiceSource.connect(highPass);
      highPass.connect(notch);
      notch.connect(highShelf);
      highShelf.connect(compressor);
      compressor.connect(this.audioCtx.destination);

      this.isAudioHooked = true;
    } catch (err) {
      console.warn('Web Audio DSP not hooked, fallback to direct element audio:', err);
    }
  }

  // Play L's voice with de-reverb filter and tail cutoff
  public playLVoice(onEnd?: () => void) {
    if (!this.voiceAudio) return;

    this.stopLVoice();
    this.initVoiceDSP();

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.voiceAudio.currentTime = 0;

    // Gate: L's speech ("Watashi wa L desu") finishes cleanly at 1.75s.
    // The rest of the original broadcast clip was just lingering stadium echo.
    // We cleanly stop at 1.75s to ensure a dry, close-mic vocal experience!
    this.voiceTimeout = setTimeout(() => {
      this.stopLVoice();
      onEnd?.();
    }, 1800);

    this.voiceAudio.onended = () => {
      if (this.voiceTimeout) clearTimeout(this.voiceTimeout);
      onEnd?.();
    };

    this.voiceAudio.play().catch((err) => {
      console.warn('Audio play failed:', err);
      if (this.voiceTimeout) clearTimeout(this.voiceTimeout);
      onEnd?.();
    });
  }

  public stopLVoice() {
    if (this.voiceTimeout) {
      clearTimeout(this.voiceTimeout);
      this.voiceTimeout = null;
    }
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
    }
  }

  // Toggle L's Theme (Piano OST)
  public toggleLTheme(): boolean {
    if (!this.themeAudio) return false;

    if (this.isThemePlaying) {
      this.themeAudio.pause();
      this.isThemePlaying = false;
    } else {
      this.themeAudio.play().catch(console.warn);
      this.isThemePlaying = true;
    }
    return this.isThemePlaying;
  }

  public isThemeActive(): boolean {
    return this.isThemePlaying;
  }

  public stopAll() {
    this.stopLVoice();
    if (this.themeAudio) {
      this.themeAudio.pause();
      this.isThemePlaying = false;
    }
  }
}

export const realAudio = new RealAudioController();
