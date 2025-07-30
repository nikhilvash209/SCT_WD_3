let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let vsAI = false;

document.addEventListener("DOMContentLoaded", () => {
  const playAgainBtn = document.querySelector("#result-modal button");
  playAgainBtn.addEventListener("click", () => {
    document.getElementById("result-modal").classList.add("hidden");
    resetGame(true);
  });
});

function startGame(mode) {
  vsAI = (mode === 'ai');
  document.querySelector('.mode-selector').classList.add('hidden');
  document.querySelector('.game-container').classList.remove('hidden');
  initBoard();
  gameActive = true;
}

function initBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  updateStatus();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    boardDiv.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    showResult(`🎉 Player ${currentPlayer} wins!`);
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    showResult("🤝 It's a draw!");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (!gameActive) return;

  const emptyIndices = board
    .map((val, idx) => val === '' ? idx : null)
    .filter(i => i !== null);

  const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[choice] = 'O';
  document.querySelectorAll('.cell')[choice].textContent = 'O';

  if (checkWinner()) {
    showResult("🤖 Computer (O) wins!");
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    showResult("🤝 It's a draw!");
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  updateStatus();
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(([a,b,c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function updateStatus() {
  document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
}

function showResult(message) {
  document.getElementById("result-message").textContent = message;
  document.getElementById("result-modal").classList.remove("hidden");
}

function resetGame(fromPopup = false) {
  if (!fromPopup) {
    document.getElementById("result-modal").classList.add("hidden");
  }
  initBoard();
  gameActive = true;
}

function goBack() {
  document.querySelector('.game-container').classList.add('hidden');
  document.querySelector('.mode-selector').classList.remove('hidden');
  document.getElementById("result-modal").classList.add("hidden");
}
