import { ScreenType, Screen } from './Screen';
import { MenuSystem } from './MenuSystem';
export class GamePlayScreen extends Screen {

  constructor(menu: MenuSystem) {
    super(ScreenType.GAME_PLAY, menu);
  }

  show(): void {
    super.show();
    this.menu.gameModel.startLoop();
  }

  hide(): void {
    super.hide();
    this.menu.gameModel.stopLoop();
  }

  buttonClicked(_elId: string): void { }
  onArrowDown(): void { }
  onArrowUp(): void { }
  onEnter(): void { }
  onEscape(): void {
    this.menu.navToScreen(ScreenType.LEVEL_SELECT);
  }
}
