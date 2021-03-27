'use strict';

import * as sound from './sound.js';

export class ReStartPopUp {
  constructor() {
    this.wrap = document.querySelector('.pop-up-wrap--restart');
    this.popUp = this.wrap.querySelector('.pop-up');
    this.content = this.wrap.querySelector('.pop-up__content');
    this.restart = this.wrap.querySelector('.pop-up__restart');
    this.close = this.wrap.querySelector('.pop-up__close');

    this.restart.addEventListener('click', () => {
      sound.playButton();
      this.onRestart && this.onRestart();
      this.hide();
    });
  }

  setRestartListener(onRestart) {
    this.onRestart = onRestart;
  }

  setContentWithText(content) {
    content && (this.content.innerHTML = content);
  }

  open(content) {
    this.close.style.visibility = 'hidden';
    this.setContentWithText(content);
    this.wrap.classList.remove('pop-up-wrap--hide');
  }

  hide() {
    this.wrap.classList.add('pop-up-wrap--hide');
  }
}

export class ClosablePopUp extends ReStartPopUp {
  constructor() {
    super();
    this.close.addEventListener('click', () => {
      this.onClose && this.onClose();
      this.hide();
    });
  }

  setCloseListener(onClose) {
    this.onClose = onClose;
  }

  open(content) {
    super.open(content);
    this.close.style.visibility = 'visible';
  }
}

export class DifficultyPopUp {
  constructor() {
    this.wrap = document.querySelector('.pop-up-wrap--difficulty');
    this.selectable = this.wrap.querySelector('.pop-up__select-difficulty');
    this.close = this.wrap.querySelector('.pop-up__close');

    this.selectable.addEventListener('click', (event) => {
      this.select = event.target.dataset.id;
      if (this.select) {
        sound.playButton();
        this.setDifficulty && this.setDifficulty(this.select);
        this.hide();
        this.startGame && this.startGame();
      }
    });
    this.close.addEventListener('click', () => {
      this.hide();
    });
  }

  setSelectEventListener(setDifficulty) {
    this.setDifficulty = setDifficulty;
  }

  setStartEventListener(startGame) {
    this.startGame = startGame;
  }

  open() {
    this.wrap.classList.remove('pop-up-wrap--hide');
  }

  hide() {
    this.wrap.classList.add('pop-up-wrap--hide');
  }
}
