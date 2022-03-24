import { ComponentName as ComponentName } from './../components/Component';
import { Component } from "../components/Component";

export class Entity {
  components: {[key in ComponentName]?: Component} = {};
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
}

export class IDGenerator {
  private static id = 0;
  static getNextId(): number {
    return ++this.id;
  }
}
