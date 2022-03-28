import { Component, ComponentName } from "./Component";

export interface ImageClip {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export class Sprite extends Component {
  constructor(public image: HTMLImageElement, public width: number, public height: number, public clip?: ImageClip) {
    super(ComponentName.Sprite);
  }
}
