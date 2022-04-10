export enum SoundTrack {
  GAME = 'assets/sounds/bbiy-soundtrack.mp3',
}

export enum SoundEffect {
  DEAD = 'assets/sounds/dead.mp3',
  MOVE = 'assets/sounds/move.mp3',
  WIN_CHANGE = 'assets/sounds/win-change.mp3',
  WIN = 'assets/sounds/win.mp3',
}

export class AudioDriver {
  private soundTracks: { [key in SoundTrack]?: HTMLAudioElement } = {};
  private soundEffects: { [key in SoundEffect]?: HTMLAudioElement } = {};
  public currentSoundTrack?: HTMLAudioElement;
  public isPlaying = false;

  init(): Promise<void> {
    return Promise.all([
      this.initAudio(SoundTrack.GAME, true),
      this.initAudio(SoundEffect.DEAD),
      this.initAudio(SoundEffect.MOVE),
      this.initAudio(SoundEffect.WIN_CHANGE),
      this.initAudio(SoundEffect.WIN),
    ]).then(([soundtrack, dead, move, winChange, win]) => {
      this.soundTracks[SoundTrack.GAME] = soundtrack;
      this.soundEffects[SoundEffect.DEAD] = dead;
      this.soundEffects[SoundEffect.MOVE] = move;
      this.soundEffects[SoundEffect.WIN_CHANGE] = winChange;
      this.soundEffects[SoundEffect.WIN] = win;
    });
  }

  playSoundEffect(sound: SoundEffect) {
    (this.soundEffects[sound]?.cloneNode() as any)?.play();
  }

  playMusic(track?: SoundTrack) {
    if (this.isPlaying) {
      this.stopMusic();
    }
    this.currentSoundTrack = this.soundTracks[track || SoundTrack.GAME];
    this.isPlaying = true;
    this.currentSoundTrack?.play().catch(() => {
      this.isPlaying = false;
      this.currentSoundTrack = undefined;
    });
  }

  stopMusic() {
    this.currentSoundTrack?.pause();
    this.isPlaying = false;
    this.currentSoundTrack = undefined;
  }

  private initAudio(src: string, isSoundtrack = false): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(`Unable to init audio ${src} in a reasonable time`);
      }, 8000);
      const audio = new Audio(src);
      audio.autoplay = false;
      audio.loop = isSoundtrack;
      audio.oncanplay = () => {
        clearTimeout(timeout);
        resolve(audio);
      };
    });
  }

}
