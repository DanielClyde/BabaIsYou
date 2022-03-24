import { Component, ComponentName } from "./Component";

export interface Coordinates {
  x: number,
  y: number,
};

export class Position extends Component {
  constructor(public coords: Coordinates) {
    super(ComponentName.Position);
  }
}
