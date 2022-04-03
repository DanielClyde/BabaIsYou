import { Coordinates } from './Position';
import { Component, ComponentName } from "./Component";

export type ParticleSpec = Omit<ParticleEffect, 'name'>;

export class ParticleEffect extends Component {
  lifetime: number;
  alive: number;
  startingCoords: Coordinates;

  constructor(spec: ParticleSpec) {
    super(ComponentName.ParticleEffect);
    this.lifetime = spec.lifetime;
    this.alive = spec.alive;
    this.startingCoords = spec.startingCoords;
  }
}
