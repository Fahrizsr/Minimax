const boardElement = document.getElementById("board");
let board = Array(9).fill("");
let gameOver = false;

// Render papan
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.addEventListener("click", () => playerMove(i));
    boardElement.appendChild(div);
  });

  const result = checkWinner(board);
  if (result && result.winner !== "Draw") {
    highlightWinner(result.pattern);
    gameOver = true;
  }
}

// Cek pemenang
function checkWinner(b) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // baris
    [0,3,6],[1,4,7],[2,5,8], // kolom
    [0,4,8],[2,4,6]          // diagonal
  ];
  for (let pattern of winPatterns) {
    const [a, b1, c] = pattern;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], pattern };
    }
  }
  return b.includes("") ? null : { winner: "Draw" };
}

// Highlight sel yang menang
function highlightWinner(pattern) {
  const cells = document.querySelectorAll(".cell");
  pattern.forEach(i => {
    cells[i].classList.add("highlight");
  });
}

// Gerakan pemain
function playerMove(i) {
  if (!gameOver && board[i] === "" && !checkWinner(board)) {
    board[i] = "O"; // Player = O
    renderBoard();
    if (!checkWinner(board)) {
      aiMove();
    }
  }
}

// Algoritma Minimax
function minimax(newBoard, depth, isMaximizing) {
  const result = checkWinner(newBoard);
  if (result?.winner === "X") return 1;
  if (result?.winner === "O") return -1;
  if (result?.winner === "Draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// AI memilih langkah terbaik
function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  if (move !== undefined) {
    board[move] = "X"; // AI = X
    renderBoard();
  }
}

// Restart game
function restartGame() {
  board = Array(9).fill("");
  gameOver = false;
  renderBoard();
}

renderBoard();