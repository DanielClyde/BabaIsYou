import { LevelParser } from './../Utils/LevelParser';
import { RenderAnimatedSpriteSystem } from './systems/RenderAnimatedSpriteSystem';
import { SmoothMovementSystem } from './systems/SmoothMovementSystem';
import { InputSystem } from './systems/InputSystem';
import { RenderDriver } from './Drivers/RenderDriver';
import { RenderSpriteSystem } from './systems/RenderSpriteSystem';
import { ParticleEffectType, ParticleLifetimeSystem } from './systems/ParticleLifetimeSystem';
import { Random } from '../Utils/Random';
import { GameGrid } from './GameGrid';

export class GameModel {
  private previousTimestamp = performance.now();
  private loopPaused = true;
  private renderDriver = new RenderDriver();
  private levelParser = new LevelParser();
  private grid?: GameGrid;
  private initialized = false;

  // SYSTEMS
  private inputSystem = new InputSystem();
  private movementSystem = new SmoothMovementSystem();
  private renderSpriteSystem = new RenderSpriteSystem();
  private renderAnimatedSpriteSystem = new RenderAnimatedSpriteSystem();
  private particleLifetimeSystem = new ParticleLifetimeSystem();

  constructor() { }

  public init(levelName: string = '../../assets/levels/levels-all.bbiy'): Promise<void> {
    return this.levelParser.parseFromFile(levelName, 20, 3).then((grid: GameGrid) => {
      this.grid = grid;
      this.initialized = true;
      console.log('DONE INITIALIZING GRID', this.grid);
    });
  }

  public pauseLoop() {
    this.loopPaused = true;
  }

  public startLoop() {
    if (!this.initialized) {
      throw new Error('Must first call GameModel.initialize() before starting the game loop!');
    }
    this.loopPaused = false;
    this.previousTimestamp = performance.now();
    this.loop(this.previousTimestamp);
    window.addEventListener('keydown', (e) => {
      if (e.key === 't') {
        this.particleLifetimeSystem.addParticleEffect(
          ParticleEffectType.EXPLOSION,
          {
            x: Random.nextRange(0, 19),
            y: Random.nextRange(0, 19),
          },
          50,
        );
      } else if (e.key === 'b') {
        this.particleLifetimeSystem.addParticleEffect(
          ParticleEffectType.BORDER_SPARKLE,
          {
            x: 5,
            y: 8,
          },
          1500,
        );
      }
    });
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
    this.renderDriver.clear();
    const entities = this.grid?.getAllEntities() || [];
    this.inputSystem.update(elapsedTime, entities, this.grid!);
    this.movementSystem.update(elapsedTime, entities, this.grid!);
    this.particleLifetimeSystem.update(elapsedTime, entities, this.grid!);
    this.renderSpriteSystem.update(elapsedTime, entities, this.grid!, this.renderDriver);
    this.renderAnimatedSpriteSystem.update(elapsedTime, entities, this.grid!, this.renderDriver);
  }
}
