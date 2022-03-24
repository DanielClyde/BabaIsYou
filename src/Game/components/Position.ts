import { Component } from "./Component";

export interface Coordinates {
  x: number,
  y: number,
};

export class Position extends Component {
  coords: Coordinates;
  constructor(coords: Coordinates) {
    super('Position');
    this.coords = {...coords};
  }
}
