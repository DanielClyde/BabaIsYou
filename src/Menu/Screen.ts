import { SoundTrack } from '../Game/Drivers/AudioDriver';
import { MenuSystem } from './MenuSystem';
export enum ScreenType {
  MAIN_MENU = 'main-menu-screen',
  LEVEL_SELECT = 'level-select-screen',
  GAME_PLAY = 'game-play-screen',
  CONTROLS = 'controls-screen',
  CREDITS = 'credits-screen',
}

export abstract class Screen {
  protected type: ScreenType;
  protected containingDiv: HTMLDivElement;
  protected selectedBtnIndex = -1;
  protected buttons: HTMLDivElement[] = [];
  protected menu: MenuSystem;

  constructor(type: ScreenType, menu: MenuSystem) {
    this.containingDiv = document.getElementById(type) as HTMLDivElement;
    this.type = type;
    this.menu = menu;
  }

  protected findButtons() {
    this.containingDiv.querySelectorAll('.menu-button').forEach((el, i) => {
      this.buttons.push(el as HTMLDivElement);
      (el as HTMLDivElement).addEventListener('click', () => {
        this.buttonClicked(el.id);
      });
      (el as HTMLDivElement).addEventListener('mouseover', () => {
        this.selectedBtnIndex = i;
        this.updateSelectedButton();
      });
    });
  }

  private updateSelectedButton() {
    this.buttons.forEach((el, i) => {
      if (i === this.selectedBtnIndex) {
        el.classList.add('hovering');
      } else {
        el.classList.remove('hovering');
      }
    })
  }

  abstract buttonClicked(elId: string): void;

  show() {
    this.containingDiv.classList.add('active');
  }

  hide() {
    this.containingDiv.classList.remove('active');
  }

  onArrowUp(): void {
    if (this.selectedBtnIndex > 0) {
      this.selectedBtnIndex--;
      this.updateSelectedButton();
    }
  };

  onArrowDown(): void {
    if (this.selectedBtnIndex < (this.buttons.length - 1)) {
      this.selectedBtnIndex++;
      this.updateSelectedButton();
    }
  };

  onEnter(): void {
    if (this.selectedBtnIndex >= 0) {
      this.buttons[this.selectedBtnIndex].click();
    }
    if (!this.menu.gameModel.audioDriver.isPlaying ||
        !this.menu.gameModel.audioDriver.currentSoundTrack) {
          this.menu.gameModel.audioDriver.playMusic(SoundTrack.GAME);
        }
  }

  abstract onEscape(): void;

  protected elIdToScreenType(elId: string): ScreenType {
    elId = elId.replace(/btn-/, '') + '-screen';
    return elId as ScreenType;
  }
}
