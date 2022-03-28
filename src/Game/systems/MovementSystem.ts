import { Movable } from './../components/Movable';
import { Entity } from './../Entities/Entity';
import { Position } from '../components/Position';
import { ComponentName } from './../components/Component';
import { System, SystemUpdateResult } from "./System";

export class MovementSystem extends System {
  update(elapsedTime: number, entities: Entity[]): SystemUpdateResult {
    entities.forEach((e) => {
      const [position, movable] = [e.getComponent<Position>(ComponentName.Position), e.getComponent<Movable>(ComponentName.Movable)];
      if (position && movable) {
        position.coords.x += (elapsedTime * movable.speed * movable.direction.x);
        position.coords.y += (elapsedTime * movable.speed * movable.direction.y);
        e.removeComponent(ComponentName.Position);
        e.addComponent(position);
      }
    });
    return { updatedEntities: [], deletedEntities: [] };
  }

}
