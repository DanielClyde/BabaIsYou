export class Random {
  private static y2: number;
  private static usePrevious = false;

  static nextDouble() {
    return Math.random();
  }

  static nextRange(min: number, max: number) {
    let range = max - min;
    return Math.floor((Math.random() * range) + min);
  }

  static nextCircleVector() {
    let angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  static nextGaussian(mean: number, stdDev: number) {
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let z = 0;

    if (this.usePrevious) {
      this.usePrevious = false;
      return mean + this.y2 * stdDev;
    }

    this.usePrevious = true;

    do {
      x1 = 2 * Math.random() - 1;
      x2 = 2 * Math.random() - 1;
      z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);

    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    this.y2 = x2 * z;

    return mean + y1 * stdDev;
  }
}
