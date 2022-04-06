import { CELL_SIZE } from './../GameGrid';
import { FlagBitPositions } from './../components/ValueFlags';
import { AnimationFrame } from "../components/AnimatedSprite";
import { Noun, NounType } from "../components/Noun";
import { Coordinates, Position } from "../components/Position";
import { Entity, EntityType } from "./Entity";
import { AnimatedSprite } from "../components/AnimatedSprite";
import { ValueFlags } from '../components/ValueFlags';

export class Rock {
  static Create(coords: Coordinates): Entity {
    const rock: Entity = new Entity(EntityType.ROCK);
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    };
    const img = new Image();
    img.src = '../assets/rock.png';
    rock.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
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
    rock.addComponent(new Position({ ...coords }));
    rock.addComponent(new Noun(NounType.ROCK));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.PUSH, true);
    flagsComponent.setFlag(FlagBitPositions.SINKABLE, true, true);
    rock.addComponent(flagsComponent);
    return rock;
  }
}
