import { ComponentName as ComponentName } from './../components/Component';
import { Component } from "../components/Component";
import cloneDeep from 'lodash/cloneDeep';


export type ComponentDictionary = { [key in ComponentName]?: Component };
export enum EntityType {
  WALL = 'w',
  HEDGE = 'h',
  BABA = 'b',
  ROCK = 'r',
  PARTICLE = 'p',
  FLOOR = 'l',
  FLAG = 'f',
  BABA_LETTERS = 'B',
  IS_LETTERS = 'I',
  YOU_LETTERS = 'Y',
  PUSH_LETTERS = 'P',
  ROCK_LETTERS = 'R',
  STOP_LETTERS = 'S',
  WALL_LETTERS = 'W',
  FLAG_LETTERS = 'F',
  WIN_LETTERS = 'X',
  WATER_LETTERS = 'A',
  WATER = 'a',
  SINK_LETTERS = 'N',
  LAVA_LETTERS = 'V',
  LAVA = 'v',
  BURN_LETTERS = 'K',
}
export class Entity {
  private components: ComponentDictionary = {};
  id: number;
  type: EntityType;
  constructor(type: EntityType) {
    this.type = type;
    this.id = IDGenerator.getNextId();
  }
  addComponent(c: Component) {
    this.components[c.name] = c;
  }

  removeComponent(name: ComponentName) {
    delete this.components[name];
  }

  getComponent<T extends Component>(componentName: ComponentName): T {
    return this.components[componentName] as T;
  }

  clone(): Entity {
    const e = new Entity(this.type);
    e.id = this.id;
    e.components = cloneDeep(this.components);
    return e;
  }
}

export class IDGenerator {
  private static id = 0;
  static getNextId(): number {
    return ++this.id;
  }
}
