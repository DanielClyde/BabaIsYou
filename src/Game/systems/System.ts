import { Entity } from "../Entities/Entity";

export interface SystemUpdateResult {
  updatedEntities: Entity[];
  deletedEntities: Entity[];
}

export abstract class System {
  abstract update(elapsedTime: number, entities: Entity[], ...args: any[]): SystemUpdateResult;
}
