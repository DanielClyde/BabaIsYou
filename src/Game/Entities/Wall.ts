import { Noun, NounType } from './../components/Noun';
import { Coordinates, Position } from "../components/Position";
import { Sprite } from "../components/Sprite";
import { Entity } from "./Entity";

export class Wall {
  static Create(coords: Coordinates): Entity {
    const wall: Entity = new Entity();
    wall.addComponent(new Sprite());
    wall.addComponent(new Position(coords));
    wall.addComponent(new Noun(NounType.WALL));
    return wall;
  }
}
