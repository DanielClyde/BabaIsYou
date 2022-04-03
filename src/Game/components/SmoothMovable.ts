import { Coordinates } from './Position';
import { Component, ComponentName } from "./Component";

export class SmoothMovable extends Component {
  constructor(
    public speed: number,
    public direction: Coordinates,
  ) {
    super(ComponentName.Movable);
  }
}
