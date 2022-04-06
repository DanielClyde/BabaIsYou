import { Noun, NounType } from './../components/Noun';
import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { CELL_SIZE } from './../GameGrid';
import { AnimatedSprite } from './../components/AnimatedSprite';
import { Entity, EntityType } from './Entity';
import { Coordinates } from './../components/Position';
import { DefaultAnimationFrame } from '../../Utils/AnimationFrame';
import { Position } from '../components/Position';

export class Water {
  public static Create(coords: Coordinates): Entity {
    const e = new Entity(EntityType.WATER);
    const img = new Image();
    img.src = '../../assets/water.png';
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
    e.addComponent(new Position({ ...coords }));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.SINK, true);
    e.addComponent(flagsComponent);
    e.addComponent(new Noun(NounType.WATER));
    return e;
  }
}
