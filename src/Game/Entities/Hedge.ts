import { ValueFlags, FlagBitPositions } from '../components/ValueFlags';
import { AnimationFrame } from '../components/AnimatedSprite';
import { Coordinates } from '../components/Position';
import { Entity, EntityType } from './Entity';
import { AnimatedSprite } from '../components/AnimatedSprite';
import { Position } from '../components/Position';

export class Hedge {
  public static Create(coords: Coordinates): Entity {
    const bush = new Entity(EntityType.HEDGE);
    const img = new Image();
    img.src = '../assets/bush.png';
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    }
    bush.addComponent(new AnimatedSprite(img, 50, 50, [
      { ...defaultFrame },
      {
        ...defaultFrame,
        offsetY: 24,
      },
      {
        ...defaultFrame,
        offsetY: 48,
      },
    ]));
    bush.addComponent(new Position({...coords}));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.STOP, true, true);
    bush.addComponent(flagsComponent);
    return bush;
  }
}
