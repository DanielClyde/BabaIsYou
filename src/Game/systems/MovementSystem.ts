import { System, SystemUpdateResult } from "./System";

export class MovementSystem extends System {
  update(elapsedTime: number, ...args: any[]): SystemUpdateResult {
    return { updatedEntities: [], deletedEntities: [] };
  }

}
