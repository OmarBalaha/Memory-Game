let duration;
let cardsContainer;
let cards;
let orderRange;
let triesElement;

(function startGame() {
  duration = 1000; // ms
  cardsContainer = document.querySelector(".cards");
  cards = Array.from(document.querySelectorAll(".card"));
  orderRange = Array.from(Array(cards.length).keys());
  triesElement = document.querySelector("#wrong-tries-count");
  triesElement.innerHTML = 0;

  shuffle(orderRange);
  getPlayerName();
  initializeGame();
})();

// Get Player Name
function getPlayerName() {
  document.querySelector("#start-btn").addEventListener("click", function () {
    let playerName = prompt("What's your name ?");
    if (playerName == null || playerName == "") {
      document.querySelector("#player-name").innerHTML = "Unknown";
    } else {
      document.querySelector("#player-name").innerHTML = playerName;
    }

    document.querySelector(".overlay.start").classList.add("hide");

    firstLookFlip(cards);
  });
}

// Shuffle Cards and add event listeners
function initializeGame() {
  cards.forEach((card, index) => {
    card.style.order = orderRange[index];
    card.addEventListener("click", function () {
      flipCard(card);
    });
  });
}

// Show cards first time
function firstLookFlip(cards) {
  cards.map((card) => card.classList.add("is-face-flipped"));

  setTimeout(() => {
    cards.map((card) => card.classList.add("is-back-flipped"));
    cards.map((card) => card.classList.remove("is-face-flipped"));
  }, duration);

  // To test winning condition
  // cards.map((card) => card.classList.add('has-match'));
  // checkWin();
}

// Shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function flipCard(card) {
  card.classList.remove("is-back-flipped");
  card.classList.add("is-face-flipped");
  let flippedCards = cards.filter((flippedCard) =>
    flippedCard.classList.contains("is-face-flipped")
  );

  if (flippedCards.length == 2) {
    stopClicking();
    checkMatch(flippedCards[0], flippedCards[1]);
  }
}

function stopClicking() {
  cardsContainer.classList.add("no-clicking");

  setTimeout(() => {
    cardsContainer.classList.remove("no-clicking");
  }, duration);
}

function checkMatch(firstCard, secondCard) {
  if (firstCard.dataset.cardlabel === secondCard.dataset.cardlabel) {
    firstCard.classList.remove("is-face-flipped");
    secondCard.classList.remove("is-face-flipped");

    firstCard.classList.add("has-match");
    secondCard.classList.add("has-match");

    checkWin();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstCard.classList.remove("is-face-flipped");
      secondCard.classList.remove("is-face-flipped");
      firstCard.classList.add("is-back-flipped");
      secondCard.classList.add("is-back-flipped");
    }, duration);
  }
}

function checkWin() {
  let cards = Array.from(document.querySelectorAll(".card"));
  let flippedCards = cards.filter((flippedCard) =>
    flippedCard.classList.contains("has-match")
  );

  if (flippedCards.length == cards.length) {
    document.querySelector(".overlay.start").classList.add("hide");
    document.querySelector(".overlay.win").classList.remove("hide");

    celebration();

    // document
    //   .querySelector("#restart-btn")
    //   .addEventListener("click", restartGame);
  }
}

// function restartGame() {
//   duration = 1000; // ms
//   cardsContainer = document.querySelector(".cards");
//   cards = Array.from(document.querySelectorAll(".card"));
//   orderRange = Array.from(Array(cards.length).keys());
//   triesElement = document.querySelector("#wrong-tries-count");
//   triesElement.innerHTML = 0;

//   cards.map((card) => card.classList.remove("has-match"));

//   shuffle(orderRange);
//   getPlayerName();
//   initializeGame();

//   document.querySelector(".overlay.win").classList.add("hide");
//   document.querySelector(".overlay.start").classList.remove("hide");
// }

function celebration() {
  //  Base Code From CodePen
  // https://codepen.io/mxbck/pen/BajJoJR

  const defaults = {
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(200 * particleRatio),
      })
    );
  }

  function confettiExplosion(origin) {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin,
    });
    fire(0.2, {
      spread: 60,
      origin,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      origin,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      origin,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      origin,
    });
  }

  const rect = document.querySelector(".overlay.win .overlay-content").getBoundingClientRect();
  const center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
  const origin = {
    x: center.x / window.innerWidth,
    y: center.y / window.innerHeight,
  };

  confettiExplosion(origin);
}
