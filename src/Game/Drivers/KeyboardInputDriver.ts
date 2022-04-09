export class KeyboardInputDriver {
  private keys: {[key: string]: number} = {};
  private disabledKeys: {[key: string]: boolean} = {};
  private subscriptions: {[key: string]: (k?: string) => void } = {};

  constructor() {
    window.addEventListener('keydown', this.keyPress.bind(this));
    window.addEventListener('keyup', this.keyRelease.bind(this));
  }

  // for menu navigation
  subscribe(key: string, cb: (k?: string) => void) {
    this.subscriptions[key] = cb;
  }

  unsubscribeOne(key: string): void {
    delete this.subscriptions[key];
  }

  unsubscribeAll() {
    this.subscriptions = {};
  }

  isKeyPressed(key: string): boolean {
    if (this.keys[key] && !this.disabledKeys[key]) {
      return true;
    } else {
      return false;
    }
  }

  disableKeyUntilReleased(key: string) {
    this.disabledKeys[key] = true;
  }

  clearDisabledKeys() {
    this.disabledKeys = {};
  }

  private keyPress(e: KeyboardEvent) {
    this.keys[e.key] = e.timeStamp;
    if (this.subscriptions['any'] && !this.disabledKeys[e.key]) {
      this.subscriptions['any'](e.key);
    }
    if (this.subscriptions[e.key] && !this.disabledKeys[e.key]) {
      this.subscriptions[e.key]();
      this.disableKeyUntilReleased(e.key);
    }
  }

  private keyRelease(e: KeyboardEvent) {
    delete this.keys[e.key];
    delete this.disabledKeys[e.key];
  }

}
