import { BurnLetters } from './BurnLetters';
import { LavaLetters } from './LavaLetters';
import { SinkLetters } from './SinkLetters';
import { WaterLetters } from './WaterLetters';
import { FlagLetters } from './FlagLetters';
import { YouLetters } from './YouLetters';
import { StopLetters } from './StopLetters';
import { WinLetters } from './WinLetters';
import { PushLetters } from './PushLetters';
import { RockLetters } from './RockLetters';
import { IsLetters } from './IsLetters';
import { BabaLetters } from './BabaLetters';
import { Flag } from './Flag';
import { ComponentName as ComponentName } from './../components/Component';
import { Component } from "../components/Component";
import { Wall } from './Wall';
import { Coordinates } from '../components/Position';
import { Hedge } from './Hedge';
import { Baba } from './Baba';
import { Rock } from './Rock';
import { Floor } from './Floor';
import { WallLetters } from './WallLetters';
import { Water } from './Water';
import { Lava } from './Lava';


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
  static FromType(type: EntityType, coords: Coordinates) {
    if (type === EntityType.HEDGE) {
      return Hedge.Create(coords);
    } else if (type === EntityType.BABA) {
      return Baba.Create(coords);
    } else if (type === EntityType.WALL) {
      return Wall.Create(coords);
    } else if (type === EntityType.FLOOR) {
      return Floor.Create(coords);
    } else if (type === EntityType.ROCK) {
      return Rock.Create(coords);
    } else if (type === EntityType.FLAG) {
      return Flag.Create(coords);
    } else if (type === EntityType.BABA_LETTERS) {
      return BabaLetters.Create(coords);
    } else if (type === EntityType.IS_LETTERS) {
      return IsLetters.Create(coords);
    } else if (type === EntityType.ROCK_LETTERS) {
      return RockLetters.Create(coords);
    } else if (type === EntityType.WALL_LETTERS) {
      return WallLetters.Create(coords);
    } else if (type === EntityType.PUSH_LETTERS) {
      return PushLetters.Create(coords)
    } else if (type === EntityType.WIN_LETTERS) {
      return WinLetters.Create(coords);
    } else if (type === EntityType.STOP_LETTERS) {
      return StopLetters.Create(coords);
    } else if (type === EntityType.YOU_LETTERS) {
      return YouLetters.Create(coords);
    } else if (type === EntityType.FLAG_LETTERS) {
      return FlagLetters.Create(coords);
    } else if (type === EntityType.WATER_LETTERS) {
      return WaterLetters.Create(coords);
    } else if (type === EntityType.WATER) {
      return Water.Create(coords);
    } else if (type === EntityType.SINK_LETTERS) {
      return SinkLetters.Create(coords);
    } else if (type === EntityType.LAVA) {
      return Lava.Create(coords);
    } else if (type === EntityType.LAVA_LETTERS) {
      return LavaLetters.Create(coords);
    } else if (type === EntityType.BURN_LETTERS) {
      return BurnLetters.Create(coords);
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
