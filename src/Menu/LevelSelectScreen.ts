import { MenuSystem } from './MenuSystem';
import { Screen, ScreenType } from "./Screen";

export class LevelSelectScreen extends Screen {
  constructor(menu: MenuSystem) {
    super(ScreenType.LEVEL_SELECT, menu);
    this.findButtons();
  }

  buttonClicked(elId: string): void {
    const level = +elId.replace(/level-/, '');
    this.menu.gameModel.currentLevel = level;
    this.menu.gameModel.reset()
      .then(() => {
        this.menu.navToScreen(ScreenType.GAME_PLAY);
      });
  }

  onEscape(): void {
    this.menu.navToScreen(ScreenType.MAIN_MENU);
  }
}
