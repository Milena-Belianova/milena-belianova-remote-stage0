const navItems = document.querySelectorAll('.nav-item');
const main = document.querySelector('.main');
const btnPlay = document.querySelector('.button-play');
const audio = new Audio();
let lastTrek = 'forest';

const changeClassActive = (event) => {
  navItems.forEach((el) => el.classList.remove('active'));
  event.target.classList.add('active');
};

const changeImage = (event) => {
  main.style.backgroundImage = `url('./assets/img/${event.target.dataset.item}.jpg')`;
};

const addBtnClassPause = () => {
  btnPlay.classList.add('pause');
};

const playAudio = (event) => {
  if (event) {
    lastTrek = event.target.dataset.item;
  }
  audio.src = `./assets/audio/${lastTrek}.mp3`;
  audio.currentTime = 0;
  audio.play();
};

const onNavItemClick = (event) => {
  changeClassActive(event);
  changeImage(event);
  addBtnClassPause();
  playAudio(event);
};

const onBtnPlayClick = (event) => {
  if (event.target.classList.contains('pause')) {
    event.target.classList.remove('pause');
    audio.pause();
  } else {
    event.target.classList.add('pause');
    playAudio();
  }
};

navItems.forEach((el) => el.addEventListener('click', onNavItemClick));
btnPlay.addEventListener('click', onBtnPlayClick);
