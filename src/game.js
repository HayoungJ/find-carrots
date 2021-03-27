import { DifficultyPopUp } from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const DifficultySetting = Object.freeze({
  easy: {
    carrotCount: 5,
    bugCount: 5,
    height: 500,
  },
  medium: {
    carrotCount: 10,
    bugCount: 10,
    height: 600,
  },
  expert: {
    carrotCount: 10,
    bugCount: 15,
    height: 600,
  },
});

export const Reason = Object.freeze({
  win: {
    type: 'win',
    message: 'You win🎉 Will you try again?',
  },
  fail: {
    type: 'fail',
    message: 'You Lose😭 Will you try again?',
  },
  retry: {
    type: 'retry',
    message: 'Will you try again?',
  },
});

export class Game {
  constructor(playTime) {
    this.playTime = playTime;

    this.gameSection = document.querySelector('.game');
    this.menuField = document.querySelector('.menu');
    this.playField = document.querySelector('.play-field');
    this.playButton = document.querySelector('.menu__button');
    this.counter = document.querySelector('.menu__counter');
    this.timer = document.querySelector('.menu__timer');

    this.firstGame = true;
    this.checkTimer = undefined;
    this.remainingTarget = 0;
    this.remainingTime = 10;

    this.gameField = new Field();
    this.gameField.setClickEventListener(this.onItemClick);

    this.difficultyPopUp = new DifficultyPopUp();
    this.difficultyPopUp.setSelectEventListener(this.setDifficulty);
    this.difficultyPopUp.setStartEventListener(this.gameField.init);

    this.playButton.addEventListener('click', () => {
      if (this.playButton.dataset.action === 'start') {
        sound.playButton();
        this.selectDifficulty();
      } else if (this.playButton.dataset.action === 'pause') {
        sound.playButton();
        this.pause('retry');
      }
    });
  }

  setPauseEventListener(onPause) {
    this.onPause = onPause;
  }

  setStopEventListener(onStop) {
    this.onStop = onStop;
  }

  init() {
    this.remainingTime = this.playTime;
    this.timer.innerText = `00:${this.remainingTime}`;
    this.counter.innerText = '0';
    this.playField.innerHTML = '';
    this.changePlayButtonStatus(true);
  }

  start() {
    this.gameField.init();
    this.startTimer();
    this.changePlayButtonStatus(false);
  }

  pause() {
    this.stopTimer();
    this.onPause();
  }

  stop(reason) {
    this.onStop(reason);
    this.stopTimer();
    this.changePlayButtonStatus(true);
  }

  selectDifficulty() {
    if (this.firstGame) {
      sound.playBackground();
      this.firstGame = false;
    }
    this.difficultyPopUp.open();
    this.init();
  }

  setDifficulty = (select) => {
    if (select) {
      let setting = undefined;
      switch (select) {
        case 'easy':
          setting = DifficultySetting.easy;
          break;
        case 'medium':
          setting = DifficultySetting.medium;
          break;
        case 'extreme':
          setting = DifficultySetting.expert;
          break;
      }
      this.gameField.carrotCount = setting.carrotCount;
      this.gameField.bugCount = setting.bugCount;
      this.gameField.height = setting.height;

      this.remainingTarget = setting.carrotCount;
      this.counter.innerText = `${setting.carrotCount}`;
      this.changePlayButtonStatus(false);
      this.start();
    }
  };

  changePlayButtonStatus(showPlay) {
    if (showPlay) {
      this.playButton.classList.remove('menu__button--pause');
      this.playButton.classList.add('menu__button--start');
      this.playButton.dataset.action = 'start';
    } else {
      this.playButton.classList.remove('menu__button--start');
      this.playButton.classList.add('menu__button--pause');
      this.playButton.dataset.action = 'pause';
    }
  }

  startTimer() {
    this.checkTimer = setInterval(() => {
      this.timer.innerText = `00:0${--this.remainingTime}`;

      if (this.remainingTime === 0) {
        this.stop('fail');
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.checkTimer);
  }

  onItemClick = (type) => {
    if (type === 'carrot') {
      this.counter.innerText = --this.remainingTarget;
      !this.remainingTarget && this.stop('win');
    } else if (type === 'bug') {
      this.stop('fail');
    }
  };
}
