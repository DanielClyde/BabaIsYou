import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { Position } from './../components/Position';
import { Entity } from "../Entities/Entity";
import { GameGrid } from "../GameGrid";
import { System } from "./System";
import { ComponentName } from '../components/Component';

export class WinSystem extends System {
  timeSinceLastFirework = 0;
  hasWon = false;
  numberOfFireworksShown = 0;

  update(elapsedTime: number, entity: Entity, gameGrid: GameGrid): void {
    const [position, flags1] = [entity.getComponent<Position>(ComponentName.Position), entity.getComponent<ValueFlags>(ComponentName.ValueFlags)];
    if (position && flags1 && flags1.getFlag(FlagBitPositions.YOU)) {
      const otherEntities = gameGrid.getEntitiesAt(position.coords.x, position.coords.y);
      otherEntities.forEach((o) => {
        const flags2 = o.getComponent<ValueFlags>(ComponentName.ValueFlags);
        if (flags2 && flags2.getFlag(FlagBitPositions.WIN)) {
          this.hasWon = true;
        }
      })
    }
  }

  public reset() {
    super.reset();
    this.hasWon = false;
    this.timeSinceLastFirework = 0;
    this.numberOfFireworksShown = 0;
  }
}
