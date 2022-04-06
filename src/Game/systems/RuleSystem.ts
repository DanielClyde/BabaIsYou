import { InputControlled, DefaultControls } from './../components/InputControlled';
import { FlagBitPositions, ValueFlags } from './../components/ValueFlags';
import { NounType, Noun } from './../components/Noun';
import { Position } from './../components/Position';
import { ComponentName } from "../components/Component";
import { Text, TextType } from "../components/Text";
import { Entity, EntityType } from "../Entities/Entity";
import { GameGrid } from "../GameGrid";
import { System } from "./System";
import isEqual from 'lodash/isEqual';

export class RuleSystem extends System {
  private rules: Array<[NounType, number]> = [];
  private previousRules: Array<[NounType, number]> = [];
  private nounsToSparkle: Array<NounType> = [];

  rulesChanged = false;

  public reset(): void {
    super.reset();
    this.rules = [];
    this.previousRules = [];
    this.nounsToSparkle = [];
    this.rulesChanged = false;
  }

  updateRules(entities: Entity[], grid: GameGrid) {
    this.rulesChanged = false;
    this.rules = [];
    this.nounsToSparkle = [];
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
            this.rules.push(
              topText.type === TextType.NOUN ?
                [this.getNounTypeFromEntity(top), this.getFlagNumberFromEntity(bottom)] :
                [this.getNounTypeFromEntity(bottom), this.getFlagNumberFromEntity(top)]);
          }
        }
        if (left && right) {
          const leftText = left.getComponent<Text>(ComponentName.Text);
          const rightText = right.getComponent<Text>(ComponentName.Text);
          if (leftText && rightText && leftText.type !== rightText.type) {
            this.rules.push(
              leftText.type === TextType.NOUN ?
                [this.getNounTypeFromEntity(left), this.getFlagNumberFromEntity(right)] :
                [this.getNounTypeFromEntity(right), this.getFlagNumberFromEntity(left)]
            );
          }
        }

      }
    });
    if (!isEqual(this.rules, this.previousRules)) {
      this.rulesChanged = true;
      this.nounsToSparkle = this.rules.filter((r) => {
        const i = this.previousRules.findIndex((old) => old[0] === r[0] && old[1] === r[1]);
       return (r[1] === FlagBitPositions.WIN || r[1] === FlagBitPositions.YOU) && i === -1;
      }).map((r) => r[0]);
      console.log('RULES', this.rules);
    }
    this.previousRules = this.rules;
  }

  update(elapsedTime: number, entity: Entity, gameGrid: GameGrid, sparkleCb: (x: number, y: number) => void): void {
    if (!this.rulesChanged) {
      return;
    } else {
      const [noun, flags, position] = [
        entity.getComponent<Noun>(ComponentName.Noun),
        entity.getComponent<ValueFlags>(ComponentName.ValueFlags),
        entity.getComponent<Position>(ComponentName.Position),
      ];
      if (noun && flags) {
        flags.value = flags.uneditableFlags;
        const rules = this.rules.filter((r) => r[0] === noun.type);
        rules.forEach((r) => {
          flags.setFlag(r[1], true);
        });
        const input = entity.getComponent<InputControlled>(ComponentName.InputControlled);
        if (input && !flags.getFlag(FlagBitPositions.YOU)) {
          entity.removeComponent(ComponentName.InputControlled);
        } else if (flags.getFlag(FlagBitPositions.YOU) && !input) {
          entity.addComponent(new InputControlled(DefaultControls));
        }
        if (this.nounsToSparkle.includes(noun.type)) {
          sparkleCb(position.coords.x, position.coords.y);
        }
      }
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
