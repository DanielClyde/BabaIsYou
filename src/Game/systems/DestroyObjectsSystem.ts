import { FlagBitPositions } from './../components/ValueFlags';
import { Position } from './../components/Position';
import { ComponentName } from './../components/Component';
import { ValueFlags } from "../components/ValueFlags";
import { Entity } from "../Entities/Entity";
import { GameGrid } from "../GameGrid";
import { System } from "./System";

export class DestroyObjectsSystem extends System {
  update(elapsedTime: number, entity: Entity, gameGrid: GameGrid, onDestroy: (entities: Entity[]) => void): void {
    const [position, flags1] = [entity.getComponent<Position>(ComponentName.Position), entity.getComponent<ValueFlags>(ComponentName.ValueFlags)];
    if (position && flags1 && flags1.getFlag(FlagBitPositions.SINKABLE)) {
      const otherEntities = gameGrid.getEntitiesAt(position.coords.x, position.coords.y);
      otherEntities.forEach((o) => {
        const flags2 = o.getComponent<ValueFlags>(ComponentName.ValueFlags);
        if (flags2 && flags2.getFlag(FlagBitPositions.SINK)) {
          console.log('other', o);
          onDestroy([entity, o]);
        }
      });
    }
    if (position && flags1 && flags1.getFlag(FlagBitPositions.BURNABLE)) {
      const otherEntities = gameGrid.getEntitiesAt(position.coords.x, position.coords.y);
      otherEntities.forEach((o) => {
        const flags2 = o.getComponent<ValueFlags>(ComponentName.ValueFlags);
        if (flags2 && flags2.getFlag(FlagBitPositions.BURN)) {
          onDestroy([entity]);
        }
      });
    }
  }
}
