const Player = (name, marker) => {
  let _score = 0;
  const addScore = () => { _score += 1; };
  const resetScore = () => { _score = 0; };
  const isWinner = () => _score === 3;
  const getName = () => name;
  const getMarker = () => marker;
  const compareMarker = (compMarker) => compMarker === getMarker();

  return {
    addScore, resetScore, isWinner, getName, compareMarker,
  };
};

const player1 = Player('bob', 'x');
const player2 = Player('joe', 'o');

const gameBoard = (() => {
  const board = [...Array(3)].map(() => [...Array(3)]); // 3x3 array
  // const _gridContainer = document.querySelector('.grid-container');

  // create DOM elements
  // for (let row = 0; row < board.length; row += 1) {
  //   for (let col = 0; col < board[row].length; col += 1) {
  //     const jsGridItem = document.createElement('button');
  //     jsGridItem.classList.add('js-grid-item');
  //     jsGridItem.dataset.colIndex = col.toString();
  //     jsGridItem.dataset.rowIndex = row.toString();
  //     jsGridItem.addEventListener('click', gameFlow.placeMarker);
  //     _gridContainer.appendChild(jsGridItem);
  //   }
  // }

  return { board };
})();

const gameFlow = (() => {
  let _currentPlayer = 'x';

  const checkRows = (board) => {
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        if (player1.compareMarker(board[row][col])) {
          player1.addScore();
        } else if (player2.compareMarker(board[row][col])) {
          player2.addScore();
        }
      }
      if (player1.isWinner() || player2.isWinner()) {
        return true;
      }
      player1.resetScore();
      player2.resetScore();
    }
    return false;
  };

  const checkColumns = (board) => {
    for (let col = 0; col < board.length; col += 1) {
      for (let row = 0; row < board.length; row += 1) {
        if (player1.compareMarker(board[row][col])) {
          player1.addScore();
        } else if (player2.compareMarker(board[row][col])) {
          player2.addScore();
        }
      }
      if (player1.isWinner() || player2.isWinner()) {
        return true;
      }
      player1.resetScore();
      player2.resetScore();
    }
    return false;
  };

  const checkDiagonal = (board) => {
    for (let i = 0; i < board.length; i += 1) {
      if (player1.compareMarker(board[i][i])) {
        player1.addScore();
      } else if (player2.compareMarker(board[i][i])) {
        player2.addScore();
      }
    }
    if (player1.isWinner() || player2.isWinner()) {
      return true;
    }
    player1.resetScore();
    player2.resetScore();
    return false;
  };

  const checkAntiDiagonal = (board) => {
    let row = 0;
    for (let col = board.length - 1; col >= 0; col -= 1) {
      if (player1.compareMarker(board[row][col])) {
        player1.addScore();
      } else if (player2.compareMarker(board[row][col])) {
        player2.addScore();
      }
      row += 1;
    }
    if (player1.isWinner() || player2.isWinner()) {
      return true;
    }
    player1.resetScore();
    player2.resetScore();
    return false;
  };

  const decideWinner = (board) => checkRows(board)
   || checkColumns(board)
   || checkDiagonal(board)
   || checkAntiDiagonal(board);

  const placeMarker = (event) => {
    if (event.target.classList.contains('js-marked')) {
      return;
    }

    const { rowIndex, colIndex } = event.target.dataset;
    gameBoard.board[rowIndex][colIndex] = _currentPlayer;
    event.target.classList.add('js-marked');
    if (_currentPlayer === 'x') {
      event.target.classList.add('js-marked-x');
    } else {
      event.target.classList.add('js-marked-o');
    }
    if (decideWinner(gameBoard.board)) {
      console.log('winner');
    } else {
      console.log('no winner');
    }
    _currentPlayer = (_currentPlayer === 'x') ? 'o' : 'x';
  };

  // create DOM elements
  const _gridContainer = document.querySelector('.grid-container');
  for (let row = 0; row < gameBoard.board.length; row += 1) {
    for (let col = 0; col < gameBoard.board[row].length; col += 1) {
      const jsGridItem = document.createElement('button');
      jsGridItem.classList.add('js-grid-item');
      jsGridItem.dataset.colIndex = col.toString();
      jsGridItem.dataset.rowIndex = row.toString();
      jsGridItem.addEventListener('click', placeMarker);
      _gridContainer.appendChild(jsGridItem);
    }
  }

  return { placeMarker };
})();
