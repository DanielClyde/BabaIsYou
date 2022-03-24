import { Component } from "../components/Component";

export class Entity {
  components: {[name: string]: Component} = {};
  addComponent(c: Component) {
    this.components[c.name] = c;
  }

  removeComponent(name: string) {
    delete this.components[name];
  }
}
