import { ComponentName as ComponentName } from './../components/Component';
import { Component } from "../components/Component";
import { Wall } from './Wall';
import { Coordinates } from '../components/Position';
import { Hedge } from './Hedge';
import { Baba } from './Baba';
import { Rock } from './Rock';
import { Floor } from './Floor';


export type ComponentDictionary = { [key in ComponentName]?: Component };
export enum EntityType {
  WALL = 'w',
  HEDGE = 'h',
  BABA = 'b',
  ROCK = 'r',
  PARTICLE = 'p',
  Floor = 'l',
}
export class Entity {
  static FromType(type: EntityType, coords: Coordinates) {
    if (type === EntityType.HEDGE) {
      return Hedge.Create({ ...coords });
    } else if (type === EntityType.BABA) {
      return Baba.Create({ ...coords });
    } else if (type === EntityType.WALL) {
      return Wall.Create({ ...coords });
    } else if (type === EntityType.Floor) {
      return Floor.Create({ ...coords });
    } else {
      return null;
    }
  }

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
}

export class IDGenerator {
  private static id = 0;
  static getNextId(): number {
    return ++this.id;
  }
}
