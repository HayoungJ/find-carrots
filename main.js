'use strict';

const TIME = 10;
const TARGET_IMG_PATH = 'img/carrot.png';
const OBSTACLE_IMG_PATH = 'img/bug.png';
const E_SETTING = { target: 5, obstacle: 5, height: 500 };
const M_SETTING = { target: 10, obstacle: 10, height: 600 };
const EX_SETTING = { target: 10, obstacle: 15, height: 600 };
const WIDTH = 700;
const CLOSABLE = ['retry'];
const RESULT_TEXT = {
  retry: 'Will you try again?',
  win: 'You win🎉 Will you try again?',
  fail: 'You Lose😭 Will you try again?',
};

const gameFrame = document.querySelector('.game');
const menuArea = document.querySelector('.menu');
const playableArea = document.querySelector('.find-carrot');
const playButton = document.querySelector('.menu__button');
const counter = document.querySelector('.menu__counter');
const timer = document.querySelector('.menu__timer');
const popUpWrap = document.querySelector('.pop-up-wrap');
const defaultPopUp = document.querySelector('.pop-up--text');
const diffPopUp = document.querySelector('.pop-up--difficulty');
const popUpTitle = document.querySelector('.pop-up__title');
const restartBtn = document.querySelector('.pop-up__restart');
const closeBtn = document.querySelector('.pop-up__close');

const target = document.createElement('img');
const obstacle = document.createElement('img');

const bgSound = new Audio('sound/bg.mp3');
const targetSound = new Audio('sound/carrot_pull.mp3');
const obstacleSound = new Audio('sound/bug_pull.mp3');
const buttonSound = new Audio('sound/alert.wav');
const winSound = new Audio('sound/game_win.mp3');

let firstGame = true;
let checkTimer = undefined;
let remainingTarget = 0;
let remainingTime = TIME;

target.setAttribute('src', TARGET_IMG_PATH);
target.setAttribute('data-type', 'target');
obstacle.setAttribute('src', OBSTACLE_IMG_PATH);
obstacle.setAttribute('data-type', 'obstacle');

bgSound.setAttribute('loop', 'true');

class Image {
  constructor(setting) {
    this.target = setting.target;
    this.obstacle = setting.obstacle;
    this.height = setting.height;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value - menuArea.clientHeight;
  }

  setImageCoord = (item) => {
    const xMax = WIDTH - item.naturalWidth;
    const yMax = this.height - item.naturalHeight;
    this.x = Math.floor(Math.random() * xMax);
    this.y = Math.floor(Math.random() * yMax);
  };

  setImage = (item, itemName) => {
    for (let i = 0; i < this[itemName]; i++) {
      this.setImageCoord(item);
      item.style.left = `${this.x}px`;
      item.style.top = `${this.y}px`;
      playableArea.append(item.cloneNode());
    }
  };
}

class PopUpWithTitle {
  constructor(type, text) {
    this.type = type;
    this.text = text;
  }

  get closable() {
    if (CLOSABLE.includes(this.type)) return true;
    else return false;
  }

  openPopUp = () => {
    popUpTitle.innerText = this.text;
    popUpWrap.classList.remove('hide');
    defaultPopUp.classList.remove('hide');
    const hideButton = this.closable ? 'visible' : 'hidden';
    defaultPopUp.querySelector('.pop-up__close').style.visibility = hideButton;
  };
}

const openDiffPopUp = () => {
  popUpWrap.classList.remove('hide');
  diffPopUp.classList.remove('hide');
};

const closePopUp = () => {
  popUpWrap.classList.add('hide');
  defaultPopUp.classList.add('hide');
  diffPopUp.classList.add('hide');
};

const initGame = () => {
  closePopUp();
  openDiffPopUp();

  showStartButton(true);
  playableArea.innerHTML = '';
  timer.innerText = `00:${TIME}`;
  remainingTime = TIME;
  counter.innerText = '0';
};

const finishGame = (result) => {
  console.log(RESULT_TEXT[result]);
  const resultPopUp = new PopUpWithTitle(result, RESULT_TEXT[result]);
  resultPopUp.openPopUp();
  stopTimer();
};

const setDifficulty = (selectedDiff) => {
  diffPopUp.classList.remove('hide');

  let setting = {};

  if (selectedDiff) {
    switch (selectedDiff) {
      case 'easy':
        gameFrame.style.height = `${E_SETTING.height}px`;
        setting = E_SETTING;
        remainingTarget = E_SETTING.target;
        break;
      case 'medium':
        gameFrame.style.height = `${M_SETTING.height}px`;
        setting = M_SETTING;
        remainingTarget = M_SETTING.target;
        break;
      case 'extreme':
        gameFrame.style.height = `${EX_SETTING.height}px`;
        setting = EX_SETTING;
        remainingTarget = EX_SETTING.target;
        break;
    }
    counter.innerText = remainingTarget;
  }

  return new Image(setting);
};

const showStartButton = (show) => {
  if (show) {
    playButton.classList.remove('menu__button--pause');
    playButton.classList.add('menu__button--start');
    playButton.dataset.action = 'start';
  } else {
    playButton.classList.remove('menu__button--start');
    playButton.classList.add('menu__button--pause');
    playButton.dataset.action = 'pause';
  }
};

const startTimer = () => {
  checkTimer = setInterval(() => {
    timer.innerText = `00:0${--remainingTime}`;

    if (remainingTime === 0) {
      const failPopUp = new PopUpWithTitle('fail', RESULT_TEXT.fail);
      failPopUp.openPopUp();
      clearInterval(checkTimer);
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(checkTimer);
};

playButton.addEventListener('click', () => {
  if (playButton.dataset.action === 'start') {
    buttonSound.play();

    if (firstGame) {
      bgSound.play();
      firstGame = false;
    }

    initGame();
  } else if (playButton.dataset.action === 'pause') {
    const retryPopUp = new PopUpWithTitle('retry', RESULT_TEXT.retry);
    retryPopUp.openPopUp();

    stopTimer();
    buttonSound.play();
  }
});

diffPopUp.addEventListener('click', (event) => {
  const selectedDiff = event.target.dataset.id;

  if (selectedDiff) {
    buttonSound.play();
    const gameImage = setDifficulty(event.target.dataset.id);
    gameImage.setImage(target, 'target');
    gameImage.setImage(obstacle, 'obstacle');

    showStartButton(false);
    closePopUp();

    startTimer();
  }
});

playableArea.addEventListener('click', () => {
  if (event.target.dataset.type === 'target') {
    targetSound.play();

    event.target.remove();
    counter.innerText = --remainingTarget;

    !remainingTarget && finishGame('win');
  } else if (event.target.dataset.type === 'obstacle') {
    obstacleSound.play();
    finishGame('fail');
  }
});

restartBtn.addEventListener('click', () => {
  buttonSound.play();
  initGame();
});

popUpWrap.addEventListener('click', () => {
  if (event.target.dataset.work === 'close') {
    closePopUp();

    if (event.target.closest('.pop-up--text')) startTimer();
  }
});
