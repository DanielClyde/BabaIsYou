import { Component } from "./Component";

export enum TextType {
  NOUN = 1,
  VERB = 2,
}

// A Text object that can be pushed around to change rules
export class Text extends Component {
  type: TextType;
  constructor(type: TextType) {
    super('Text');
    this.type = type;
  }
}
