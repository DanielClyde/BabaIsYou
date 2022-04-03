import { GameGrid } from './../GameGrid';
import { Entity } from "../Entities/Entity";

export interface SystemUpdateResult {
  updatedEntities?: Entity[];
  deletedEntities?: Entity[];
  addedEntities?: Entity[];
}

export abstract class System {
  abstract update(elapsedTime: number, entities: Entity[], gameGrid: GameGrid, ...args: any[]): void;
}
