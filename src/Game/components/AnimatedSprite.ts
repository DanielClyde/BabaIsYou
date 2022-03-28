import { ImageClip } from './Sprite';
import { Component, ComponentName } from "./Component";

export interface AnimationFrame extends ImageClip {
  lengthMS: number,
  timeLeftMS: number,
}


export class AnimatedSprite extends Component {
  constructor(public image: HTMLImageElement, public width: number, public height: number, public frames: AnimationFrame[]) {
    super(ComponentName.ValueFlags);
  }
}
