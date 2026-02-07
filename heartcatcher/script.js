const game = document.getElementById("game");
const bunny = document.getElementById("bunny");
const scoreEl = document.getElementById("score");

const floatingText = document.getElementById("floatingText");
const floatingImage = document.getElementById("floatingImage");
const floatingImg = document.getElementById("floatingImg");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const questionBox = document.getElementById("questionBox");
const questionImg = document.getElementById("questionImg");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const choicesEl = document.querySelector('.choices');

const bgMusic = document.getElementById("bgMusic");
const catchSound = document.getElementById("catchSound");
const rewardSound = document.getElementById("rewardSound");

let score = 0;
let speed = 4;
let gameStarted = false;
let gameEnded = false;

startBtn.onclick = () => {
  startScreen.style.display = "none";
  bgMusic.volume = 0.4;
  bgMusic.play();
  gameStarted = true;
  if (questionBox) {
    questionBox.style.display = 'none';
    questionBox.classList.add('hidden');
  }
};

// Desktop mouse control
document.addEventListener("mousemove", e => {
  if (!gameStarted || gameEnded) return;
  bunny.style.left = `${e.clientX - bunny.offsetWidth / 2}px`;
});

// Mobile touch control
document.addEventListener("touchmove", e => {
  if (!gameStarted || gameEnded) return;
  const touch = e.touches[0];
  bunny.style.left = `${touch.clientX - bunny.offsetWidth / 2}px`;
}, { passive: true });

function spawnHeart() {
  if (!gameStarted || gameEnded) return;

  const heart = document.createElement("img");
  heart.src = "../assets/heart.png";
  heart.className = "heart";
  heart.style.left = Math.random() * (window.innerWidth - 48) + "px";
  heart.style.animationDuration = speed + "s";

  game.appendChild(heart);

  const check = setInterval(() => {
    const h = heart.getBoundingClientRect();
    const b = bunny.getBoundingClientRect();

    if (h.bottom >= b.top && h.left < b.right && h.right > b.left) {
      heart.remove();
      clearInterval(check);
      collectHeart();
    }

    if (h.top > window.innerHeight) {
      heart.remove();
      clearInterval(check);
    }
  }, 20);
}

function collectHeart() {
  if (!gameStarted || gameEnded) return;

  score++;
  scoreEl.textContent = `💙 ${score}`;
  catchSound.play();

  if (score % 5 === 0) showMessage(score);
}

function showMessage(n) {
  rewardSound.play();
  const map = {
    5: "I wanna be yours",
    10: "I love my hot autistic girlfriend",
    15: "us frfr <3",
    20: "will you be my valentine cutie ?"
  };

  floatingText.textContent = map[n];
  floatingText.classList.add("show");

  if (n === 15) floatingImg.src = "./assets/us_3.png";
  if (n === 15) floatingImg.src = "../assets/us 3.png";
  if (n === 20) floatingImg.src = "../assets/us.png";
  if (n >= 15) floatingImage.classList.add("show");

  setTimeout(() => {
    floatingText.classList.remove("show");
    floatingImage.classList.remove("show");
  }, 3000);


  if (n === 20) {
    setTimeout(() => {
      showQuestion();
    }, 3000);
  }
}

function showQuestion() {
  gameEnded = true;
  try { bgMusic.pause(); } catch (e) {}
  if (!questionBox) return;
  questionBox.classList.remove('hidden');
  questionBox.style.display = 'flex';
}

function clearHearts() {
  const hearts = document.querySelectorAll('#game .heart');
  hearts.forEach(h => h.remove());
}

function resetToStart() {
  // stop music and reset variables
  try { bgMusic.pause(); bgMusic.currentTime = 0; } catch (e) {}
  score = 0;
  speed = 4;
  gameStarted = false;
  gameEnded = false;
  scoreEl.textContent = `💙 ${score}`;
  clearHearts();
  // restore question image and hide box
  if (questionImg) questionImg.src = "../assets/qn cat.png";
  if (questionBox) {
    questionBox.classList.add('hidden');
    questionBox.style.display = 'none';
  }
  // show start screen
  if (startScreen) startScreen.style.display = 'flex';
  // re-create initial choice buttons if needed
  if (choicesEl) {
    choicesEl.innerHTML = '';
    const yes = document.createElement('button');
    yes.id = 'btnYes';
    yes.textContent = 'Yes';
    const no = document.createElement('button');
    no.id = 'btnNo';
    no.textContent = 'No';
    choicesEl.appendChild(yes);
    choicesEl.appendChild(no);
    // rebind handlers
    yes.addEventListener('click', onYesClick);
    no.addEventListener('click', onNoClick);
  }
}

function showYesOutcome() {
  if (!choicesEl) return;
  // show yes image
  if (questionImg) questionImg.src = "../assets/yes cat.png";
  // clear choices and show message + replay
  choicesEl.innerHTML = '';
  const msg = document.createElement('div');
  msg.className = 'outcomeMsg';
  msg.textContent = 'YIPEEE';
  const replay = document.createElement('button');
  replay.className = 'replayBtn';
  replay.textContent = 'Replay Game';
  replay.addEventListener('click', resetToStart);
  choicesEl.appendChild(msg);
  choicesEl.appendChild(replay);
}

function showNoOutcome() {
  if (!choicesEl) return;
  // show no image
  if (questionImg) questionImg.src = "../assets/no cat.png";
  // clear choices and show "not crying" + single Yes? button
  choicesEl.innerHTML = '';
  const msg = document.createElement('div');
  msg.className = 'outcomeMsg';
  msg.textContent = 'not crying';
  const singleYes = document.createElement('button');
  singleYes.className = 'singleYesBtn';
  singleYes.textContent = 'Yes?';
  singleYes.addEventListener('click', () => {
    // behave like Yes click: show yes outcome (and then replay)
    showYesOutcome();
  });
  choicesEl.appendChild(msg);
  choicesEl.appendChild(singleYes);
}

function onYesClick(e) {
  e && e.preventDefault();
  // disable original buttons if present
  try { btnYes && (btnYes.disabled = true); btnNo && (btnNo.disabled = true); } catch (e) {}
  showYesOutcome();
}

function onNoClick(e) {
  e && e.preventDefault();
  try { btnYes && (btnYes.disabled = true); btnNo && (btnNo.disabled = true); } catch (e) {}
  showNoOutcome();
}

// bind initial handlers (in case buttons exist in DOM)
if (btnYes) btnYes.addEventListener('click', onYesClick);
if (btnNo) btnNo.addEventListener('click', onNoClick);

setInterval(spawnHeart, 900);

// hide questionBox immediately on script load as a safety
if (questionBox) {
  questionBox.style.display = 'none';
  questionBox.classList.add('hidden');
}
