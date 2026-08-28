const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake;
let food;
let dx;
let dy;
let score;
let gameLoop;
let isGameOver;

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  food = generateFood();
  dx = 1;
  dy = 0;
  score = 0;
  isGameOver = false;
  scoreEl.textContent = score;
  finalScoreEl.textContent = score;
  gameOverScreen.classList.add('hidden');

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(updateGame, 120);
  drawGame();
}

function generateFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake && snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  return newFood;
}

function updateGame() {
  if (isGameOver) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = score;
    finalScoreEl.textContent = score;
    food = generateFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function endGame() {
  isGameOver = true;
  clearInterval(gameLoop);
  gameOverScreen.classList.remove('hidden');
}

document.addEventListener('keydown', event => {
  const key = event.key;

  if (key === 'ArrowUp' && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (key === 'ArrowDown' && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (key === 'ArrowLeft' && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (key === 'ArrowRight' && dx !== -1) {
    dx = 1;
    dy = 0;
  }
});

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

initGame();
