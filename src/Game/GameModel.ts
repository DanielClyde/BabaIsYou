import { MenuSystem } from './../Menu/MenuSystem';
import { Controls, DefaultControls } from './components/InputControlled';
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
import { ScreenType } from '../Menu/Screen';
import { AudioDriver, SoundEffect } from './Drivers/AudioDriver';

const GAME_GRID_SIZE = 20;

export class GameModel {
  public controls: Controls = { ...DefaultControls };
  public currentLevel = 1;
  public audioDriver = new AudioDriver();
  private previousTimestamp = performance.now();
  private loopStopped = true;
  private renderDriver = new RenderDriver();
  private levelParser = new LevelParser();
  private grid?: GameGrid;
  private initialized = false;
  private timer = new TimedEventCaller();
  private limitedLoop = false;

  // SYSTEMS
  private inputSystem: InputSystem;
  private smoothMovementSystem = new SmoothMovementSystem();
  private renderSpriteSystem = new RenderSpriteSystem();
  private renderAnimatedSpriteSystem = new RenderAnimatedSpriteSystem();
  private particleLifetimeSystem = new ParticleLifetimeSystem();
  private ruleSystem = new RuleSystem();
  private winSystem = new WinSystem();
  private destroySystem = new DestroyObjectsSystem();
  private menu: MenuSystem;

  constructor(menu: MenuSystem) {
    this.menu = menu;
    this.inputSystem = new InputSystem(this.menu.keyboard);
  }

  public reset() {
    this.stopLoop();
    this.timer.clear();
    this.inputSystem.reset();
    this.smoothMovementSystem.reset();
    this.renderSpriteSystem.reset();
    this.renderAnimatedSpriteSystem.reset();
    this.particleLifetimeSystem.reset();
    this.ruleSystem.reset();
    this.winSystem.reset();
    this.destroySystem.reset();
    return this.init();
  }

  public init(filename: string = '../../assets/levels/levels-all.bbiy'): Promise<void> {
    return this.levelParser.parseFromFile(filename, GAME_GRID_SIZE, this.currentLevel).then((grid: GameGrid) => {
      this.grid = grid;
      this.initialized = true;
    });
  }

  public stopLoop() {
    this.loopStopped = true;
  }

  public startLoop() {
    if (!this.initialized) {
      throw new Error('Must first call GameModel.initialize() before starting the game loop!');
    }
    this.loopStopped = false;
    this.limitedLoop = false;
    this.menu.keyboard.clearDisabledKeys();
    this.previousTimestamp = performance.now();
    this.grid?.saveToStack();
    this.loop(this.previousTimestamp);
  }

  private loop(timestamp: number) {
    if (!this.loopStopped) {
      const elapsedTime = timestamp - this.previousTimestamp;
      this.update(elapsedTime);
      this.previousTimestamp = timestamp;
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  private update(elapsedTime: number) {
    const pressedKeys = {};
    if (!this.limitedLoop) {
      this.inputSystem.checkUndoOrReset(this.onReset.bind(this), this.onUndo.bind(this), pressedKeys, this.controls);
    }
    this.renderDriver.clear();
    this.timer.update(elapsedTime);
    const entities = this.grid?.getAllEntities() || [];
    this.particleLifetimeSystem.updateAreas(elapsedTime, this.grid!);
    for (const e of entities) {
      this.destroySystem.update(elapsedTime, e, this.grid!, this.onEntitiesDestroyed.bind(this));
      this.particleLifetimeSystem.update(elapsedTime, e, this.grid!);
      if (!this.limitedLoop) {
        this.inputSystem.update(elapsedTime, e, this.grid!, pressedKeys, this.controls);
        this.winSystem.update(elapsedTime, e, this.grid!, this.onWin.bind(this));
      }
      this.smoothMovementSystem.update(elapsedTime, e, this.grid!);
      this.renderAnimatedSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
      this.renderSpriteSystem.update(elapsedTime, e, this.grid!, this.renderDriver);
    }

    let shouldSaveToStack = false;

    Object.keys(pressedKeys).forEach((key) => {
      if (key !== this.controls.UNDO && key !== this.controls.RESET) {
        shouldSaveToStack = true;
      }
      this.menu.keyboard.disableKeyUntilReleased(key);
      this.audioDriver.playSoundEffect(SoundEffect.MOVE);
    });

    if (!this.limitedLoop) {
      this.ruleSystem.updateRules(entities, this.grid!);
    }
    if (this.ruleSystem.rulesChanged) {
      entities.forEach((e) => {
        this.ruleSystem.update(elapsedTime, e, this.grid!, this.sparklePosition.bind(this));
      });
    }
    if (shouldSaveToStack) {
      this.grid?.saveToStack();
    }
  }

  private onReset() {
    this.limitedLoop = true;
    this.reset().then(() => {
      this.startLoop();
    });
  }

  private onUndo() {
    if (!this.limitedLoop) {
      this.limitedLoop = true;
      this.grid?.undo();
      this.limitedLoop = false;
    }
  }

  private onWin() {
    this.limitedLoop = true;
    this.audioDriver.playSoundEffect(SoundEffect.WIN);
    for (let i = 0; i < 6; i++) {
      this.timer.addEvent(i * 500, () => {
        this.particleLifetimeSystem.addParticleEffect(
          ParticleEffectType.FIREWORK,
          {
            x: Random.nextRange(2, this.grid!.size - 2),
            y: Random.nextRange(2, this.grid!.size - 2),
          }, 50);
        if (i === 5) {
          this.timer.addEvent(1200, () => {
            this.menu.navToScreen(ScreenType.LEVEL_SELECT);
          });
        }
      });
    }
  }

  private sparklePosition(x: number, y: number) {
    this.audioDriver.playSoundEffect(SoundEffect.WIN_CHANGE);
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
    this.audioDriver.playSoundEffect(SoundEffect.DEAD);
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
