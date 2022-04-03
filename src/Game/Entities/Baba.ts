import { ValueFlags, FlagBitPositions } from '../components/ValueFlags';
import { InputControlled } from '../components/InputControlled';
import { Coordinates } from '../components/Position';
import { Position } from '../components/Position';
import { AnimatedSprite, AnimationFrame } from '../components/AnimatedSprite';
import { Entity, EntityType } from './Entity';
export class Baba {
  public static Create(coords: Coordinates): Entity {
    const baba = new Entity(EntityType.BABA);
    const img = new Image();
    img.src = '../assets/baba.png';
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    };
    baba.addComponent(new AnimatedSprite(img, 50, 50, [
      {
        ...defaultFrame,
      },
      {
        ...defaultFrame,
        offsetY: 24,
      },
      {
        ...defaultFrame,
        offsetY: 48,
      },
    ]));
    baba.addComponent(new Position({ ...coords }));
    baba.addComponent(new InputControlled({
      MOVE_DOWN: 's',
      MOVE_LEFT: 'a',
      MOVE_RIGHT: 'd',
      MOVE_UP: 'w',
      UNDO: 'z',
      RESET: 'r',
    }));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.YOU, true);
    baba.addComponent(flagsComponent);
    return baba;
  }
}
