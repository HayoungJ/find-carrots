'use strict';

const bgSound = new Audio('sound/bg.mp3');
bgSound.loop = true;
const carrotSound = new Audio('sound/carrot_pull.mp3');
const bugSound = new Audio('sound/bug_pull.mp3');
const buttonSound = new Audio('sound/alert.wav');
const winSound = new Audio('sound/game_win.mp3');

export const playBackground = () => {
  playSound(bgSound);
};

export const stopBackground = () => {
  stopSound(bgSound);
};

export const playCarrot = () => {
  playSound(carrotSound);
};

export const playBug = () => {
  playSound(bugSound);
};

export const playButton = () => {
  playSound(buttonSound);
};

export const playWin = () => {
  playSound(winSound);
};

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play();
};

const stopSound = (sound) => {
  sound.pause();
};
