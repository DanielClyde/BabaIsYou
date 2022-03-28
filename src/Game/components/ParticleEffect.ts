import { Component, ComponentName } from "./Component";
import { Coordinates } from "./Position";

export type ParticleSpec = Omit<ParticleEffect, 'name'>;

export class ParticleEffect extends Component {
  center: Coordinates;
  size: Coordinates;
  rotation: number;
  lifetime: number;
  alive: number;

  constructor(spec: ParticleSpec) {
    super(ComponentName.ParticleEffect);
    this.center = spec.center;
    this.size = spec.size;
    this.rotation = spec.rotation;
    this.lifetime = spec.lifetime;
    this.alive = spec.alive;
  }
}
