import { DefaultAnimationFrame } from './../../Utils/AnimationFrame';
import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { TextType } from './../components/Text';
import { CELL_SIZE } from './../GameGrid';
import { Entity, EntityType } from './Entity';
import { Coordinates, Position } from './../components/Position';
import { AnimatedSprite } from '../components/AnimatedSprite';
import { Text } from '../components/Text';

export class BabaLetters {
  static Create(coords: Coordinates): Entity {
    const b = new Entity(EntityType.BABA_LETTERS);
    const img = new Image();
    img.src = '../../assets/baba-letters.png';
    b.addComponent(new Position({ ...coords }));
    b.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
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
    b.addComponent(new Text(TextType.NOUN));
    const flagComponent = new ValueFlags();
    flagComponent.setFlag(FlagBitPositions.PUSH, true, true);
    b.addComponent(flagComponent);

    return b;
  }
}
