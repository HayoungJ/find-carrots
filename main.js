'use strict';

const game = document.querySelector('.game');
const frame = document.querySelector('.find-carrot');
const playButton = document.querySelector('.menu__button');
const target = document.createElement('img');
const obstacle = document.createElement('img');
const diff = document.querySelector('.pop-up__select-diff');
const restart = document.querySelector('.pop-up__restart');

target.setAttribute('src', 'img/carrot.png');
target.setAttribute('alt', 'carrot');
obstacle.setAttribute('src', 'img/bug.png');
obstacle.setAttribute('alt', 'bug');

class Image {
  constructor(target, obstacle, height) {
    this.target = target;
    this.obstacle = obstacle;
    this.height = height;
  }

  createImages = () => {
    this.setImage(target, 'target', this.target);
    this.setImage(obstacle, 'obstacle', this.obstacle);
  };

  setImageCoord = (item) => {
    const xMax = 700 - item.naturalWidth;
    const yMax = this.height - item.naturalHeight;
    this.x = Math.floor(Math.random() * xMax);
    this.y = Math.floor(Math.random() * yMax);
  };

  setImage = (item, itemName, number) => {
    for (let i = 0; i < number; i++) {
      item.setAttribute('class', itemName);
      this.setImageCoord(item);
      item.style.left = `${this.x}px`;
      item.style.top = `${this.y}px`;
      frame.append(item.cloneNode());
    }
  };
}

const changePopUpStatus = (type, status) => {
  const popUp = document.querySelector(`.pop-up--${type}`);

  popUp.style.display = status;
};

const setDifficulty = (event) => {
  const selected = event.target.dataset.id;
  const diff = new Image();

  switch (selected) {
    case 'easy':
      game.style.height = '500px';
      (diff.target = 5), (diff.obstacle = 5), (diff.height = 250);
      changePopUpStatus('difficulty', 'none');
      break;
    case 'medium':
      game.style.height = '600px';
      (diff.target = 10), (diff.obstacle = 10), (diff.height = 350);
      changePopUpStatus('difficulty', 'none');
      break;
    case 'extreme':
      game.style.height = '600px';
      (diff.target = 10), (diff.obstacle = 15), (diff.height = 350);
      changePopUpStatus('difficulty', 'none');
      break;
  }

  return diff;
};

playButton.addEventListener('click', () => {
  if (playButton.classList[1] === 'menu__button--start') {
    changePopUpStatus('difficulty', 'block');
  } else if (playButton.classList[1] === 'menu__button--pause') {
    changePopUpStatus('retry', 'block');
  }
});
diff.addEventListener('click', (event) => {
  let diff = new Image();
  diff = setDifficulty(event);
  diff.createImages();
  playButton.classList.remove('menu__button--start');
  playButton.classList.add('menu__button--pause');
});
frame.addEventListener('click', () => {
  if (event.target.className === 'target') {
    event.target.remove();
  } else if (event.target.className === 'obstacle') {
    changePopUpStatus('fail', 'block');
  } else if (event.target.className === 'fas fa-times-circle') {
    const popUp = event.target.closest('.pop-up');
    popUp.style.display = 'none';
  }
});
document.addEventListener('click', () => {
  if (event.target.closest('.pop-up__restart')) {
    location.reload();
  }
});
