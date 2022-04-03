export class KeyboardInputDriver {
  private keys: {[key: string]: number} = {};
  private disabledKeys: {[key: string]: boolean} = {};

  constructor() {
    window.addEventListener('keydown', this.keyPress.bind(this));
    window.addEventListener('keyup', this.keyRelease.bind(this));
  }

  isKeyPressed(key: string): boolean {
    if (this.keys[key] && !this.disabledKeys[key]) {
      this.disabledKeys[key] = true;
      return true;
    } else {
      return false;
    }
  }

  private keyPress(e: KeyboardEvent) {
    this.keys[e.key] = e.timeStamp;
  }

  private keyRelease(e: KeyboardEvent) {
    delete this.keys[e.key];
    delete this.disabledKeys[e.key];
  }

}
