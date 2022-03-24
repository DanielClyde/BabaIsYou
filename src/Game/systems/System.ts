import { Entity } from "../Entities/Entity";

export interface SystemUpdateResult {
  updatedEntities: Entity[];
  deletedEntities: Entity[];
}

export abstract class System {
  protected entities: Entity[] = [];
  abstract update(elapsedTime: number, ...args: any[]): SystemUpdateResult;
}
