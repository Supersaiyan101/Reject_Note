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

  // Dragon Ball Super Saiyan Ki Charge & Aura
  public playSuperSaiyanCharge(duration: number = 4.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Deep Sub-bass Rumble (Ki ground shake)
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

    // 2. Rising Golden Aura Shimmer (Detuned dual saw oscillators with LFO flutter)
    const auraOsc1 = this.ctx.createOscillator();
    const auraOsc2 = this.ctx.createOscillator();
    const auraGain = this.ctx.createGain();
    const auraFilter = this.ctx.createBiquadFilter();

    auraOsc1.type = 'sawtooth';
    auraOsc2.type = 'sawtooth';
    auraOsc1.frequency.setValueAtTime(110, now);
    auraOsc2.frequency.setValueAtTime(113, now); // 3Hz natural chorusing/detune

    auraOsc1.frequency.exponentialRampToValueAtTime(440, now + duration);
    auraOsc2.frequency.exponentialRampToValueAtTime(445, now + duration);

    auraFilter.type = 'bandpass';
    auraFilter.frequency.setValueAtTime(220, now);
    auraFilter.frequency.linearRampToValueAtTime(880, now + duration);
    auraFilter.Q.setValueAtTime(3.0, now);

    auraGain.gain.setValueAtTime(0.005, now);
    auraGain.gain.linearRampToValueAtTime(0.14, now + duration * 0.85);
    auraGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    auraOsc1.connect(auraFilter);
    auraOsc2.connect(auraFilter);
    auraFilter.connect(auraGain);
    auraGain.connect(this.ctx.destination);

    auraOsc1.start(now);
    auraOsc2.start(now);
    auraOsc1.stop(now + duration);
    auraOsc2.stop(now + duration);

    // 3. Electric Lightning Sparks (Super Saiyan crackles)
    const sparkInterval = 0.35;
    for (let t = 0.5; t < duration - 0.4; t += sparkInterval) {
      const sparkOsc = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      sparkOsc.type = 'square';
      sparkOsc.frequency.setValueAtTime(1200 + Math.random() * 800, now + t);
      sparkOsc.frequency.exponentialRampToValueAtTime(300, now + t + 0.06);

      sparkGain.gain.setValueAtTime(0.06, now + t);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.06);

      sparkOsc.connect(sparkGain);
      sparkGain.connect(this.ctx.destination);

      sparkOsc.start(now + t);
      sparkOsc.stop(now + t + 0.07);
    }
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

