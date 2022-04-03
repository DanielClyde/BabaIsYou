import { GameModel } from './Game/GameModel';
import './style.css'

const gameModel = new GameModel();
gameModel.init().then(() => {
  gameModel.startLoop();
});
