const size = 20;
const mines = 50;
const board = [];
let gameOver = false;
const minesLeftElement = document.querySelector(".mines-left");
const boardElement = document.querySelector(".board");

startGame();

function startGame() {
  gameOver = false;
  newBoard();
  document.removeEventListener("click", handleLeftClick);
  document.removeEventListener("contextmenu", handleRightClick);
  document.addEventListener("click", handleLeftClick);
  document.addEventListener("contextmenu", handleRightClick);
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((row) => {
    row.forEach((cell) => {
      boardElement.appendChild(getNewCellElement(cell));
    });
  });
  setMinesCount();
}

function setBoardSize() {
  boardElement.style.setProperty("--size", size);
}

function setMinesCount() {
  minesLeftElement.dataset.minesLeft = mines - getMarkedCount();
}

function handleLeftClick(e) {
  if (e.target.matches(".restart")) {
    startGame();
    return;
  }
  if (gameOver) return;
  if (!e.target.matches(".cell")) return;
  if (e.target.matches(".open")) return;
  if (e.target.matches(".marked")) return;
  const { x, y } = getElementCoordinates(e.target);
  if (!board[x][y].mine) openMultiCell({ x, y });
  else gameOver = true;
  renderBoard();
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  if (!e.target.matches(".cell")) return;
  if (e.target.matches(".open")) return;
  const { x, y } = getElementCoordinates(e.target);
  board[x][y].marked = !board[x][y].marked;
  renderBoard();
}

function getMinesLocation() {
  const locations = [];
  while (locations.length < mines) {
    const randomX = Math.floor(Math.random() * size);
    const randomY = Math.floor(Math.random() * size);
    if (!locations.some((l) => l.x === randomX && l.y === randomY))
      locations.push({ x: randomX, y: randomY });
  }
  return locations;
}

function getNewCellElement(cell) {
  const newCellElement = document.createElement("div");
  newCellElement.classList.add("cell");
  newCellElement.dataset.x = cell.x;
  newCellElement.dataset.y = cell.y;
  if (cell.open) newCellElement.classList.add("open");
  if (cell.marked) newCellElement.classList.add("marked");
  if (cell.adjMine) newCellElement.dataset.adjMine = cell.adjMine;
  if (gameOver && cell.mine) newCellElement.classList.add("mine", "open");
  if (gameOver && cell.marked) newCellElement.classList.add("open");
  return newCellElement;
}

function getElementCoordinates(element) {
  return { x: parseInt(element.dataset.x), y: parseInt(element.dataset.y) };
}

function getMarkedCount() {
  return board.reduce((total, row) => {
    return (
      total +
      row.reduce((rowSum, cell) => {
        if (cell.marked) return rowSum + 1;
        return rowSum;
      }, 0)
    );
  }, 0);
}

function newBoard() {
  setBoardSize();
  const minesLocation = getMinesLocation();
  for (let x = 0; x < size; x++) {
    board[x] = [];
    for (let y = 0; y < size; y++) {
      board[x].push(getNewCell(x, y));
    }
  }
  minesLocation.forEach((mine) => {
    board[mine.x][mine.y].mine = true;
  });
}

function getNewCell(x, y) {
  return {
    x,
    y,
    open: false,
    marked: false,
    mine: false,
    adjMine: 0,
  };
}

function openMultiCell({ x, y }) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  if (board[x][y].open) return;
  if (board[x][y].mine) return;
  board[x][y].open = true;
  board[x][y].adjMine = getAdjMines({ x, y });
  if (board[x][y].adjMine === 0) {
    for (let X = x - 1; X <= x + 1; X++) {
      for (let Y = y - 1; Y <= y + 1; Y++) {
        openMultiCell({ x: X, y: Y });
      }
    }
  }
}

function getAdjMines({ x, y }) {
  let adjMines = 0;
  for (let X = x - 1; X <= x + 1; X++) {
    for (let Y = y - 1; Y <= y + 1; Y++) {
      if (board[X]?.[Y]?.mine) adjMines++;
    }
  }
  return adjMines;
}
