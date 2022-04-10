import { Noun, NounType } from './../components/Noun';
import { CELL_SIZE } from './../GameGrid';
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
    baba.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
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
    baba.addComponent(new InputControlled());
    baba.addComponent(new Noun(NounType.BABA));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.YOU, true);
    flagsComponent.setFlag(FlagBitPositions.SINKABLE, true, true);
    flagsComponent.setFlag(FlagBitPositions.BURNABLE, true, true);
    baba.addComponent(flagsComponent);
    return baba;
  }
}
