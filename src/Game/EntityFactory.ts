import { BurnLetters } from './Entities/BurnLetters';
import { Lava } from './Entities/Lava';
import { SinkLetters } from './Entities/SinkLetters';
import { WaterLetters } from './Entities/WaterLetters';
import { FlagLetters } from './Entities/FlagLetters';
import { YouLetters } from './Entities/YouLetters';
import { StopLetters } from './Entities/StopLetters';
import { WinLetters } from './Entities/WinLetters';
import { PushLetters } from './Entities/PushLetters';
import { WallLetters } from './Entities/WallLetters';
import { RockLetters } from './Entities/RockLetters';
import { IsLetters } from './Entities/IsLetters';
import { BabaLetters } from './Entities/BabaLetters';
import { Flag } from './Entities/Flag';
import { Rock } from './Entities/Rock';
import { Floor } from './Entities/Floor';
import { Wall } from './Entities/Wall';
import { Baba } from './Entities/Baba';
import { Hedge } from './Entities/Hedge';
import { Coordinates } from './components/Position';
import { EntityType } from './Entities/Entity';
import { Water } from './Entities/Water';
import { LavaLetters } from './Entities/LavaLetters';

export function EntityFromEntityType(type: EntityType, coords: Coordinates) {
  if (type === EntityType.HEDGE) {
    return Hedge.Create(coords);
  } else if (type === EntityType.BABA) {
    return Baba.Create(coords);
  } else if (type === EntityType.WALL) {
    return Wall.Create(coords);
  } else if (type === EntityType.FLOOR) {
    return Floor.Create(coords);
  } else if (type === EntityType.ROCK) {
    return Rock.Create(coords);
  } else if (type === EntityType.FLAG) {
    return Flag.Create(coords);
  } else if (type === EntityType.BABA_LETTERS) {
    return BabaLetters.Create(coords);
  } else if (type === EntityType.IS_LETTERS) {
    return IsLetters.Create(coords);
  } else if (type === EntityType.ROCK_LETTERS) {
    return RockLetters.Create(coords);
  } else if (type === EntityType.WALL_LETTERS) {
    return WallLetters.Create(coords);
  } else if (type === EntityType.PUSH_LETTERS) {
    return PushLetters.Create(coords)
  } else if (type === EntityType.WIN_LETTERS) {
    return WinLetters.Create(coords);
  } else if (type === EntityType.STOP_LETTERS) {
    return StopLetters.Create(coords);
  } else if (type === EntityType.YOU_LETTERS) {
    return YouLetters.Create(coords);
  } else if (type === EntityType.FLAG_LETTERS) {
    return FlagLetters.Create(coords);
  } else if (type === EntityType.WATER_LETTERS) {
    return WaterLetters.Create(coords);
  } else if (type === EntityType.WATER) {
    return Water.Create(coords);
  } else if (type === EntityType.SINK_LETTERS) {
    return SinkLetters.Create(coords);
  } else if (type === EntityType.LAVA) {
    return Lava.Create(coords);
  } else if (type === EntityType.LAVA_LETTERS) {
    return LavaLetters.Create(coords);
  } else if (type === EntityType.BURN_LETTERS) {
    return BurnLetters.Create(coords);
  } else {
    return null;
  }
}
