import { Noun, NounType } from "../components/Noun";
import { Coordinates, Position } from "../components/Position";
import { Sprite } from "../components/Sprite";
import { Entity, EntityType } from "./Entity";

export class Rock {
  static Create(coords: Coordinates): Entity {
    const rock: Entity = new Entity(EntityType.ROCK);
    rock.addComponent(new Sprite(new Image(), 40, 40));
    rock.addComponent(new Position({...coords}));
    rock.addComponent(new Noun(NounType.ROCK));
    return rock;
  }
}
