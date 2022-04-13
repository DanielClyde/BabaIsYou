import { InputControlled } from './../components/InputControlled';
import { FlagBitPositions, ValueFlags } from './../components/ValueFlags';
import { NounType, Noun } from './../components/Noun';
import { Position } from './../components/Position';
import { ComponentName } from "../components/Component";
import { Text, TextType } from "../components/Text";
import { Entity, EntityType } from "../Entities/Entity";
import { GameGrid } from "../GameGrid";
import { System } from "./System";
import isEqual from 'lodash/isEqual';
import { EntityFromEntityType } from '../EntityFactory';

export class RuleSystem extends System {
  private nounToVerbRules: Array<[NounType, number]> = [];
  private previousNounToVerbRules: Array<[NounType, number]> = [];
  private nounToNounRules: Array<[NounType, NounType]> = [];
  private previousNounToNounRules: Array<[NounType, NounType]> = [];
  private nounsToSparkle: Array<NounType> = [];

  rulesChanged = false;

  public reset(): void {
    super.reset();
    this.nounToVerbRules = [];
    this.previousNounToVerbRules = [];
    this.nounsToSparkle = [];
    this.rulesChanged = false;
  }

  updateRules(entities: Entity[], grid: GameGrid) {
    this.rulesChanged = false;
    this.nounToVerbRules = [];
    this.nounsToSparkle = [];
    this.nounToNounRules = [];
    entities.forEach((e) => {
      const [text, position] = [e.getComponent<Text>(ComponentName.Text), e.getComponent<Position>(ComponentName.Position)];
      if (text && text.type === TextType.IS) {
        const top = grid.getEntitiesAbove(position.coords.x, position.coords.y).find((t) => t.getComponent<Text>(ComponentName.Text));
        const bottom = grid.getEntitiesBelow(position.coords.x, position.coords.y).find((t) => t.getComponent<Text>(ComponentName.Text));
        const right = grid.getEntitiesToRight(position.coords.x, position.coords.y).find((t) => t.getComponent<Text>(ComponentName.Text));
        const left = grid.getEntitiesToLeft(position.coords.x, position.coords.y).find((t) => t.getComponent<Text>(ComponentName.Text));
        if (top && bottom) {
          const topText = top.getComponent<Text>(ComponentName.Text);
          const bottomText = bottom.getComponent<Text>(ComponentName.Text);
          if (topText && bottomText && topText.type !== bottomText.type) {
            this.nounToVerbRules.push(
              topText.type === TextType.NOUN ?
                [this.getNounTypeFromEntity(top), this.getFlagNumberFromEntity(bottom)] :
                [this.getNounTypeFromEntity(bottom), this.getFlagNumberFromEntity(top)]);
          } else if (topText.type === TextType.NOUN && bottomText.type === TextType.NOUN) {
            this.nounToNounRules.push([this.getNounTypeFromEntity(top), this.getNounTypeFromEntity(bottom)]);
          }
        }
        if (left && right) {
          const leftText = left.getComponent<Text>(ComponentName.Text);
          const rightText = right.getComponent<Text>(ComponentName.Text);
          if (leftText && rightText && leftText.type !== rightText.type) {
            this.nounToVerbRules.push(
              leftText.type === TextType.NOUN ?
                [this.getNounTypeFromEntity(left), this.getFlagNumberFromEntity(right)] :
                [this.getNounTypeFromEntity(right), this.getFlagNumberFromEntity(left)]
            );
          } else if (leftText.type === TextType.NOUN && rightText.type === TextType.NOUN) {
            this.nounToNounRules.push([this.getNounTypeFromEntity(left), this.getNounTypeFromEntity(right)]);
          }
        }

      }
    });
    if (!isEqual(this.nounToVerbRules, this.previousNounToVerbRules) || !isEqual(this.nounToNounRules, this.previousNounToNounRules)) {
      this.rulesChanged = true;
      this.nounsToSparkle = this.nounToVerbRules.filter((r) => {
        const i = this.previousNounToVerbRules.findIndex((old) => old[0] === r[0] && old[1] === r[1]);
        return (r[1] === FlagBitPositions.WIN || r[1] === FlagBitPositions.YOU) && i === -1;
      }).map((r) => r[0]);
    }
    this.previousNounToVerbRules = this.nounToVerbRules;
    this.previousNounToNounRules = this.nounToNounRules;
  }

