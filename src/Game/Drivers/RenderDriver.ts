import { ImageClip } from '../components/Sprite';
import { Coordinates } from './../components/Position';

export class RenderDriver {
  public get canvasWidth() { return this.canvas.width; }
  public get canvasHeight() { return this.canvas.height; };
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  renderImage(img: HTMLImageElement, center: Coordinates, width: number, height: number, rotation: number, clip?: ImageClip) {
    this.context.save();
    this.context.translate(center.x, center.y);
    this.context.rotate(rotation);
    this.context.translate(-center.x, -center.y);
    if (clip) {
      this.context.drawImage(
        img,
        clip.offsetX,
        clip.offsetY,
        clip.width,
        clip.height,
        center.x,
        center.y,
        width,
        height,
      );
    } else {
      this.context.drawImage(
        img,
        center.x,
        center.y,
        width,
        height,
      );
    }
    this.context.restore();
  }
}
