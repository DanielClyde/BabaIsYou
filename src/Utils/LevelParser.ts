import { GameGrid } from './../Game/GameGrid';
import { Entity, EntityType } from './../Game/Entities/Entity';

export class LevelParser {

  constructor() { }

  public async parseFromFile(filePath: string, gridSize = 20, level = 1): Promise<GameGrid> {
    const levels: GameGrid[] = [];
    const res = await fetch(filePath);
    let text = await res.text();
    text = text.replace(/Level-\d*/gm, '');
    text = text.replace(/\d* x \d*/gm, '');
    while (text.length) {
      let parsed = this.parse(text, gridSize);
      levels.push(parsed.grid);
      text = parsed.text;
    }
    return levels[level - 1];
  }

  private parse(text: string, gridSize: number): { grid: GameGrid, text: string } {
    const grid = new GameGrid(gridSize);
    text = this.populateGrid(text, grid, true);
    text = this.populateGrid(text, grid);
    return { grid, text };
  }

  private populateGrid(text: string, grid: GameGrid, skipFirstTwo = false) {
    // Remove first two rows
    let r;
    if (skipFirstTwo) {
      r = this.getNextRow(text);
      text = text.substring(r.length + 2, text.length);
      r = this.getNextRow(text);
      text = text.substring(r.length + 2, text.length);
    }

    // get grid
    for (let y = 0; y < grid.size; y++) {
      r = this.getNextRow(text);
      text = text.substring(r.length + 2, text.length);
      for (let x = 0; x < grid.size; x++) {
        const e = Entity.FromType(r[x] as EntityType, { x, y });
        if (e) {
          grid.insert(x, y, e);
        }
      }
    }
    return text;
  }

  private getNextRow(text: string) {
    const chars = [];
    let i = 0;
    while (text.length && text.charAt(i) != '\r') {
      chars.push(text.charAt(i));
      i++;
    }
    return chars;
  }

}
