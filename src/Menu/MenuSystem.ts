import { GamePlayScreen } from './GamePlayScreen';
import { Controls } from './../Game/components/InputControlled';
import { StorageDriver, StorageKey } from './../Game/Drivers/StorageDriver';
import { LevelSelectScreen } from './LevelSelectScreen';
import { CreditsScreen } from './CreditsScreen';
import { ControlsScreen } from './ControlsScreen';
import { KeyboardInputDriver } from './../Game/Drivers/KeyboardInputDriver';
import { GameModel } from './../Game/GameModel';
import { MainMenu } from './MainMenu';
import { Screen, ScreenType } from './Screen';
import { DefaultControls } from '../Game/components/InputControlled';
import { SoundTrack } from '../Game/Drivers/AudioDriver';

export class MenuSystem {
  public keyboard = new KeyboardInputDriver();
  public gameModel = new GameModel(this);

  private screens: { [key in ScreenType]: Screen } = {
    [ScreenType.MAIN_MENU]: new MainMenu(this),
    [ScreenType.CONTROLS]: new ControlsScreen(this),
    [ScreenType.CREDITS]: new CreditsScreen(this),
    [ScreenType.LEVEL_SELECT]: new LevelSelectScreen(this),
    [ScreenType.GAME_PLAY]: new GamePlayScreen(this),
  };
  private currentScreen: Screen = this.screens[ScreenType.MAIN_MENU];
  private storage = new StorageDriver();

  constructor() {
    this.navToScreen(ScreenType.MAIN_MENU);
    this.initKeyboardSubscriptions();
    this.gameModel.controls = this.storage.getObj<Controls>(StorageKey.CONTROLS) || { ...DefaultControls };
    this.gameModel.audioDriver.init().then(() => {
      console.log('AUDIO DRIVER INITIALIZED');
      this.keyboard.subscribe('any', () => {
        this.startMusic();
        this.keyboard.unsubscribeOne('any');
      });
    });
  }

  startMusic() {
    if (!this.gameModel.audioDriver.isPlaying) {
      this.gameModel.audioDriver.playMusic(SoundTrack.GAME);
    }
  }

  setControls(newControls: Controls): void {
    this.gameModel.controls = { ...newControls };
    this.storage.setObj<Controls>(StorageKey.CONTROLS, newControls);
  }

  private initKeyboardSubscriptions() {
    this.keyboard.subscribe('any', () => {

    })
    this.keyboard.subscribe('Enter', () => this.currentScreen.onEnter());
    this.keyboard.subscribe('ArrowUp', () => this.currentScreen.onArrowUp());
    this.keyboard.subscribe('ArrowDown', () => this.currentScreen.onArrowDown());
    this.keyboard.subscribe('Escape', () => this.currentScreen.onEscape());
  }

  private unsubscribeToKeyboard() {
    this.keyboard.unsubscribeOne('ArrowUp');
    this.keyboard.unsubscribeOne('ArrowDown');
    this.keyboard.unsubscribeOne('Enter');
    // leave escape subscribed for "quitting" a level
  }

  navToScreen(type: ScreenType): void {
    if (this.currentScreen instanceof GamePlayScreen) {
      this.keyboard.unsubscribeAll();
      this.initKeyboardSubscriptions();
    }
    if (type === ScreenType.GAME_PLAY) {
      this.unsubscribeToKeyboard();
    }
    this.currentScreen.hide();
    this.currentScreen = this.screens[type];
    this.currentScreen.show();
  }
}
