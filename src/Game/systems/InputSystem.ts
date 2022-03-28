import { Entity } from './../Entities/Entity';
import { InputControlled } from './../components/InputControlled';
import { ComponentName } from './../components/Component';
import { System, SystemUpdateResult } from "./System";

export class InputSystem extends System {
  update(elapsedTime: number, entities: Entity[], ...args: any[]): SystemUpdateResult {
    entities.forEach((e) => {
      const input = e.getComponent<InputControlled>(ComponentName.InputControlled);
      if (!!input) {
        console.log(elapsedTime, input);
      }
    });

    return { updatedEntities: [], deletedEntities: [] };
  }
}
