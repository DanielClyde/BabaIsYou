import { Component, ComponentName } from "./Component";

export class Sprite extends Component {
  constructor(public image: HTMLImageElement) {
    super(ComponentName.Sprite);
  }
}
