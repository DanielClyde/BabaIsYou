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
}
