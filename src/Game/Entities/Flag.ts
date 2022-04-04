import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { Noun, NounType } from './../components/Noun';
import { AnimationFrame } from './../components/AnimatedSprite';
import { Entity, EntityType } from './Entity';
import { Coordinates } from './../components/Position';
import { AnimatedSprite } from '../components/AnimatedSprite';
import { Position } from '../components/Position';

export class Flag {
  static Create(coords: Coordinates) {
    const flag = new Entity(EntityType.FLAG);
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    };
    const img = new Image();
    img.src = '../assets/flag.png';
    flag.addComponent(new AnimatedSprite(img, 50, 50, [
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
    flag.addComponent(new Position({... coords}));
    flag.addComponent(new Noun(NounType.FLAG));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.WIN, true);
    flag.addComponent(flagsComponent);
    return flag;
  }
}
