import { MenuSystem } from './MenuSystem';
import { Screen, ScreenType } from "./Screen";

export class CreditsScreen extends Screen {
  constructor(menu: MenuSystem) {
    super(ScreenType.CREDITS, menu);
    this.findButtons();
  }

  buttonClicked(elId: string): void { }

  onArrowDown(): void { }

  onArrowUp(): void { }

  onEscape(): void {
    this.menu.navToScreen(ScreenType.MAIN_MENU);
  }
}
