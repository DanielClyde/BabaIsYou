import { Component, ComponentName } from "./Component";

export interface AnimationFrame {
  spriteSheet: HTMLImageElement,
  offsetX: number,
  offsetY: number,
  lengthMS: number,
  timeLeftMS: number,
  width: number,
  height: number,
}


export class AnimatedSprite extends Component {
  constructor(public frames: AnimationFrame[]) {
    super(ComponentName.ValueFlags);
  }
}