  update(_elapsedTime: number, entity: Entity, gameGrid: GameGrid, sparkleCb: (x: number, y: number) => void): void {
    if (!this.rulesChanged) {
      return;
    } else {
      this.updateNounToVerbRules(entity, sparkleCb);
      this.updateNounToNounRules(entity, gameGrid);
    }
  }

  private updateNounToVerbRules(entity: Entity, sparkleCb: (x: number, y: number) => void) {
    const [noun, flags, position] = [
      entity.getComponent<Noun>(ComponentName.Noun),
      entity.getComponent<ValueFlags>(ComponentName.ValueFlags),
      entity.getComponent<Position>(ComponentName.Position),
    ];
    if (noun && flags) {
      flags.value = flags.uneditableFlags;
      const rules = this.nounToVerbRules.filter((r) => r[0] === noun.type);
      rules.forEach((r) => {
        flags.setFlag(r[1], true);
      });
      const input = entity.getComponent<InputControlled>(ComponentName.InputControlled);
      if (input && !flags.getFlag(FlagBitPositions.YOU)) {
        entity.removeComponent(ComponentName.InputControlled);
      } else if (flags.getFlag(FlagBitPositions.YOU) && !input) {
        entity.addComponent(new InputControlled());
      }
      if (this.nounsToSparkle.includes(noun.type)) {
        sparkleCb(position.coords.x, position.coords.y);
      }
    }
  }

  private updateNounToNounRules(entity: Entity, grid: GameGrid) {
    const [noun, position] = [
      entity.getComponent<Noun>(ComponentName.Noun),
      entity.getComponent<Position>(ComponentName.Position),
    ];
    if (noun) {
      const rule = this.nounToNounRules.find((r) => r[0] === noun.type);
      if (rule) {
        const entityTypeToChangeTo = this.getEntityTypeFromNounType(rule[1]);
        if (entityTypeToChangeTo !== null) {
          const x = position.coords.x;
          const y = position.coords.y;
          const newEntity = EntityFromEntityType(entityTypeToChangeTo, { x, y });
          if (newEntity) {
            grid.deleteEntity(entity);
            grid.insert(x, y, newEntity)
          }
        }

      }
    }
  }

  private getEntityTypeFromNounType(nounType: NounType): EntityType | null {
    if (nounType === NounType.BABA) {
      return EntityType.BABA;
    } else if (nounType === NounType.FLAG) {
      return EntityType.FLAG;
    } else if (nounType === NounType.LAVA) {
      return EntityType.LAVA;
    } else if (nounType === NounType.ROCK) {
      return EntityType.ROCK;
    } else if (nounType === NounType.WALL) {
      return EntityType.WALL;
    } else if (nounType === NounType.WATER) {
      return EntityType.WATER;
    } else {
      return null;
    }
  }

  private getNounTypeFromEntity(e: Entity): NounType {
    if (e.type === EntityType.BABA_LETTERS) {
      return NounType.BABA;
    } else if (e.type === EntityType.FLAG_LETTERS) {
      return NounType.FLAG;
    } else if (e.type === EntityType.ROCK_LETTERS) {
      return NounType.ROCK;
    } else if (e.type === EntityType.WALL_LETTERS) {
      return NounType.WALL;
    } else if (e.type === EntityType.WATER_LETTERS) {
      return NounType.WATER;
    } else {
      return NounType.LAVA;
    }
  }

  private getFlagNumberFromEntity(e: Entity): number {
    if (e.type === EntityType.PUSH_LETTERS) {
      return FlagBitPositions.PUSH;
    } else if (e.type === EntityType.STOP_LETTERS) {
      return FlagBitPositions.STOP;
    } else if (e.type === EntityType.WIN_LETTERS) {
      return FlagBitPositions.WIN;
    } else if (e.type === EntityType.YOU_LETTERS) {
      return FlagBitPositions.YOU;
    } else if (e.type === EntityType.SINK_LETTERS) {
      return FlagBitPositions.SINK;
    } else if (e.type === EntityType.BURN_LETTERS) {
      return FlagBitPositions.BURN;
    } else {
      return -1;
    }
  }
}
