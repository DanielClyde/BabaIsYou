import { SmoothMovable } from '../components/SmoothMovable';
import { Position } from './../components/Position';
import { Sprite } from './../components/Sprite';
import { Random } from './../../Utils/Random';
import { ParticleEffect } from './../components/ParticleEffect';
import { Coordinates } from '../components/Position';
import { Entity, EntityType } from './Entity';
export class Particle {
  static Firework(coords: Coordinates): Entity {
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
    const color = Random.nextRange(0, 4);
    img.src = color === 0 ? '../../assets/fire.png' :
      color === 1 ? '../../assets/fire-pink.png' :
        color === 2 ? '../../assets/fire-purple.png' :
          color === 3 ? '../../assets/fire-red.png' :
            '../../assets/fire-white.png';
    p.addComponent(new Sprite(img, size, size));
    return p;
  }

  static BorderSparkle(coords: Coordinates): Entity {
    const p: Entity = new Entity(EntityType.PARTICLE);
    const size = Random.nextGaussian(5, 2);
    const speed = Random.nextGaussian(.0003, .0001);
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
    const newCoords = side === 0 ? { y: coords.y - .1, x: randomXRange } :
      side === 1 ? { x: coords.x + 1.1, y: randomYRange } :
        side === 2 ? { y: coords.y + 1.1, x: randomXRange } :
          ({ x: coords.x - .1, y: randomYRange });
    p.addComponent(new SmoothMovable(speed, direction));
    p.addComponent(new Position({ ...newCoords }));
    const img = new Image();
    img.src = '../../assets/fire-white.png';
    p.addComponent(new Sprite(img, size, size));
    return p;
  }

  static DestroyCloud(coords: Coordinates): Entity {
    const p: Entity = new Entity(EntityType.PARTICLE);
    const size = Random.nextGaussian(6, 2);
    const speed = Random.nextGaussian(.0003, .0001);
    const lifetime = Random.nextGaussian(500, 200);
    const direction = { x: 0, y: -1 };
    p.addComponent(new ParticleEffect({
      alive: 0,
      lifetime,
      startingCoords: { ...coords }
    }));
    const randomXRange = Random.nextRangeDecimal(coords.x + .1, coords.x + .9);
    const randomYRange = Random.nextRangeDecimal(coords.y + .1, coords.y + .9);
    const newCoords = { x: randomXRange, y: randomYRange };
    p.addComponent(new SmoothMovable(speed, direction));
    p.addComponent(new Position({ ...newCoords }));
    const img = new Image();
    img.src = '../../assets/fire-red.png';
    p.addComponent(new Sprite(img, size, size));
    return p;
  }
}
