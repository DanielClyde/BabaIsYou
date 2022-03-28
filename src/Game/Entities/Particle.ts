import { Movable } from './../components/Movable';
import { Position } from './../components/Position';
import { Sprite } from './../components/Sprite';
import { Random } from './../../Utils/Random';
import { ParticleEffect } from './../components/ParticleEffect';
import { Coordinates } from '../components/Position';
import { Entity } from './Entity';
export class Particle {
  static Explosion(coords: Coordinates): Entity {
    const p: Entity = new Entity();
    const size = Random.nextGaussian(10, 4);
    const speed = Random.nextGaussian(50, 25);
    const lifetime = Random.nextGaussian(4, 1);
    p.addComponent(new ParticleEffect({
      center: { ...coords },
      size: { x: size, y: size },
      alive: 0,
      rotation: 0,
      lifetime,
    }));
    p.addComponent(new Movable(speed, Random.nextCircleVector()))
    p.addComponent(new Position({...coords}));

    const img = new Image();
    img.src = '../../assets/fire.png';
    img.onload = () => console.log('LAOD');
    p.addComponent(new Sprite(img, size, size));

    console.log('EXPLOSION PARTICLE', p);
    return p;
  }
}
