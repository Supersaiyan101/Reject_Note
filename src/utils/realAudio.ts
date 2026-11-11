// Real Anime Soundtrack Controller for Character Themes

class RealAudioController {
  private themeAudio: HTMLAudioElement | null = null;
  private isThemePlaying = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.themeAudio = new Audio('/l-theme.mp3');
      this.themeAudio.loop = true;
      this.themeAudio.volume = 0.4;
    }
  }

  // Toggle character theme (e.g. L's Theme Piano OST)
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
    if (this.themeAudio) {
      this.themeAudio.pause();
      this.isThemePlaying = false;
    }
  }
}

export const realAudio = new RealAudioController();
