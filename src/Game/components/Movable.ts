import { Coordinates } from './Position';
import { Component, ComponentName } from "./Component";

export class Movable extends Component {
  constructor(public speed: number, public direction: Coordinates) {
    super(ComponentName.Movable);
  }
}
