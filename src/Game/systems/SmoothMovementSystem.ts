import { SmoothMovable } from '../components/SmoothMovable';
import { Entity } from '../Entities/Entity';
import { Position } from '../components/Position';
import { ComponentName } from '../components/Component';
import { System } from "./System";
import { GameGrid } from '../GameGrid';

export class SmoothMovementSystem extends System {
  update(elapsedTime: number, entities: Entity[], _grid: GameGrid): void {
    entities.forEach((e) => {
      const [position, movable] = [e.getComponent<Position>(ComponentName.Position), e.getComponent<SmoothMovable>(ComponentName.Movable)];
      if (position && movable) {
        // smooth movement doesn't fit in grid, so no need to update in grid
        // when it's time to delete smooth moving particles, use their initial starting point in grid
        position.coords.x += (elapsedTime * movable.speed * movable.direction.x);
        position.coords.y += (elapsedTime * movable.speed * movable.direction.y);
      }
    });
  }

}
