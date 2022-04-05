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

  rulesChanged = false;

  public reset(): void {
    super.reset();
    this.rules = [];
    this.previousRules = [];
    this.rulesChanged = false;
  }

  updateRules(entities: Entity[], grid: GameGrid) {
    this.rulesChanged = false;
    this.rules = [];
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
            // console.log('RULE', top, bottom);
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
            // console.log('RULE', left, right);
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
    }
    this.previousRules = this.rules;
  }

  update(elapsedTime: number, entity: Entity, gameGrid: GameGrid, ...args: any[]): void {
    if (!this.rulesChanged) {
      return;
    } else {
      const [noun, flags] = [entity.getComponent<Noun>(ComponentName.Noun), entity.getComponent<ValueFlags>(ComponentName.ValueFlags)];
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
    } else {
      return -1;
    }
  }
}
