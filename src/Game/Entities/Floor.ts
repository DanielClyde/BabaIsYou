import { Position } from './../components/Position';
import { AnimatedSprite } from './../components/AnimatedSprite';
import { Entity, EntityType } from './Entity';
import { Coordinates } from "../components/Position";
import { AnimationFrame } from '../components/AnimatedSprite';

export class Floor {
  static Create(coords: Coordinates): Entity {
    const f = new Entity(EntityType.FLOOR);
    const img = new Image();
    img.src = '../assets/floor.png';
    const defaultFrame: AnimationFrame = {
      offsetX: 0,
      offsetY: 0,
      width: 24,
      height: 24,
      lengthMS: 400,
      timeLeftMS: 400,
    };
    f.addComponent(new AnimatedSprite(img, 50, 50, [
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
    f.addComponent(new Position({ ...coords }));
    return f;
  }
}
