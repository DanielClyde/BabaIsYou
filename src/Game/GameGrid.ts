import { ParticleEffect } from './components/ParticleEffect';
import { ComponentName } from "./components/Component";
import { Position } from "./components/Position";
import { Entity } from "./Entities/Entity";
// import cryptr from 'cryptr';

export type EntityDictionary = { [entityId: number]: Entity }

export const CELL_SIZE = 50;

export class GameGrid {
  private grid: Array<Array<EntityDictionary>> = [];
  private stack: Array<Array<Array<EntityDictionary>>> = [];

  constructor(public size: number) {
    for (let x = 0; x < size; x++) {
      this.grid[x] = [];
      for (let y = 0; y < size; y++) {
        this.grid[x][y] = {};
      }
    }
  }

  private cloneGrid(gridToClone: Array<Array<EntityDictionary>>): Array<Array<EntityDictionary>> {
    const g: Array<Array<EntityDictionary>> = [];
    for (let i = 0; i < gridToClone.length; i++) {
      g[i] = [];
      for (let j = 0; j < gridToClone.length; j++) {
        g[i][j] = { };
        for (const key of Object.keys(gridToClone[i][j])) {
          g[i][j][+key] = gridToClone[i][j][+key].clone();
        }
      }
    }
    return g;
  }

  getEntitiesAt(x: number, y: number): Entity[] {
    if (!this.grid[x] || !this.grid[x][y]) {
      return [];
    }
    return Object.values(this.grid[x][y]);
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
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        const dict = this.grid[i][j];
        for (const e of Object.values(dict)) {
          entities.push(e);
        }
      }
    }
    return entities;
  }

  saveToStack() {
    this.stack.push(this.cloneGrid(this.grid));
  }

  undo() {
    if (this.stack.length >= 2) {
      this.stack.pop();
      const last = this.cloneGrid(this.stack[this.stack.length - 1]);
      this.grid = last;
    }
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
