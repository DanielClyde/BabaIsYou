import { GameGrid } from './../GameGrid';
import { IDGenerator } from './../Entities/Entity';
import { Coordinates } from './../components/Position';
import { ParticleEffect } from './../components/ParticleEffect';
import { Entity } from "../Entities/Entity";
import { System, SystemUpdateResult } from "./System";
import { ComponentName } from '../components/Component';
import { Particle } from '../Entities/Particle';

export enum ParticleEffectType {
  EXPLOSION,
  FIREWORK,
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

  addParticleEffect(type: ParticleEffectType, center: Coordinates, lifetime: number) {
    console.log('adding explosion at ' + center.x + ' ' + center.y)
    this.areas.push({
      type,
      lifetime,
      alive: 0,
      center,
      id: IDGenerator.getNextId(),
      particlesPerFrame: 25,
    });
  }


  update(elapsedTime: number, entities: Entity[], grid: GameGrid): void {
    const deletedAreas: ParticleAreas[] = [];
    this.areas.forEach((a) => {
      // Add new particle to area each frame;
      for (let i = 0; i < a.particlesPerFrame; i++) {
        grid.insert(a.center.x, a.center.y, Particle.Explosion({...a.center}));
      }
      a.alive += elapsedTime;
      if (a.alive > a.lifetime) {
        deletedAreas.push(a);
      }
    });
    deletedAreas.forEach((d) => {
      this.areas = this.areas.filter((a) => a.id !== d.id);
    });


    entities.forEach((e) => {
      const particle = e.getComponent<ParticleEffect>(ComponentName.ParticleEffect);
      if (particle) {
        particle.alive += elapsedTime;
        if (particle.alive > particle.lifetime) {
          grid.deleteParticleEffectEntity(e);
        }
      }
    });
  }
}
