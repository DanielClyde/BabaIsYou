import { CELL_SIZE, GameGrid } from './../GameGrid';
import { RenderDriver } from './../Drivers/RenderDriver';
import { ComponentName } from "../components/Component";
import { Position } from "../components/Position";
import { Sprite } from "../components/Sprite";
import { System } from "./System";
import { Entity } from '../Entities/Entity';

export class RenderSpriteSystem extends System {
  update(_elapsedTime: number, e: Entity, grid: GameGrid, renderDriver: RenderDriver): void {
    const [sprite, position] = [e.getComponent<Sprite>(ComponentName.Sprite), e.getComponent<Position>(ComponentName.Position)];
    if (sprite && position) {
      renderDriver.renderImage(
        sprite.image,
        { x: position.coords.x * CELL_SIZE, y: position.coords.y * CELL_SIZE },
        sprite.width,
        sprite.height,
        0,
      );
    }
  }
}
