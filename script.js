const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const overlay = document.getElementById('overlay');
const finalScore = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const gameSpeed = 120;

let snake;
let direction;
let nextDirection;
let food;
let score;
let gameLoop;
let isGameOver;

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = `Score: ${score}`;
  overlay.classList.add('hidden');
  restartBtn.classList.add('hidden');
  placeFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(updateGame, gameSpeed);
  drawGame();
}

function placeFood() {
  let validPosition = false;

  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };

    validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

function updateGame() {
  if (isGameOver) return;

  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

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
    scoreDisplay.textContent = `Score: ${score}`;
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#86efac';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';

  for (let i = 0; i <= tileCount; i++) {
    const position = i * gridSize;

    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(canvas.width, position);
    ctx.stroke();
  }
}

function endGame() {
  isGameOver = true;
  clearInterval(gameLoop);
  finalScore.textContent = `Final Score: ${score}`;
  overlay.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
}

function changeDirection(event) {
  const key = event.key;

  if (key === 'ArrowUp' && direction.y !== 1) {
    nextDirection = { x: 0, y: -1 };
  } else if (key === 'ArrowDown' && direction.y !== -1) {
    nextDirection = { x: 0, y: 1 };
  } else if (key === 'ArrowLeft' && direction.x !== 1) {
    nextDirection = { x: -1, y: 0 };
  } else if (key === 'ArrowRight' && direction.x !== -1) {
    nextDirection = { x: 1, y: 0 };
  }
}

document.addEventListener('keydown', changeDirection);
playAgainBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

initGame();
