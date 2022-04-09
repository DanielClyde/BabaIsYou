import { Component, ComponentName } from "./Component";


export interface Controls {
  MOVE_UP: string;
  MOVE_RIGHT: string;
  MOVE_DOWN: string;
  MOVE_LEFT: string;
  UNDO: string;
  RESET: string;
}

export const DefaultControls: Controls = {
  MOVE_UP: 'w',
  MOVE_RIGHT: 'd',
  MOVE_DOWN: 's',
  MOVE_LEFT: 'a',
  UNDO: 'z',
  RESET: 'r',
}
export class InputControlled extends Component {
  constructor() {
    super(ComponentName.InputControlled);
  }
}
