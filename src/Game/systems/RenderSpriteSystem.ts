import { RenderDriver } from './../Drivers/RenderDriver';
import { ComponentName } from "../components/Component";
import { Position } from "../components/Position";
import { Sprite } from "../components/Sprite";
import { System, SystemUpdateResult } from "./System";
import { Entity } from '../Entities/Entity';

export class RenderSpriteSystem extends System {
  update(elapsedTime: number, entities: Entity[], renderDriver: RenderDriver): SystemUpdateResult {
    entities.forEach((e) => {
      const [sprite, position] = [e.getComponent<Sprite>(ComponentName.Sprite), e.getComponent<Position>(ComponentName.Position)];
      if (sprite && position) {
        renderDriver.renderImage(
          sprite.image,
          { ...position.coords },
          sprite.width,
          sprite.height,
          0,
        );
      }
    });
    return { updatedEntities: [], deletedEntities: [] };
  }
}
