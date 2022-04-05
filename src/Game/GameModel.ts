import { WinSystem } from './systems/WinSystem';
import { RuleSystem } from './systems/RuleSystem';
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
  private currentLevel = 1;

  // SYSTEMS
  private inputSystem = new InputSystem();
  private smoothMovementSystem = new SmoothMovementSystem();
  private renderSpriteSystem = new RenderSpriteSystem();
  private renderAnimatedSpriteSystem = new RenderAnimatedSpriteSystem();
  private particleLifetimeSystem = new ParticleLifetimeSystem();
  private ruleSystem = new RuleSystem();
  private winSystem = new WinSystem();

  constructor() { }

  private advanceLevel() {
    console.log('NEXT LEVEL');
    this.pauseLoop();
    this.inputSystem.reset();
    this.smoothMovementSystem.reset();
    this.renderSpriteSystem.reset();
    this.renderAnimatedSpriteSystem.reset();
    this.particleLifetimeSystem.reset();
    this.ruleSystem.reset();
    this.winSystem.reset();
    this.currentLevel++;
    this.init().then(() => {
      this.startLoop();
    });
  }

  public init(filename: string = '../../assets/levels/levels-all.bbiy'): Promise<void> {
    return this.levelParser.parseFromFile(filename, 20, this.currentLevel).then((grid: GameGrid) => {
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
      if (e.key === 'b') {
        this.particleLifetimeSystem.addParticleEffect(
          ParticleEffectType.BORDER_SPARKLE,
          {
            x: 5,
            y: 2,
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
    const inputToDisable = {};
    this.renderDriver.clear();
    const entities = this.grid?.getAllEntities() || [];
    this.particleLifetimeSystem.updateAreas(elapsedTime, this.grid!);
    entities.forEach((e) => {
      this.particleLifetimeSystem.update(elapsedTime, e, this.grid!);

      // if (this.winSystem.hasWon) {
      //   this.winSystem.timeSinceLastFirework -= elapsedTime;
      //   if (this.winSystem.timeSinceLastFirework <= 0) {
      //     console.log('SHOOTING FIREWORK');
      //     this.particleLifetimeSystem.addParticleEffect(
      //       ParticleEffectType.EXPLOSION,
      //       {
      //         x: Random.nextRange(0, this.grid!.size - 1),
      //         y: Random.nextRange(0, this.grid!.size - 1),
      //       },
      //       50,
      //     );
      //     this.winSystem.timeSinceLastFirework = Random.nextRange(800, 1500);
      //     this.winSystem.numberOfFireworksShown++;
      //   }
      //   if (this.winSystem.numberOfFireworksShown > 10) {
      //     this.advanceLevel();
      //     return;
      //   }
      // }
      this.inputSystem.update(elapsedTime, e, this.grid!, inputToDisable);
      this.smoothMovementSystem.update(elapsedTime, e, this.grid!);

      this.renderAnimatedSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
      this.renderSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
      // this.winSystem.update(elapsedTime, e, this.grid!);
    });
    Object.keys(inputToDisable).forEach((key) => {
      this.inputSystem.keyboardInput.disableKeyUntilReleased(key);
    });
    this.ruleSystem.updateRules(entities, this.grid!);
    if (this.ruleSystem.rulesChanged) {
      entities.forEach((e) => {
        this.ruleSystem.update(elapsedTime, e, this.grid!);
      });
    }
  }
}
