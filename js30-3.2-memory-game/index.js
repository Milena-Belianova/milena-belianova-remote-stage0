const cards = document.querySelectorAll('.memory-card');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const btnBack = document.querySelector('.back');
const btnPlayAgain = document.querySelector('.play-again');
const refresh = document.querySelector('.refresh');
const pairNumBtns = document.querySelectorAll('.pair-num');
const memoryGame = document.querySelector('.memory-game');
const movesCountSpan = document.querySelectorAll('.moves-count');
const list = document.querySelector('.list');
const minuteSpans = document.querySelectorAll('.minute');
const secondSpans = document.querySelectorAll('.second');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard;
let secondCard;
let numCardPairOpen = 0;
let cardsOnBoard = 20;
let movesCount = 0;
let minute = 0;
let second = 0;
let millisecond = 0;
let cron;
let results = [];
let time = { min: 0, sec: 0 };

const formatTime = ({ min, sec }) => `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

// Timer
function pause() {
  clearInterval(cron);
}

function returnData(input) {
  return input > 9 ? input : `0${input}`;
}

function timer() {
  if ((millisecond += 10) === 1000) {
    millisecond = 0;
    second += 1;
  }
  if (second === 60) {
    second = 0;
    minute += 1;
  }

  const min = returnData(minute);
  const sec = returnData(second);

  minuteSpans.forEach((span) => {
    span.innerText = min;
  });
  secondSpans.forEach((span) => {
    span.innerText = sec;
  });
  time = { min, sec };
}

function start() {
  pause();
  cron = setInterval(() => {
    timer();
  }, 10);
}

function reset() {
  pause();
  minute = 0;
  second = 0;
  millisecond = 0;
  minuteSpans.forEach((span) => {
    span.innerText = '00';
  });
  secondSpans.forEach((span) => {
    span.innerText = '00';
  });
  time = { min: 0, sec: 0 };
}

/// /////////
const displayMoves = (moves) => {
  movesCountSpan.forEach((span) => {
    span.innerHTML = moves;
  });
};

const shuffle = () => {
  cards.forEach((card) => {
    const randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
};

shuffle();

const openResultModal = () => {
  setTimeout(() => (modal.style.display = 'flex'), 350);
};

const toSec = ({ min, sec }) => min * 60 + sec;

const displayResults = () => {
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach((item) => item.remove());

  const sorted = [...results].sort((a, b) => {
    const deltaMoves = a.moves - b.moves;

    if (deltaMoves !== 0) {
      return deltaMoves;
    }

    return toSec(a.time) - toSec(b.time);
  });

  sorted.forEach(({ moves, time }) => {
    const liTag = document.createElement('li');
    const node = document.createTextNode(
      `Moves: ${moves}, Time: ${formatTime(time)}`,
    );

    liTag.appendChild(node);

    list.appendChild(liTag).classList.add('list-item');
  });
};

const resetBoard = () => {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

const checkForMatch = () => {
  const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
};

const flipCard = (event) => {
  if (lockBoard) return;
  if (event.target.parentElement === firstCard) return;

  event.target.parentElement.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = event.target.parentElement;
    start();
    return;
  }
  // second click
  secondCard = event.target.parentElement;

  // count moves
  movesCount += 1;
  displayMoves(movesCount);

  checkForMatch();
};

const disableCards = () => {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  numCardPairOpen += 2;

  if (numCardPairOpen === cardsOnBoard) {
    pause();
    results.push({ moves: movesCount, time: { ...time } });
    if (results.length > 10) {
      results.shift();
    }
    displayResults();

    openResultModal();
  }

  resetBoard();
};

const unflipCards = () => {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
};

const hideModal = () => {
  modal.style.display = 'none';
};

const refreshBoard = () => {
  reset();
  resetBoard();
  numCardPairOpen = 0;
  movesCount = 0;
  displayMoves(movesCount);
  cards.forEach((card) => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffle();
};

const newGame = () => {
  hideModal();
  refreshBoard();
};

cards.forEach((card) => card.addEventListener('click', flipCard));

modalClose.addEventListener('click', hideModal);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

btnBack.addEventListener('click', hideModal);

btnPlayAgain.addEventListener('click', newGame);
refresh.addEventListener('click', refreshBoard);

const cardPairsDisplay = (event) => {
  refreshBoard();
  const sevenCards = [...cards].slice(6); // все карты, кроме 3х первых
  const fourCards = [...cards].slice(12);

  if (event.target.classList.contains('pair-num-three')) {
    cardsOnBoard = 6;
    sevenCards.forEach((card) => card.classList.add('hidden'));
    memoryGame.style.width = '332px';
  }

  if (event.target.classList.contains('pair-num-six')) {
    cardsOnBoard = 12;
    cards.forEach((card) => card.classList.remove('hidden'));
    fourCards.forEach((card) => card.classList.add('hidden'));
    memoryGame.style.width = '442px';
  }

  if (event.target.classList.contains('pair-num-ten')) {
    cardsOnBoard = 20;
    cards.forEach((card) => card.classList.remove('hidden'));
    memoryGame.style.width = '552px';
  }
};

pairNumBtns.forEach((btn) => btn.addEventListener('click', cardPairsDisplay));

// Local storage
const setLocalStorage = () => {
  localStorage.setItem('results', JSON.stringify(results));
};
window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
  if (localStorage.getItem('results')) {
    results = JSON.parse(localStorage.getItem('results'));
  }
};
window.addEventListener('load', getLocalStorage);
