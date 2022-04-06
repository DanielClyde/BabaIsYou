export class TimedEventCaller {
  private events: Array<{ timeInMs: number, cb: () => void }> = [];

  clear() {
    this.events = [];
  }

  addEvent(timeInMs: number, cb: () => void) {
    this.events.push({ timeInMs, cb });
  }

  update(elapsedTime: number) {
    this.events.forEach((e) => {
      e.timeInMs -= elapsedTime;
      if (e.timeInMs <= 0) {
        e.cb();
      }
    });
    this.events = this.events.filter((e) => e.timeInMs > 0);
  }
}
