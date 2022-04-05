import { GameGrid } from './../GameGrid';
import { Entity } from "../Entities/Entity";

export interface SystemUpdateResult {
  updatedEntities?: Entity[];
  deletedEntities?: Entity[];
  addedEntities?: Entity[];
}

export abstract class System {
  abstract update(elapsedTime: number, entity: Entity, gameGrid: GameGrid, ...args: any[]): void;
  public reset() { }
}
