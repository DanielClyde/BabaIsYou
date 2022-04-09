import { MenuSystem } from './MenuSystem';
import { Screen, ScreenType } from "./Screen";

export class MainMenu extends Screen {
  constructor(menu: MenuSystem) {
    super(ScreenType.MAIN_MENU, menu);
    this.findButtons();
  }

  buttonClicked(elId: string): void {
    const type = this.elIdToScreenType(elId);
    this.menu.navToScreen(type);
  }

  onEscape(): void {

  }
}
