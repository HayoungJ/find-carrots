'use strict';

const gameArea = document.querySelector('.game');
const playableArea = document.querySelector('.find-carrot');
const playButton = document.querySelector('.menu__button');
const counter = document.querySelector('.menu__counter');
const timer = document.querySelector('.menu__timer');
const target = document.createElement('img');
const obstacle = document.createElement('img');
const popUpWrap = document.querySelector('.pop-up-wrap');
const diffPopUp = document.querySelector('.pop-up__select-diff');
const restart = document.querySelector('.pop-up__restart');
let checkTimer;
let remainingTarget = 0;
let remainingTime = 10;

target.setAttribute('src', 'img/carrot.png');
target.setAttribute('alt', 'carrot');
target.setAttribute('data-type', 'target');
obstacle.setAttribute('src', 'img/bug.png');
obstacle.setAttribute('alt', 'bug');
obstacle.setAttribute('data-type', 'obstacle');

class Image {
  constructor(target, obstacle, height) {
    this.target = target;
    this.obstacle = obstacle;
    this.height = height;
  }

  setImageCoord = (item) => {
    const xMax = 700 - item.naturalWidth;
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

const changePopUpStatus = (type, status) => {
  const popUp = document.querySelector(`.pop-up--${type}`);

  popUpWrap.style.display = status;
  popUp.style.display = status;
};

const setDifficulty = (selectedDiff) => {
  const gameImage = new Image();

  if (selectedDiff) {
    switch (selectedDiff) {
      case 'easy':
        gameArea.style.height = '500px';
        (gameImage.target = 5),
          (gameImage.obstacle = 5),
          (gameImage.height = 250);
        remainingTarget = 5;
        break;
      case 'medium':
        gameArea.style.height = '600px';
        (gameImage.target = 10),
          (gameImage.obstacle = 10),
          (gameImage.height = 350);
        remainingTarget = 10;
        break;
      case 'extreme':
        gameArea.style.height = '600px';
        (gameImage.target = 10),
          (gameImage.obstacle = 15),
          (gameImage.height = 350);
        remainingTarget = 10;
        break;
    }
    counter.innerText = remainingTarget;
  }

  return gameImage;
};

playButton.addEventListener('click', () => {
  if (playButton.dataset.action === 'start') {
    changePopUpStatus('difficulty', 'block');
  } else if (playButton.dataset.action === 'pause') {
    changePopUpStatus('retry', 'block');
    clearInterval(checkTimer);
  }
});

diffPopUp.addEventListener('click', (event) => {
  const selectedDiff = event.target.dataset.id;

  if (selectedDiff) {
    const gameImage = setDifficulty(event.target.dataset.id);
    gameImage.setImage(target, 'target');
    gameImage.setImage(obstacle, 'obstacle');
    playButton.classList.remove('menu__button--start');
    playButton.classList.add('menu__button--pause');
    playButton.dataset.action = 'pause';

    changePopUpStatus('difficulty', 'none');

    checkTimer = window.setInterval(() => {
      timer.innerText = `00:0${--remainingTime}`;

      if (remainingTime === 0) {
        changePopUpStatus('fail', 'block');
        clearInterval(checkTimer);
      }
    }, 1000);
  }
});

playableArea.addEventListener('click', () => {
  if (event.target.dataset.type === 'target') {
    event.target.remove();
    counter.innerText = --remainingTarget;

    const remainEl = playableArea.childNodes;
    for (const el of remainEl) {
      if (el.dataset.type === 'target') break;
      else {
        changePopUpStatus('win', 'block');
        clearInterval(checkTimer);
        break;
      }
    }
  } else if (event.target.dataset.type === 'obstacle') {
    changePopUpStatus('fail', 'block');
    clearInterval(checkTimer);
  }
});
popUpWrap.addEventListener('click', () => {
  if (event.target.dataset.work === 'restart') {
    location.reload();
  } else if (event.target.dataset.work === 'close') {
    const popUpId = event.target.closest(`.pop-up`).dataset.id;
    changePopUpStatus(popUpId, 'none');

    if (popUpId === 'retry') {
      checkTimer = window.setInterval(() => {
        timer.innerText = `00:0${--remainingTime}`;

        if (remainingTime === 0) {
          changePopUpStatus('fail', 'block');
          clearInterval(checkTimer);
        }
      }, 1000);
    }
  }
});
