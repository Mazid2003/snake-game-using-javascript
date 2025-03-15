const board = document.getElementById("gameBoard");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

const box = 20; // Size of each grid cell
const boardSize = 20; // 20x20 grid
let snake, direction, food, score, gameInterval;
let gameStarted = false;

const pauseBtn = document.getElementById("pauseBtn");
let gamePaused = false;

// Pause and Resume Functionality
pauseBtn.addEventListener("click", () => {
    if (gameStarted) {
        if (gamePaused) {
            gameInterval = setInterval(draw, 100); // Resume game
            pauseBtn.textContent = "Pause";
        } else {
            clearInterval(gameInterval); // Pause game
            pauseBtn.textContent = "Resume";
        }
        gamePaused = !gamePaused;
    }
});


// Generate food at a random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };
    renderFood();
}

// Render food on the board
function renderFood() {
    let foodElement = document.querySelector(".food");
    if (!foodElement) {
        foodElement = document.createElement("div");
        foodElement.classList.add("food");
        board.appendChild(foodElement);
    }
    foodElement.style.left = `${food.x * box}px`;
    foodElement.style.top = `${food.y * box}px`;
}

// Listen for key presses
document.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", startGame);

function changeDirection(event) {
    if (!gameStarted) return;

    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Move and render snake
function draw() {
    board.innerHTML = "";
    renderFood();

    snake.forEach((segment) => {
        const segmentElement = document.createElement("div");
        segmentElement.classList.add("snake");
        segmentElement.style.left = `${segment.x * box}px`;
        segmentElement.style.top = `${segment.y * box}px`;
        board.appendChild(segmentElement);
    });

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;
    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;

    // ✅ Fix: Allow the snake to reach the exact last grid cell
    if (head.x < 0) head.x = boardSize - 1; // Wrap left to right
    if (head.x >= boardSize) head.x = 0; // Wrap right to left
    if (head.y < 0) head.y = boardSize - 1; // Wrap top to bottom
    if (head.y >= boardSize) head.y = 0; // Wrap bottom to top

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop(); // Remove last segment if no food is eaten
    }

    // Check collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        alert("Game Over! Your Score: " + score);
        gameStarted = false;
        return;
    }

    snake.unshift(head);
}

// Start game function
function startGame() {
    if (gameStarted) return;

    score = 0;
    scoreDisplay.textContent = score;
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    generateFood();
    gameStarted = true;

    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}
