import { Component, ComponentName } from "./Component";

export enum TextType {
  NOUN = 1,
  VERB = 2,
  IS = 3,
}

// A Text object that can be pushed around to change rules
export class Text extends Component {
  constructor(public type: TextType) {
    super(ComponentName.Text);
  }
}
