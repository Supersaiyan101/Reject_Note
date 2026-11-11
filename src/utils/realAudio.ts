// Real Anime Voice and Soundtrack Controller for L (Death Note)

class RealAudioController {
  private voiceAudio: HTMLAudioElement | null = null;
  private themeAudio: HTMLAudioElement | null = null;
  private isThemePlaying = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.voiceAudio = new Audio('/l-voice-intro.mp3');
      this.themeAudio = new Audio('/l-theme.mp3');
      this.themeAudio.loop = true;
      this.themeAudio.volume = 0.45;
    }
  }

  // Play L's real anime voice line
  public playLVoice(onEnd?: () => void) {
    if (!this.voiceAudio) return;

    this.voiceAudio.pause();
    this.voiceAudio.currentTime = 0;

    this.voiceAudio.onended = () => {
      onEnd?.();
    };

    this.voiceAudio.play().catch((err) => {
      console.warn('Audio play error (user interaction required):', err);
      onEnd?.();
    });
  }

  public stopLVoice() {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
    }
  }

  // Toggle L's Theme (Iconic Piano Soundtrack)
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
