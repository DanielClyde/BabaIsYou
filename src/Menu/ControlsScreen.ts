import { Controls } from './../Game/components/InputControlled';
import { MenuSystem } from './MenuSystem';
import { Screen, ScreenType } from "./Screen";

export class ControlsScreen extends Screen {
  private modifying = false;

  constructor(menu: MenuSystem) {
    super(ScreenType.CONTROLS, menu);
    this.findButtons();
  }

  show(): void {
    super.show();
    this.populateButtonText();
  }

  private populateButtonText(): void {
    this.buttons.forEach((el) => {
      el.innerText = `${el.id.replace(/_/gi, ' ')}: ${this.menu.gameModel.controls[(el.id as keyof Controls)].toUpperCase()}`;
    })
  }

  buttonClicked(elId: string): void {
    this.modifying = true;
    const button = this.buttons.find((b) => b.id === elId);
    if (button) {
      button.innerText = 'Press New Key';
      this.menu.keyboard.subscribe('any', (key) => {
        if (key !== 'Escape' && key !== 'Enter') {
          this.menu.keyboard.unsubscribeOne('any');
          this.menu.setControls({
            ...this.menu.gameModel.controls,
            [elId as keyof Controls]: key,
          });
          button.innerText = `${elId.replace(/_/gi, ' ')}: ${key?.toUpperCase()}`;
          this.modifying = false;
        }
      });
    }
  }

  onEnter(): void {
    if (!this.modifying) {
      super.onEnter();
    }
  }

  onEscape(): void {
    if (!this.modifying) {
      this.menu.navToScreen(ScreenType.MAIN_MENU);
    }
  }
}
