const player = document.getElementById('player'); // Select the player img tag
const obstacle = document.getElementById('obstacle'); // Select the obstacle img tag
const scoreElement = document.querySelector('.score'); // Select the score element
const menu = document.getElementById('menu'); // Dropdown menu
const obstacleSelect = document.getElementById('obstacle-select'); // Obstacle dropdown
const playerSelect = document.getElementById('player-select'); // Player dropdown
const backgroundSelect = document.getElementById('background-select'); // Background dropdown

let obstaclePosition = window.innerWidth; // Start position for the obstacle
let obstacleSpeed = 19; // Speed of the obstacle
let isJumping = false; // Track if the player is jumping
let score = 0; // Initialize score
let gameRunning = true; // Track if the game is active
let isPaused = false; // Track whether the game is paused

// Variables to persist changes
let currentPlayer = 'p1.gif';
let currentObstacle = 'o1.gif';
let currentBackground = 'b1.gif';

// Move the obstacle toward the player
function moveObstacle() {
  if (gameRunning && !isPaused) {
    obstaclePosition -= obstacleSpeed; // Move obstacle left
    obstacle.style.right = `${window.innerWidth - obstaclePosition}px`; // Update obstacle position

    // Reset the obstacle position if it moves out of view
    if (obstaclePosition < -50) {
      obstaclePosition = window.innerWidth; // Reset to the right side
      score++; // Increment score
      scoreElement.innerText = `Score: ${score}`; // Update score display
    }

    checkCollision(); // Check for collision between the player and obstacle
    requestAnimationFrame(moveObstacle); // Continue animation
  }
}

// Make the player jump
function jumpPlayer() {
  if (isJumping || !gameRunning || isPaused) return; // Prevent jumping if already jumping, game stopped, or paused
  isJumping = true;

  let jumpHeight = 0; // Track jump height
  const initialTop = parseFloat(getComputedStyle(player).top); // Get player's starting top position

  // Jump up
  const jumpUp = setInterval(() => {
    if (jumpHeight < 350) { // Adjust max jump height here
      jumpHeight += 12; // Adjust jump speed
      player.style.top = `${initialTop - jumpHeight}px`;
    } else {
      clearInterval(jumpUp);

      // Fall down
      const fallDown = setInterval(() => {
        if (jumpHeight > 0) {
          jumpHeight -= 12; // Adjust fall speed
          player.style.top = `${initialTop - jumpHeight}px`;
        } else {
          clearInterval(fallDown);
          player.style.top = '69%'; // Reset to ground position
          isJumping = false; // Reset jump state
        }
      }, 10);
    }
  }, 10);
}

// Check for collision between player and obstacle
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    gameRunning = false; // Stop the game
    showGameOverScreen(); // Show game-over screen
  }
}

// Show game-over screen
function showGameOverScreen() {
  if (isPaused) return; // Prevent showing game-over screen if menu is active

  const gameOverScreen = document.createElement('div');
  gameOverScreen.style.position = 'fixed';
  gameOverScreen.style.top = '0';
  gameOverScreen.style.left = '0';
  gameOverScreen.style.width = '100%';
  gameOverScreen.style.height = '100%';
  gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  gameOverScreen.style.color = 'white';
  gameOverScreen.style.display = 'flex';
  gameOverScreen.style.flexDirection = 'column';
  gameOverScreen.style.justifyContent = 'center';
  gameOverScreen.style.alignItems = 'center';
  gameOverScreen.style.zIndex = '1000';

  // Add game-over text
  const gameOverText = document.createElement('h1');
  gameOverText.innerText = 'Game Over!';
  gameOverScreen.appendChild(gameOverText);

  // Add score
  const scoreText = document.createElement('p');
  scoreText.innerText = `Your Score: ${score}`;
  gameOverScreen.appendChild(scoreText);

  // Add play-again button
  const playAgainButton = document.createElement('button');
  playAgainButton.innerText = 'Play Again';
  playAgainButton.style.padding = '10px 20px';
  playAgainButton.style.fontSize = '1.2em';
  playAgainButton.style.cursor = 'pointer';
  playAgainButton.onclick = () => {
    // Remove the game-over screen
    gameOverScreen.remove();

    // Restart the game with current assets
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    obstaclePosition = window.innerWidth; // Reset obstacle position
    player.src = currentPlayer; // Ensure player uses current selection
    obstacle.src = currentObstacle; // Ensure obstacle uses current selection
     // Reset background
    gameRunning = true;
    moveObstacle(); // Restart movement
  };
  gameOverScreen.appendChild(playAgainButton);

  document.body.appendChild(gameOverScreen);
}

// Pause and display menu functionality
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    gameRunning = false; // Stop game mechanics
    menu.style.display = 'block'; // Show the menu
  } else {
    menu.style.display = 'none'; // Hide the menu

    // Apply changes based on menu selections
    currentPlayer = playerSelect.value; // Save player selection
    currentObstacle = obstacleSelect.value; // Save obstacle selection
    

    player.src = currentPlayer; // Update player gif
    obstacle.src = currentObstacle; // Update obstacle gif
    
    gameRunning = true; // Resume the game
    moveObstacle(); // Restart obstacle movement
  }
}

// Real-time change functionality
obstacleSelect.addEventListener('change', () => {
  currentObstacle = obstacleSelect.value;
  obstacle.src = currentObstacle; // Update obstacle gif immediately
});

playerSelect.addEventListener('change', () => {
  currentPlayer = playerSelect.value;
  player.src = currentPlayer; // Update player gif immediately
});



// Update score
function updateScore() {
  if (gameRunning && !isPaused) {
    scoreElement.innerText = `Score: ${score}`;
    setTimeout(updateScore, 1000); // Update every second
  }
}

// Event listener for pause functionality and jumping
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    jumpPlayer(); // Player jumps
  } else if (event.code === 'KeyP') {
    togglePause(); // Pause or resume the game
  }
});

// Start the game
moveObstacle();
updateScore();