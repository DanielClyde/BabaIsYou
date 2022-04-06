import { GameGrid } from './../GameGrid';
import { IDGenerator } from './../Entities/Entity';
import { Coordinates } from './../components/Position';
import { ParticleEffect } from './../components/ParticleEffect';
import { Entity } from "../Entities/Entity";
import { System } from "./System";
import { ComponentName } from '../components/Component';
import { Particle } from '../Entities/Particle';

export enum ParticleEffectType {
  FIREWORK,
  BORDER_SPARKLE,
  DESTROY,
}

export interface ParticleAreas {
  center: Coordinates;
  alive: number;
  lifetime: number;
  type: ParticleEffectType;
  id: number;
  particlesPerFrame: number;
}

export class ParticleLifetimeSystem extends System {
  private areas: ParticleAreas[] = [];

  public reset(): void {
    this.areas = [];
  }

  addParticleEffect(type: ParticleEffectType, center: Coordinates, lifetime: number) {
    this.areas.push({
      type,
      lifetime,
      alive: 0,
      center,
      id: IDGenerator.getNextId(),
      particlesPerFrame: type === ParticleEffectType.FIREWORK ? 25 : type === ParticleEffectType.BORDER_SPARKLE ? 5 : 2,
    });
  }

  updateAreas(elapsedTime: number, grid: GameGrid): void {
    const deletedAreas: ParticleAreas[] = [];
    this.areas.forEach((a) => {
      // Add new particle to area each frame;
      for (let i = 0; i < a.particlesPerFrame; i++) {
        if (a.type === ParticleEffectType.FIREWORK) {
          grid.insert(a.center.x, a.center.y, Particle.Firework({ ...a.center }));
        } else if (a.type === ParticleEffectType.BORDER_SPARKLE) {
          grid.insert(a.center.x, a.center.y, Particle.BorderSparkle({ ...a.center }));
        } else if (a.type === ParticleEffectType.DESTROY) {
          grid.insert(a.center.x, a.center.y, Particle.DestroyCloud({ ...a.center }));
        }
      }
      a.alive += elapsedTime;
      if (a.alive > a.lifetime) {
        deletedAreas.push(a);
      }
    });
    deletedAreas.forEach((d) => {
      this.areas = this.areas.filter((a) => a.id !== d.id);
    });

  }


  update(elapsedTime: number, e: Entity, grid: GameGrid): void {
    const particle = e.getComponent<ParticleEffect>(ComponentName.ParticleEffect);
    if (particle) {
      particle.alive += elapsedTime;
      if (particle.alive > particle.lifetime) {
        grid.deleteParticleEffectEntity(e);
      }
    }
  }
}
