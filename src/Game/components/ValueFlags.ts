import { BitwiseHelper } from './../../Utils/BitwiseHelper';
import { Component, ComponentName } from "./Component";

export const FlagBitPositions = {
  PUSH: 0,
  STOP: 1,
  YOU: 2,
  WIN: 3,
  BURN: 4,
  SINK: 5,
  BURNABLE: 6,
  SINKABLE: 7,
}

export class ValueFlags extends Component {
  value = 0;
  uneditableFlags = 0;
  constructor() {
    super(ComponentName.ValueFlags);
  }

  getFlag(bit: number): boolean {
    return BitwiseHelper.getBooleanFromFlags(this.value, bit);
  }

  setFlag(bit: number, val: boolean, setDefault = false) {
    this.value = BitwiseHelper.setBooleanInFlags(this.value, val, bit);
    if (setDefault) {
      this.uneditableFlags = BitwiseHelper.setBooleanInFlags(this.uneditableFlags, val, bit);
    }
  }
}
