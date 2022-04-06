import { Position } from './components/Position';
import { Entity } from './Entities/Entity';
import { Random } from './../Utils/Random';
import { TimedEventCaller } from './../Utils/TimedEventCaller';
import { WinSystem } from './systems/WinSystem';
import { RuleSystem } from './systems/RuleSystem';
import { LevelParser } from './../Utils/LevelParser';
import { RenderAnimatedSpriteSystem } from './systems/RenderAnimatedSpriteSystem';
import { SmoothMovementSystem } from './systems/SmoothMovementSystem';
import { InputSystem } from './systems/InputSystem';
import { RenderDriver } from './Drivers/RenderDriver';
import { RenderSpriteSystem } from './systems/RenderSpriteSystem';
import { ParticleEffectType, ParticleLifetimeSystem } from './systems/ParticleLifetimeSystem';
import { GameGrid } from './GameGrid';
import { DestroyObjectsSystem } from './systems/DestroyObjectsSystem';
import { ComponentName } from './components/Component';

export class GameModel {
  private previousTimestamp = performance.now();
  private loopStopped = true;
  private renderDriver = new RenderDriver();
  private levelParser = new LevelParser();
  private grid?: GameGrid;
  private initialized = false;
  private currentLevel = 1;
  private timer = new TimedEventCaller();
  private hasWon = false;

  // SYSTEMS
  private inputSystem = new InputSystem();
  private smoothMovementSystem = new SmoothMovementSystem();
  private renderSpriteSystem = new RenderSpriteSystem();
  private renderAnimatedSpriteSystem = new RenderAnimatedSpriteSystem();
  private particleLifetimeSystem = new ParticleLifetimeSystem();
  private ruleSystem = new RuleSystem();
  private winSystem = new WinSystem();
  private destroySystem = new DestroyObjectsSystem();

  constructor() { }

  private advanceLevel() {
    console.log('NEXT LEVEL');
    this.stopLoop();
    this.inputSystem.reset();
    this.smoothMovementSystem.reset();
    this.renderSpriteSystem.reset();
    this.renderAnimatedSpriteSystem.reset();
    this.particleLifetimeSystem.reset();
    this.ruleSystem.reset();
    this.winSystem.reset();
    this.destroySystem.reset();
    this.currentLevel++;
    this.init().then(() => {
      this.hasWon = false;
      this.startLoop();
    });
  }

  public init(filename: string = '../../assets/levels/levels-all.bbiy'): Promise<void> {
    return this.levelParser.parseFromFile(filename, 20, this.currentLevel).then((grid: GameGrid) => {
      this.grid = grid;
      this.initialized = true;
    });
  }

  public stopLoop() {
    console.log('STOPPING LOOP');
    this.loopStopped = true;
  }

  public startLoop() {
    if (!this.initialized) {
      throw new Error('Must first call GameModel.initialize() before starting the game loop!');
    }
    console.log('STARTING LOOP');
    this.loopStopped = false;
    this.previousTimestamp = performance.now();
    this.loop(this.previousTimestamp);
  }

  private loop(timestamp: number) {
    const elapsedTime = timestamp - this.previousTimestamp;
    this.update(elapsedTime);
    this.previousTimestamp = timestamp;
    if (!this.loopStopped) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  private update(elapsedTime: number) {
    const pressedKeys = {};
    this.renderDriver.clear();
    this.timer.update(elapsedTime);
    const entities = this.grid?.getAllEntities() || [];
    this.particleLifetimeSystem.updateAreas(elapsedTime, this.grid!);
    entities.forEach((e) => {
      this.destroySystem.update(elapsedTime, e, this.grid!, this.onEntitiesDestroyed.bind(this));
      this.particleLifetimeSystem.update(elapsedTime, e, this.grid!);
      if (!this.hasWon) {
        this.inputSystem.update(elapsedTime, e, this.grid!, pressedKeys);
        this.winSystem.update(elapsedTime, e, this.grid!, this.onWin.bind(this));
      }
      this.smoothMovementSystem.update(elapsedTime, e, this.grid!);
      this.renderAnimatedSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
      this.renderSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
    });
    Object.keys(pressedKeys).forEach((key) => {
      this.inputSystem.keyboardInput.disableKeyUntilReleased(key);
    });

    if (!this.hasWon) {
      this.ruleSystem.updateRules(entities, this.grid!);
    }
    if (this.ruleSystem.rulesChanged) {
      entities.forEach((e) => {
        this.ruleSystem.update(elapsedTime, e, this.grid!, this.sparklePosition.bind(this));
      });
    }
  }

  private onWin() {
    console.log('WIN');
    this.hasWon = true;
    for (let i = 0; i < 8; i++) {
      this.timer.addEvent(i * 700, () => {
        this.particleLifetimeSystem.addParticleEffect(
          ParticleEffectType.FIREWORK,
          {
            x: Random.nextRange(2, this.grid!.size - 2),
            y: Random.nextRange(2, this.grid!.size - 2),
          }, 50);
        if (i === 7) {
          this.timer.addEvent(1200, () => {
            this.advanceLevel();
          });
        }
      });
    }
  }

  private sparklePosition(x: number, y: number) {
    this.particleLifetimeSystem.addParticleEffect(
      ParticleEffectType.BORDER_SPARKLE,
      {
        x,
        y,
      },
      1100,
    );
  }

  private onEntitiesDestroyed(entities: Entity[]): void {
    entities.forEach((e) => {
      const position = e.getComponent<Position>(ComponentName.Position);
      this.grid!.deleteEntity(e);
      this.particleLifetimeSystem.addParticleEffect(
        ParticleEffectType.DESTROY,
        {
          x: position.coords.x,
          y: position.coords.y,
        },
        250,
      );
    });
  }
}
