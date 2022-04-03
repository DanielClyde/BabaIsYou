import { ParticleEffect } from './components/ParticleEffect';
import { ComponentName } from "./components/Component";
import { Position } from "./components/Position";
import { Entity } from "./Entities/Entity";

export type EntityDictionary = { [entityId: number]: Entity }

export const CELL_SIZE = 50;

export class GameGrid {
  private grid: Array<Array<EntityDictionary>> = [];

  constructor(public size: number) {
    for (let x = 0; x < size; x++) {
      this.grid[x] = [];
      for (let y = 0; y < size; y++) {
        this.grid[x][y] = {};
      }
    }
  }

  getEntitiesToRight(x: number, y: number): Entity[] {
    if (x >= this.size - 1) {
      return [];
    }
    return Object.values(this.grid[x + 1][y]);
  }

  getEntitiesToLeft(x: number, y: number): Entity[] {
    if (x === 0) {
      return [];
    }
    return Object.values(this.grid[x - 1][y]);
  }

  getEntitiesAbove(x: number, y: number): Entity[] {
    if (y === 0) {
      return [];
    }
    return Object.values(this.grid[x][y - 1]);
  }

  getEntitiesBelow(x: number, y: number): Entity[] {
    if (y >= this.size - 1) {
      return [];
    }
    return Object.values(this.grid[x][y + 1]);
  }

  getAllEntities() {
    const entities: Entity[] = [];
    this.grid.forEach(row => {
      row.forEach(dict => {
        Object.values(dict).forEach(e => entities.push(e));
      });
    });
    return entities;
  }

  insert(x: number, y: number, entity: Entity) {
    this.grid[x][y][entity.id] = entity;
  }

  deleteEntity(e: Entity) {
    const { coords } = e.getComponent<Position>(ComponentName.Position);
    delete this.grid[coords.x][coords.y][e.id];
  }

  deleteParticleEffectEntity(e: Entity) {
    const { startingCoords } = e.getComponent<ParticleEffect>(ComponentName.ParticleEffect);
    delete this.grid[startingCoords.x][startingCoords.y][e.id];
  }

}
