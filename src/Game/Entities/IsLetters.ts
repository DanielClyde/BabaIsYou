import { TextType, Text } from './../components/Text';
import { FlagBitPositions } from './../components/ValueFlags';
import { CELL_SIZE } from './../GameGrid';
import { DefaultAnimationFrame } from './../../Utils/AnimationFrame';
import { AnimatedSprite } from './../components/AnimatedSprite';
import { Entity, EntityType } from './Entity';
import { Coordinates, Position } from './../components/Position';
import { ValueFlags } from '../components/ValueFlags';

export class IsLetters {
  public static Create(coords: Coordinates): Entity {
    const i = new Entity(EntityType.IS_LETTERS);
    const img = new Image();
    img.src = '../../assets/is-letters.png';
    i.addComponent(new Position({...coords}));
    i.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
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
    i.addComponent(new Text(TextType.IS));
    const flagComponent = new ValueFlags();
    flagComponent.setFlag(FlagBitPositions.PUSH, true, true);
    i.addComponent(flagComponent);
    return i;
  }
}
