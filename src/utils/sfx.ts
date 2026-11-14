// Web Audio API Synthesizer for Anime Sound FX (No external assets required)

class AnimeSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Dragon Ball Scouter Power-Level Beep
  public playScouterBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600 + Math.random() * 600, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Laser Scan Hum
  public playLaserHum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(680, this.ctx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // Dramatic Anime Chord / Sting (Death Note / JoJo style)
  public playDramaticSting() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const rootFreq = 65.41; // C2 deep bass
    const freqs = [rootFreq, rootFreq * 1.498, rootFreq * 1.782]; // Minor chord

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, this.ctx!.currentTime + 1.2);

      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start();
      osc.stop(this.ctx!.currentTime + 1.2);
    });
  }

  // Heartbeat Thump (Optical Biometrics)
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Double beat: Lub-Dub
    [0, 0.12].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, this.ctx!.currentTime + offset);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx!.currentTime + offset + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + offset + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + offset);
      osc.stop(this.ctx!.currentTime + offset + 0.12);
    });
  }

  // UI Mechanical Click / Typewriter
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  private gokuAudio: HTMLAudioElement | null = null;

  // Dragon Ball Super Saiyan Ki Charge & Aura
  public playSuperSaiyanCharge() {
    if (this.isMuted) return;
    this.stopSuperSaiyanCharge();

    try {
      const audio = new Audio('/gokuyelling.mp3');
      audio.volume = 0.95;
      audio.currentTime = 0;
      this.gokuAudio = audio;

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Goku audio play blocked or error, falling back to synth aura:', err);
          this.playSuperSaiyanSynth(10);
        });
      }
    } catch {
      this.playSuperSaiyanSynth(10);
    }
  }

  public stopSuperSaiyanCharge() {
    if (this.gokuAudio) {
      try {
        this.gokuAudio.pause();
        this.gokuAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.gokuAudio = null;
    }
  }

  // Fallback synthesizer for Super Saiyan energy
  public playSuperSaiyanSynth(duration: number = 10) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(140, now + duration);

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(120, now);
    subFilter.frequency.linearRampToValueAtTime(380, now + duration);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + duration * 0.8);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + duration);
  }

  // Naruto Mangekyou Sharingan Activation on Baseline Lock
  public playMangekyouLock() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/itachi-mangekyou-voice.mp3');
      audio.volume = 0.9;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Mangekyou audio play blocked, falling back to dramatic sting:', err);
          this.playDramaticSting();
        });
      }
    } catch {
      this.playDramaticSting();
    }
  }
}

export const soundFX = new AnimeSoundEngine();

