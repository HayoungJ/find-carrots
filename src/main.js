'use strict';

import { ReStartPopUp, ClosablePopUp } from './popup.js';
import { Game, Reason } from './game.js';

const PLAY_TIME = 10;

const restartPopUp = new ReStartPopUp();
const closablePopUp = new ClosablePopUp();
const game = new Game(PLAY_TIME);
game.setPauseEventListener(() => {
  closablePopUp.open(Reason.retry.message);
});
game.setStopEventListener((reason) => {
  let message;
  switch (reason) {
    case Reason.fail.type:
      message = Reason.fail.message;
      break;
    case Reason.win.type:
      message = Reason.win.message;
      break;
    default:
      throw new Error('not valid reason');
  }
  restartPopUp.open(message);
});
restartPopUp.setRestartListener(() => game.selectDifficulty());
closablePopUp.setRestartListener(() => game.selectDifficulty());
closablePopUp.setCloseListener(() => game.startTimer());
