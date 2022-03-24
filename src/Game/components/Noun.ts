import { Component, ComponentName } from "./Component";

export enum NounType {
  WALL = 1,
  TEXT = 2,
  FLAG = 3,
  ROCK = 4,
  LAVA = 5,
  MARIO = 6,
  WATER = 7,
  NOUN_TEXT,
  VERB_TEXT,
}


// A Noun is something that can be changed by rules
export class Noun extends Component {
  constructor(public type: NounType) {
    super(ComponentName.Noun);
  }
}
