export enum ComponentName {
  AnimatedSprite = 'AnimatedSprite',
  InputControlled = 'InputControlled',
  Noun = 'Noun',
  Position = 'Position',
  Sprite = 'Sprite',
  Text = 'Text',
  ValueFlags = 'ValueFlags',
}
export class Component {
  constructor(public name: ComponentName) { }
}
