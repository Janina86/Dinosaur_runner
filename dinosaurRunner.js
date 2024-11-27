const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const groundLevel = canvas.height - 100;
const dino = { 
    x: 50, 
    y: groundLevel - 40, 
    width: 40, 
    height: 40, 
    dinoJumpSpeed: 0, 
    isJumping: false 
};
const gravity = 1;
const obstacles = [];
const obstacleSpeed = 8; 

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

    obstacles.forEach(function(obstacle) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    document.getElementById("current-score").innerText = Math.floor(currentScore);
    document.getElementById("last-score").innerText = Math.floor(lastScore);
}

function update() {
    if (!gameRunning) return;
    
    if (dino.isJumping) {
        dino.dinoJumpSpeed += gravity;
        dino.y += dino.dinoJumpSpeed;
        if (dino.y >= groundLevel - dino.height) {
            dino.y = groundLevel - dino.height;
            dino.isJumping = false;
        }
    }
    
    obstacles.forEach(function(obstacle) {
        obstacle.x -= obstacleSpeed;
    });

    if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
    }

    obstacles.forEach(function(obstacle) {
        if (dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y) {
            gameOver = true;
            gameRunning = false;
            lastScore = currentScore;
        }
    });

    if (Math.random() < 0.02 && obstacles.length < 3) {
        const height = Math.floor(Math.random() * 40) + 20;
        obstacles.push({
            x: canvas.width,
            y: groundLevel - height,
            width: Math.floor(Math.random() * 30) + 20,
            height: height
        });
    }

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
        dino.dinoJumpSpeed = -20; 
    }
});

gameLoop();
