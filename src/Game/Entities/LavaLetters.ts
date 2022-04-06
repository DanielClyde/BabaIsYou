import { FlagBitPositions } from './../components/ValueFlags';
import { Entity, EntityType } from './Entity';
import { Coordinates } from './../components/Position';
import { AnimatedSprite } from '../components/AnimatedSprite';
import { Position } from '../components/Position';
import { DefaultAnimationFrame } from '../../Utils/AnimationFrame';
import { CELL_SIZE } from '../GameGrid';
import { ValueFlags } from '../components/ValueFlags';
import { Text, TextType } from '../components/Text';

export class LavaLetters {
  public static Create(coords: Coordinates): Entity {
    const e = new Entity(EntityType.LAVA_LETTERS);
    const img = new Image();
    img.src = '../../assets/lava-letters.png';
    e.addComponent(new Position({ ...coords }));
    e.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
      { ...DefaultAnimationFrame },
      {
        ...DefaultAnimationFrame,
        offsetY: 24,
      },
      {
        ...DefaultAnimationFrame,
        offsetY: 48,
      },
    ]));
    e.addComponent(new Text(TextType.NOUN));
    const flagComponent = new ValueFlags();
    flagComponent.setFlag(FlagBitPositions.PUSH, true, true);
    e.addComponent(flagComponent);
    return e;
  }
}
