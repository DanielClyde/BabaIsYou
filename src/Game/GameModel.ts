import { MovementSystem } from './systems/MovementSystem';
import { InputSystem } from './systems/InputSystem';
import { RenderDriver } from './Drivers/RenderDriver';
import { Particle } from './Entities/Particle';
import { Entity } from './Entities/Entity';
import { RenderSpriteSystem } from './systems/RenderSpriteSystem';

export class GameModel {
  private previousTimestamp = performance.now();
  private loopPaused = true;
  private renderDriver = new RenderDriver();

  // SYSTEMS
  private inputSystem = new InputSystem();
  private movementSystem = new MovementSystem();
  private renderSpriteSystem = new RenderSpriteSystem();

  private entities: Entity[] = [
    Particle.Explosion({x: 0, y: 0}),
  ]

  public pauseLoop() {
    this.loopPaused = true;
  }

  public startLoop() {
    this.loopPaused = false;
    this.previousTimestamp = performance.now();
    this.loop(this.previousTimestamp);
  }

  private loop(timestamp: number) {
    const elapsedTime = timestamp - this.previousTimestamp;
    this.update(elapsedTime);
    this.previousTimestamp = timestamp;
    if (!this.loopPaused) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  private update(elapsedTime: number) {
    this.inputSystem.update(elapsedTime, this.entities);
    this.movementSystem.update(elapsedTime, this.entities);
    this.renderSpriteSystem.update(elapsedTime, this.entities, this.renderDriver);
  }
}
