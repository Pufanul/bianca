import { Character } from "./character.js";
import { Obstacle } from "./obstacle.js";

const CANVAS_HEIGHT_OFFSET = 200;
const CHARACTER_WIDTH = 50;
const CHARACTER_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;
const OBSTACLE_SPEED = 4;
const OBSTACLE_INTERVAL = 160;
const SCORE_LIMIT = 30;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
let obstacles = [];
let frameCount = 0;

const jumpSound = new Audio("resources/sounds/jump.mp3");
const gameOverSound = new Audio("resources/sounds/gameover.mp3");
const obstacleImages = [
  "resources/images/iron.png",
  "resources/images/cooking-pot.png",
  "resources/images/kid.png",
  "resources/images/laundry-machine.png",
];

const character = new Character(ctx, canvas, jumpSound);

function startGame() {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.remove("game-over");
  score = 0;
  scoreboard.innerText = `Scor: ${score}/30`;
  gameOver = false;
  obstacles = [];
  frameCount = 0;
  addEventListeners();
  document.getElementById("game-container").appendChild(scoreboard); // Move scoreboard back to game container
  animate();
}

function gameOverFunction() {
  gameOver = true;
  gameOverSound.play();
  removeEventListeners();
  const scoreboard = document.getElementById("scoreboard");
  const gameOverScreen = document.getElementById("game-over-screen");
  scoreboard.classList.add("game-over");
  gameOverScreen
    .querySelector("h2")
    .insertAdjacentElement("afterend", scoreboard);
  scoreboard.innerText = `Scor: ${score}`;
  document.getElementById("game-over-screen").style.display = "flex";
}

function showCongratulationScreen() {
  gameOver = true;
  removeEventListeners();
  const congratulationScreen = document.createElement("div");
  congratulationScreen.id = "congratulation-screen";
  congratulationScreen.innerHTML = `
        <h1>Felicitari!</h1>
        <p>Ai evitat cu succes 30 responsabilitati</p>
        <p>Apasa pe butonul de mai jos pentru a intra pe Discord si a primi urmatorul indiciu</p>
        <a class="discord" href="https://discord.gg/NVcg6fKa">Discord</a>
    `;
  document.getElementById("game-container").appendChild(congratulationScreen);
}

function animate() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  character.update();
  frameCount++;

  if (frameCount % OBSTACLE_INTERVAL === 0) {
    obstacles.push(
      new Obstacle(
        ctx,
        canvas.width,
        canvas.height,
        OBSTACLE_SPEED,
        obstacleImages
      )
    );
    if (Math.random() < 0.3) {
      obstacles.push(
        new Obstacle(
          ctx,
          canvas.width,
          canvas.height,
          OBSTACLE_SPEED,
          obstacleImages,
          60
        )
      );
    }
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    if (obstacle.x + OBSTACLE_WIDTH < 0) {
      obstacles.splice(index, 1);
      score++;
      document.getElementById("scoreboard").innerText = `Scor: ${score}/30`;
    }
    if (
      character.x < obstacle.x + OBSTACLE_WIDTH &&
      character.x + CHARACTER_WIDTH > obstacle.x &&
      character.y < obstacle.y + OBSTACLE_HEIGHT &&
      character.y + CHARACTER_HEIGHT > obstacle.y
    ) {
      gameOverFunction();
    }
  });

  if (score >= SCORE_LIMIT) {
    showCongratulationScreen();
    return;
  }

  requestAnimationFrame(animate);
}

function removeEventListeners() {
  window.removeEventListener("keydown", handleKeyDown);
  canvas.removeEventListener("touchstart", handleTouchStart);
}

function handleKeyDown(e) {
  if (e.code === "Space") {
    character.jump();
  }
}

function handleTouchStart() {
  character.jump();
}

function addEventListeners() {
  window.addEventListener("keydown", handleKeyDown);
  canvas.addEventListener("touchstart", handleTouchStart);
}

document.getElementById("play-button").addEventListener("click", startGame);
document.getElementById("retry-button").addEventListener("click", startGame);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
