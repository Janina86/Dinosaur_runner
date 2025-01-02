const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const groundLevel = canvas.height - 100;
const DINO_JUMP_FORCE = -20;
const GRAVITY = 1;
const OBSTACLE_SPAWN_PROBABILITY = 0.02;
const OBSTACLE_MAX_HEIGHT = 40;
const OBSTACLE_MIN_HEIGHT = 20;
const MIN_OBSTACLE_WIDTH = 20;
const MAX_OBSTACLE_WIDTH = 30;
const OBSTACLE_SPEED = 8;

const dino = {
    x: 50,
    y: groundLevel - 40,
    width: 40,
    height: 40,
    dinoJumpSpeed: 0,
    isJumping: false
};

const obstacles = [];
let currentScore = 0;
let lastScore = 0;
let gameRunning = false;
let gameOver = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);
    ctx.fillStyle = "green";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height));
    document.getElementById("current-score").innerText = Math.floor(currentScore);
    document.getElementById("last-score").innerText = Math.floor(lastScore);
}

function dinoJump() {
    if (dino.isJumping) {
        dino.dinoJumpSpeed += GRAVITY;
        dino.y += dino.dinoJumpSpeed;
        if (dino.y >= groundLevel - dino.height) {
            dino.y = groundLevel - dino.height;
            dino.isJumping = false;
        }
    }
}

function moveObjects() {
    obstacles.forEach(obstacle => {
        obstacle.x -= OBSTACLE_SPEED;
    });
    if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
    }
}

function generateObstacle() {
    if (Math.random() < OBSTACLE_SPAWN_PROBABILITY && obstacles.length < 3) {
        const height = Math.floor(Math.random() * OBSTACLE_MAX_HEIGHT) + OBSTACLE_MIN_HEIGHT;
        obstacles.push({
            x: canvas.width,
            y: groundLevel - height,
            width: Math.floor(Math.random() * MAX_OBSTACLE_WIDTH) + MIN_OBSTACLE_WIDTH,
            height: height
        });
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function handleCollisions() {
    obstacles.forEach(obstacle => {
        if (checkCollision(dino, obstacle)) {
            gameOver = true;
            gameRunning = false;
            lastScore = currentScore;
        }
    });
}

function update() {
    if (!gameRunning) return;
    dinoJump();
    moveObjects();
    handleCollisions();
    generateObstacle();
    currentScore += 0.1;
}

function gameLoop() {
    draw();
    if (!gameOver) {
        update();
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !gameRunning) {
        gameRunning = true;
        gameOver = false;
        currentScore = 0;
        obstacles.length = 0;
    }
    if (e.code === "ArrowUp" && !dino.isJumping) {
        dino.isJumping = true;
        dino.dinoJumpSpeed = DINO_JUMP_FORCE;
    }
});

gameLoop();
