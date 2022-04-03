import { RenderDriver } from './../Drivers/RenderDriver';
import { Position } from './../components/Position';
import { AnimatedSprite } from './../components/AnimatedSprite';
import { Entity } from "../Entities/Entity";
import { System, SystemUpdateResult } from "./System";
import { ComponentName } from '../components/Component';
import { CELL_SIZE, GameGrid } from '../GameGrid';

export class RenderAnimatedSpriteSystem extends System {
  update(elapsedTime: number, entities: Entity[], grid: GameGrid, renderDriver: RenderDriver): void {
    entities.forEach((e) => {
      const [animatedSprite, position] = [
        e.getComponent<AnimatedSprite>(ComponentName.AnimatedSprite),
        e.getComponent<Position>(ComponentName.Position),
      ];
      if (animatedSprite && position) {
        animatedSprite.update(elapsedTime);
        renderDriver.renderImage(
          animatedSprite.image,
          { x: position.coords.x * CELL_SIZE, y: position.coords.y * CELL_SIZE },
          animatedSprite.width,
          animatedSprite.height,
          0,
          {
            ...animatedSprite.frames[animatedSprite.currentFrameIndex],
          },
        );
      }
    });
  }
}
