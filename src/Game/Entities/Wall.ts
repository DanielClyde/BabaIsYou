import { CELL_SIZE } from './../GameGrid';
import { AnimatedSprite } from './../components/AnimatedSprite';
import { ValueFlags, FlagBitPositions } from './../components/ValueFlags';
import { Noun, NounType } from './../components/Noun';
import { Coordinates, Position } from "../components/Position";
import { Entity, EntityType } from "./Entity";
import { AnimationFrame } from '../components/AnimatedSprite';

export class Wall {
  static Create(coords: Coordinates): Entity {
    const wall: Entity = new Entity(EntityType.WALL);
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    };
    const img = new Image();
    img.src = '../assets/wall.png';
    wall.addComponent(new AnimatedSprite(img, CELL_SIZE, CELL_SIZE, [
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
    wall.addComponent(new Position({ ...coords }));
    wall.addComponent(new Noun(NounType.WALL));
    const flagsComponent = new ValueFlags();
    flagsComponent.setFlag(FlagBitPositions.STOP, true);
    wall.addComponent(flagsComponent);
    return wall;
  }
}
