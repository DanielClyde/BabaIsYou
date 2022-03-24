import { System, SystemUpdateResult } from "./System";

export class MovementSystem extends System {
  update(elapsedTime: number): SystemUpdateResult {
    this.entities.forEach((e) => {
      if (e.components.Position) {

      }
    });
    return { updatedEntities: [], deletedEntities: [] };
  }

}
