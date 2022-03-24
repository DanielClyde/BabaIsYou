export class BitwiseHelper {
  static setBooleanInFlags(flags: number, val: boolean, bit: number): number {
    if (val) {
      flags |= 1 << bit;
    } else {
      flags &= ~(1 << bit);
    }
    return flags;
  }

  static getBooleanFromFlags(flags: number, bit: number): boolean {
    return (flags & (1 << bit)) !== 0;
  }
}
