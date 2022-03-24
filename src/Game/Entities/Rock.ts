import { Noun, NounType } from "../components/Noun";
import { Coordinates, Position } from "../components/Position";
import { Sprite } from "../components/Sprite";
import { Entity } from "./Entity";

export class Rock {
  static Create(coords: Coordinates): Entity {
    const rock: Entity = new Entity();
    rock.addComponent(new Sprite(new Image()));
    rock.addComponent(new Position({...coords}));
    rock.addComponent(new Noun(NounType.ROCK));
    return rock;
  }
}
