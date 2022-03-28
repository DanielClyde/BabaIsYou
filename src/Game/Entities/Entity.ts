import { ComponentName as ComponentName } from './../components/Component';
import { Component } from "../components/Component";


export type ComponentDictionary = { [key in ComponentName]?: Component };

export class Entity {
  private components: ComponentDictionary = {};
  id: number;
  constructor() {
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
