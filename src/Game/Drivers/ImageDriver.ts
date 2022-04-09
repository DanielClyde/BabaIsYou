export enum ImageName {
  BABA_LETTERS = 'assets/baba-letters.png',
  BABA = 'assets/baba.png',
  BURN_LETTERS = 'assets/burn-letters.png',
  HEDGE = 'assets/bush.png',
  FIRE_PINK = 'assets/fire-pink.png',
  FIRE_PURPLE = 'assets/fire-purple.png',
  FIRE_RED = 'assets/fire-red.png',
  FIRE_WHITE = 'assets/fire-white.png',
  FIRE_ORANGE = 'assets/fire.png',
  FLAG_LETTERS = 'assets/flag-letters.png',
  FLAG = 'assets/flag.png',
  FLOOR = 'assets/floor.png',
  GRASS = 'assets/grass.png',
  IS_LETTERS = 'assets/is-letters.png',
  LAVA_LETTERS = 'assets/lava-letters.png',
  LAVA = 'assets/lava.png',
  PUSH_LETTERS = 'assets/push-letters.png',
  ROCK_LETTERS = 'assets/rock-letters.png',
  ROCK = 'assets/rock.png',
  SINK_LETTERS = 'assets/sink-letters.png',
  STOP_LETTERS = 'assets/stop-letters.png',
  WALL_LETTERS = 'assets/wall-letters.png',
  WALL = 'assets/wall.png',
  WATER_LETTERS = 'assets/water-letters.png',
  WATER = 'assets/water.png',
  WIN_LETTERS = 'assets/win-letters.png',
  YOU_LETTERS = 'assets/you-letters.png',
}

export class ImageDriver {
  static images: { [key in ImageName]?: HTMLImageElement } = {};

  static init(): Promise<void> {
    return Promise.all([
      this.initImage(ImageName.BABA_LETTERS),
      this.initImage(ImageName.BABA),
      this.initImage(ImageName.BURN_LETTERS),
      this.initImage(ImageName.HEDGE),
      this.initImage(ImageName.FIRE_PINK),
      this.initImage(ImageName.FIRE_PURPLE),
      this.initImage(ImageName.FIRE_RED),
      this.initImage(ImageName.FIRE_WHITE),
      this.initImage(ImageName.FIRE_ORANGE),
      this.initImage(ImageName.FLAG_LETTERS),
      this.initImage(ImageName.FLAG),
      this.initImage(ImageName.FLOOR),
      this.initImage(ImageName.GRASS),
      this.initImage(ImageName.IS_LETTERS),
      this.initImage(ImageName.LAVA_LETTERS),
      this.initImage(ImageName.LAVA),
      this.initImage(ImageName.PUSH_LETTERS),
      this.initImage(ImageName.ROCK_LETTERS),
      this.initImage(ImageName.ROCK),
      this.initImage(ImageName.SINK_LETTERS),
      this.initImage(ImageName.STOP_LETTERS),
      this.initImage(ImageName.WALL_LETTERS),
      this.initImage(ImageName.WALL),
      this.initImage(ImageName.WATER_LETTERS),
      this.initImage(ImageName.WATER),
      this.initImage(ImageName.WIN_LETTERS),
      this.initImage(ImageName.YOU_LETTERS),
    ]).then(results => {
      results.forEach((img) => {
        this.images[img.src as ImageName] = img;
      });
    });
  }

  private static initImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(`Unable to init image ${src} in a reasonable time`);
      }, 5000);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      }
    });
  }
}
