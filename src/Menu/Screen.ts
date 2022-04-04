export enum ScreenType {
  MAIN_MENU = 'main-menu-screen',
  NEW_GAME = 'game-play-screen',
  CONTROLS = 'controls-screen',
  CREDITS = 'credits-screen',
}

export abstract class Screen {
  abstract type: ScreenType;

}
