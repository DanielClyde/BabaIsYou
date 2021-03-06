import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { KeyboardInputDriver } from './../Drivers/KeyboardInputDriver';
import { Entity } from './../Entities/Entity';
import { InputControlled, Controls } from './../components/InputControlled';
import { ComponentName } from './../components/Component';
import { System } from "./System";
import { Position } from '../components/Position';
import { GameGrid } from '../GameGrid';

type Direction = 'up' | 'down' | 'left' | 'right';
export class InputSystem extends System {
  constructor(private keyboardInput: KeyboardInputDriver) {
    super();
  }

  checkUndoOrReset(onReset: () => void, onUndo: () => void, pressedKeys: {[key: string]: boolean}, controls: Controls) {
    if (this.keyboardInput.isKeyPressed(controls.RESET)) {
      pressedKeys[controls.RESET] = true;
      onReset();
    } else if (this.keyboardInput.isKeyPressed(controls.UNDO)) {
      pressedKeys[controls.UNDO] = true;
      onUndo();
    }
  }

  update(
    _elapsedTime: number,
    e: Entity,
    grid: GameGrid,
    keysToDisable: { [key: string]: boolean },
    controls: Controls,
  ): void {
    const [input, position] = [e.getComponent<InputControlled>(ComponentName.InputControlled), e.getComponent<Position>(ComponentName.Position)];
    if (input && position) {
      if (this.keyboardInput.isKeyPressed(controls.MOVE_DOWN)) {
        this.moveEntityDirection('down', e, position, grid);
        keysToDisable[controls.MOVE_DOWN] = true;
      } else if (this.keyboardInput.isKeyPressed(controls.MOVE_LEFT)) {
        this.moveEntityDirection('left', e, position, grid);
        keysToDisable[controls.MOVE_LEFT] = true;
      } else if (this.keyboardInput.isKeyPressed(controls.MOVE_RIGHT)) {
        this.moveEntityDirection('right', e, position, grid);
        keysToDisable[controls.MOVE_RIGHT] = true;
      } else if (this.keyboardInput.isKeyPressed(controls.MOVE_UP)) {
        this.moveEntityDirection('up', e, position, grid);
        keysToDisable[controls.MOVE_UP] = true;
      }
    }
  }

  private moveEntityDirection(direction: Direction, e: Entity, position: Position, grid: GameGrid) {
    const { canMove, pushedEntities } = this.canMoveInDirection(direction, position.coords.x, position.coords.y, grid, []);
    if (canMove) {
      grid.deleteEntity(e);
      this.movePositionInDirection(direction, position);
      grid.insert(position.coords.x, position.coords.y, e);
      pushedEntities.forEach((p) => {
        const pushedPosition = p.getComponent<Position>(ComponentName.Position);
        grid.deleteEntity(p);
        this.movePositionInDirection(direction, pushedPosition);
        grid.insert(pushedPosition.coords.x, pushedPosition.coords.y, p);
      });
    }
  }

  private movePositionInDirection(direction: Direction, position: Position) {
    if (direction === 'up') {
      position.coords.y -= 1;
    } else if (direction === 'down') {
      position.coords.y += 1;
    } else if (direction === 'left') {
      position.coords.x -= 1;
    } else {
      position.coords.x += 1;
    }
  }

  private canMoveInDirection(direction: Direction, x: number, y: number, grid: GameGrid, pushedEntities: Entity[] = []): { canMove: boolean, pushedEntities: Entity[] } {
    const neighboringEntities = direction === 'up' ? grid.getEntitiesAbove(x, y) :
      direction === 'down' ? grid.getEntitiesBelow(x, y) :
        direction === 'left' ? grid.getEntitiesToLeft(x, y) :
          grid.getEntitiesToRight(x, y);
    let hasStop = false;
    let hasPush = false;
    for (let i = 0; i < neighboringEntities.length; i++) {
      const flags = neighboringEntities[i].getComponent<ValueFlags>(ComponentName.ValueFlags);
      if (!flags) { continue; }
      if (flags.getFlag(FlagBitPositions.STOP)) {
        hasStop = true;
      } else if (flags.getFlag(FlagBitPositions.PUSH)) {
        hasPush = true;
        pushedEntities.push(neighboringEntities[i]);
      }
    }
    if (hasStop) {
      return { canMove: false, pushedEntities };
    } else if (hasPush) {
      x = direction === 'left' ? x - 1 : direction === 'right' ? x + 1 : x;
      y = direction === 'down' ? y + 1 : direction === 'up' ? y - 1 : y;
      return this.canMoveInDirection(direction, x, y, grid, pushedEntities);
    } else {
      return { canMove: true, pushedEntities };
    }
  }
}
