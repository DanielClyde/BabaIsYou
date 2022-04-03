import { BitwiseHelper } from './../../Utils/BitwiseHelper';
import { Component, ComponentName } from "./Component";

export const FlagBitPositions = {
  PUSH: 0,
  MOVE: 1,
  YOU: 2,
  WIN: 3,
  KILL: 4,
  STOP: 5,
}

export class ValueFlags extends Component {
  value = 0;
  constructor() {
    super(ComponentName.ValueFlags);
  }

  getFlag(bit: number): boolean {
    return BitwiseHelper.getBooleanFromFlags(this.value, bit);
  }

  setFlag(bit: number, val: boolean) {
    this.value = BitwiseHelper.setBooleanInFlags(this.value, val, bit);
  }
}
