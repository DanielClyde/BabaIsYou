import { SmoothMovable } from '../components/SmoothMovable';
import { Position } from './../components/Position';
import { Sprite } from './../components/Sprite';
import { Random } from './../../Utils/Random';
import { ParticleEffect } from './../components/ParticleEffect';
import { Coordinates } from '../components/Position';
import { Entity, EntityType } from './Entity';
export class Particle {
  static Explosion(coords: Coordinates): Entity {
    const p: Entity = new Entity(EntityType.PARTICLE);
    const size = Random.nextGaussian(9, 2);
    const speed = Random.nextGaussian(.005, .002);
    const lifetime = Random.nextGaussian(500, 200);
    const direction = Random.nextCircleVector();
    p.addComponent(new ParticleEffect({
      alive: 0,
      lifetime,
      startingCoords: { ...coords }
    }));
    p.addComponent(new SmoothMovable(speed, direction));
    p.addComponent(new Position({ ...coords }));

    const img = new Image();
    img.src = '../../assets/fire.png';
    p.addComponent(new Sprite(img, size, size));
    return p;
  }

  static BorderSparkle(coords: Coordinates): Entity {
    const p: Entity = new Entity(EntityType.PARTICLE);
    const size = Random.nextGaussian(8, 2);
    const speed = Random.nextGaussian(.0005, .0001);
    const lifetime = Random.nextGaussian(400, 200);
    const side = Math.floor(Random.nextRange(0, 4));
    const direction = side === 0 ? { x: 0, y: -1 } :
      side === 1 ? { x: 1, y: 0 } :
        side === 2 ? { x: 0, y: 1 } :
          ({ x: -1, y: 0 });

    p.addComponent(new ParticleEffect({
      alive: 0,
      lifetime,
      startingCoords: { ...coords }
    }));
    const randomXRange = Random.nextRangeDecimal(coords.x, coords.x + 1);
    const randomYRange = Random.nextRangeDecimal(coords.y, coords.y + 1);
    const newCoords = side === 0 ? { y: coords.y, x: randomXRange } :
      side === 1 ? { x: coords.x + 1, y: randomYRange } :
        side === 2 ? { y: coords.y + 1, x: randomXRange } :
          ({ x: coords.x, y: randomYRange });
    p.addComponent(new SmoothMovable(speed, direction));
    p.addComponent(new Position({ ...newCoords }));
    const img = new Image();
    img.src = '../../assets/fire-pink.png';
    p.addComponent(new Sprite(img, size, size));
    return p;
  }
}
