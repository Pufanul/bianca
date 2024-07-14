document.getElementById('play-button').addEventListener('click', startGame);
document.getElementById('retry-button').addEventListener('click', startGame);

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
let obstacles = [];
let woman = new Image();
woman.src = 'resources/woman.png';
let jumpSound = new Audio('resources/jump.mp3');
let gameOverSound = new Audio('resources/gameover.mp3');

const obstacleImages = [
    'resources/iron.png',
    'resources/cooking-pot.png',
    'resources/kid.png',
    'resources/laundry-machine.png'
];

class Character {
    constructor() {
        this.x = 50;
        this.y = canvas.height - 200;
        this.width = 50;
        this.height = 50; // Set height to 50px
        this.image = new Image();
        this.image.src = 'resources/woman.png';
        this.dy = 0;
        this.gravity = 0.6;
        this.jumpHeight = -19;
        this.jumping = false;
    }

    draw() {
        if (this.image.complete) {
            const aspectRatio = this.image.width / this.image.height;
            let drawWidth = this.height * aspectRatio;
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, drawWidth, this.height);
        }
    }

    update() {
        if (this.jumping) {
            this.dy += this.gravity;
            this.y += this.dy;
            if (this.y > canvas.height - 200) {
                this.y = canvas.height - 200;
                this.dy = 0;
                this.jumping = false;
            }
        }
        this.draw();
    }

    jump() {
        if (!this.jumping) {
            this.dy = this.jumpHeight;
            this.jumping = true;
            jumpSound.play();
        }
    }
}

class Obstacle {
    constructor(speed, xOffset = 0) {
        this.x = canvas.width + xOffset;
        this.y = canvas.height - 200;
        this.width = 50;
        this.height = 50; // Set height to 50px
        this.image = new Image();
        this.image.src = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        this.speed = speed;
    }

    draw() {
        if (this.image.complete) {
            const aspectRatio = this.image.width / this.image.height;
            let drawWidth = this.height * aspectRatio;
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, drawWidth, this.height);
        }
    }

    update() {
        this.x -= this.speed;
        this.draw();
    }
}

const character = new Character();
let obstacleSpeed = 4; // Set the obstacle speed here
let frameCount = 0;
const obstacleInterval = 160; // Adjust this value to control the distance between obstacles

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block'; // Ensure game container is visible
    const gameOverScreen = document.getElementById('game-over-screen');
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.classList.remove('game-over');
    if (gameOverScreen.contains(scoreboard)) {
        document.getElementById('game-container').appendChild(scoreboard);
    }
    score = 0; // Reset the score to 0
    scoreboard.innerText = `Score: ${score}/30`; // Update the scoreboard display
    gameOver = false;
    obstacles = [];
    frameCount = 0;
    addEventListeners();
    animate();
}

function gameOverFunction() {
    gameOver = true;
    gameOverSound.play();
    removeEventListeners();
    const scoreboard = document.getElementById('scoreboard');
    const gameOverScreen = document.getElementById('game-over-screen');
    scoreboard.classList.add('game-over');
    gameOverScreen.insertBefore(scoreboard, gameOverScreen.querySelector('button'));
    scoreboard.innerText = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
}

function showCongratulationScreen() {
    gameOver = true;
    removeEventListeners();
    const congratulationScreen = document.createElement('div');
    congratulationScreen.id = 'congratulation-screen';
    congratulationScreen.innerHTML = `
        <h2>Congratulations!</h2>
        <p>You have reached 30 points!</p>
    `;
    document.getElementById('game-container').appendChild(congratulationScreen);
}

function animate() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.update();
    frameCount++;

    if (frameCount % obstacleInterval === 0) {
        obstacles.push(new Obstacle(obstacleSpeed));
        // Random chance to add a second obstacle close to the first one
        if (Math.random() < 0.3) { // 30% chance to add a second obstacle
            obstacles.push(new Obstacle(obstacleSpeed, 60)); // Adjust the xOffset value as needed
        }
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById('scoreboard').innerText = `Score: ${score}/30`;
        }
        if (character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y) {
            gameOverFunction();
        }
    });

    if (score >= 30) {
        showCongratulationScreen();
        return;
    }

    requestAnimationFrame(animate);
}

function removeEventListeners() {
    window.removeEventListener('keydown', handleKeyDown);
    canvas.removeEventListener('touchstart', handleTouchStart);
}

function handleKeyDown(e) {
    if (e.code === 'Space') {
        character.jump();
    }
}

function handleTouchStart() {
    character.jump();
}

function addEventListeners() {
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});