import { ImageClip } from './Sprite';
import { Component, ComponentName } from "./Component";

export interface AnimationFrame extends ImageClip {
  lengthMS: number,
  timeLeftMS: number,
}


export class AnimatedSprite extends Component {
  constructor(
    public image: HTMLImageElement,
    public width: number,
    public height: number,
    public frames: AnimationFrame[],
    public currentFrameIndex = 0,
  ) {
    super(ComponentName.AnimatedSprite);
  }

  update(elapsedTime: number) {
    this.frames[this.currentFrameIndex].timeLeftMS -= elapsedTime;
    if (this.frames[this.currentFrameIndex].timeLeftMS <= 0) {
      const prevFrame = this.currentFrameIndex;
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.frames[this.currentFrameIndex].timeLeftMS = this.frames[this.currentFrameIndex].lengthMS + this.frames[prevFrame].timeLeftMS;
    }
  }
}
