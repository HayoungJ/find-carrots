import * as sound from './sound.js';

export default class Field {
  constructor(carrotCount, bugCount, height) {
    this.gameSection = document.querySelector('.game');
    this.menuField = document.querySelector('.menu');
    this.playField = document.querySelector('.play-field');

    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.height = height;

    this.playField.addEventListener('click', this.onClick);
  }

  setClickEventListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  clean() {
    this.playField.innerHTML = '';
  }

  set = () => {
    this.gameSection.style.height = `${this.height}px`;
    this.playFieldRec = this.playField.getBoundingClientRect();
    this._addItem('carrot', 'img/carrot.png');
    this._addItem('bug', 'img/bug.png');
  };

  _setItemCoord() {
    const xMax = this.playFieldRec.width - 80;
    const yMax = this.playFieldRec.height - 80;
    const x = Math.floor(Math.random() * xMax);
    const y = Math.floor(Math.random() * yMax);
    return [x, y];
  }

  _addItem(itemName, itemPath) {
    for (let i = 0; i < this[`${itemName}Count`]; i++) {
      const item = document.createElement('img');
      item.setAttribute('src', itemPath);
      item.setAttribute('data-type', itemName);
      const [x, y] = this._setItemCoord(item);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.playField.append(item);
    }
  }

  onClick = (event) => {
    if (event.target.dataset.type === 'carrot') {
      sound.playCarrot();
      event.target.remove();
      this.onItemClick && this.onItemClick('carrot');
    } else if (event.target.dataset.type === 'bug') {
      sound.playBug();
      this.onItemClick && this.onItemClick('bug');
    }
  };
}
