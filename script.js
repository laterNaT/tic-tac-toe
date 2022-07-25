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

const gameBoard = (() => {
  let _board = [...Array(3)].map(() => [...Array(3)]); // 3x3 array
  const getBoard = () => _board;
  const newBoard = () => [...Array(3)].map(() => [...Array(3)]);
  const setBoard = (board) => { _board = board; };
  const _length = 9;
  const getLength = () => _length;
  const player1 = null;
  const player2 = null;

  return {
    getBoard, setBoard, newBoard, player1, player2, getLength,
  };
})();

const gameFlow = (() => {
  let _currentPlayer = 'x';
  let _gameIsOver = false;
  let _totalMoves = 0;

  const restartGame = () => {
    _gameIsOver = false;
    _totalMoves = 0;
  };

  const resetScores = () => {
    gameBoard.player1.resetScore();
    gameBoard.player2.resetScore();
  };

  const foundWinner = () => gameBoard.player1.isWinner() || gameBoard.player2.isWinner();

  const checkRows = (board) => {
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        if (gameBoard.player1.compareMarker(board[row][col])) {
          gameBoard.player1.addScore();
        } else if (gameBoard.player2.compareMarker(board[row][col])) {
          gameBoard.player2.addScore();
        }
      }
      if (foundWinner()) {
        return true;
      }
      resetScores();
    }
    return false;
  };

  const checkColumns = (board) => {
    for (let col = 0; col < board.length; col += 1) {
      for (let row = 0; row < board.length; row += 1) {
        if (gameBoard.player1.compareMarker(board[row][col])) {
          gameBoard.player1.addScore();
        } else if (gameBoard.player2.compareMarker(board[row][col])) {
          gameBoard.player2.addScore();
        }
      }
      if (foundWinner()) {
        return true;
      }
      resetScores();
    }
    return false;
  };

  const checkDiagonal = (board) => {
    for (let i = 0; i < board.length; i += 1) {
      if (gameBoard.player1.compareMarker(board[i][i])) {
        gameBoard.player1.addScore();
      } else if (gameBoard.player2.compareMarker(board[i][i])) {
        gameBoard.player2.addScore();
      }
    }
    if (foundWinner()) {
      return true;
    }
    resetScores();
    return false;
  };

  const checkAntiDiagonal = (board) => {
    let row = 0;
    for (let col = board.length - 1; col >= 0; col -= 1) {
      if (gameBoard.player1.compareMarker(board[row][col])) {
        gameBoard.player1.addScore();
      } else if (gameBoard.player2.compareMarker(board[row][col])) {
        gameBoard.player2.addScore();
      }
      row += 1;
    }
    if (foundWinner()) {
      return true;
    }
    resetScores();
    return false;
  };

  const decideWinner = (board) => checkRows(board)
   || checkColumns(board)
   || checkDiagonal(board)
   || checkAntiDiagonal(board);

  const placeMarker = (event) => {
    if (event.target.classList.contains('js-marked') || _gameIsOver) {
      return;
    }

    const { rowIndex, colIndex } = event.target.dataset;
    const board = gameBoard.getBoard();

    board[rowIndex][colIndex] = _currentPlayer;
    event.target.classList.add('js-marked');
    if (_currentPlayer === 'x') {
      event.target.classList.add('js-marked-x');
    } else {
      event.target.classList.add('js-marked-o');
    }

    _totalMoves += 1;
    if (_totalMoves >= gameBoard.getLength()) {
      displayController.displayTie();
      return;
    }

    if (decideWinner(board)) {
      _gameIsOver = true;
      const winner = gameBoard.player1.isWinner() ? gameBoard.player1 : gameBoard.player2;
      displayController.displayWinner(winner);
    }
    _currentPlayer = (_currentPlayer === 'x') ? 'o' : 'x';
  };

  return { placeMarker, restartGame };
})();

const displayController = (() => {
  // hide grid before both players input their name
  const _gridContainer = document.querySelector('.grid-container');
  const _formContainer = document.querySelector('.form-container');
  _gridContainer.style.visibility = 'hidden';

  // create player objects from form data
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const playerX = formData.get('player-x');
    const playerO = formData.get('player-o');
    gameBoard.player1 = Player(playerX, 'x');
    gameBoard.player2 = Player(playerO, 'o');
    _formContainer.style.display = 'none';
    _gridContainer.style.visibility = 'visible';
  });

  const createGrid = () => {
    _gridContainer.replaceChildren(); // clear board
    const board = gameBoard.getBoard();
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        const jsGridItem = document.createElement('button');
        jsGridItem.classList.add('js-grid-item');
        jsGridItem.dataset.colIndex = col.toString();
        jsGridItem.dataset.rowIndex = row.toString();
        jsGridItem.addEventListener('click', gameFlow.placeMarker, { once: true });
        _gridContainer.appendChild(jsGridItem);
      }
    }
  };

  const addRestartBtn = () => {
    const restartBtn = document.createElement('button');
    restartBtn.classList.add('btn', 'restart-btn');
    restartBtn.innerText = 'Restart game';
    restartBtn.addEventListener('click', () => {
      // reset array
      gameBoard.setBoard(gameBoard.newBoard());

      // reset DOM
      createGrid();

      // reset score
      gameBoard.player1.resetScore();
      gameBoard.player2.resetScore();

      // reset game data
      gameFlow.restartGame();

      // reset winner/tie text
      document.querySelector('.winner-container > h1').innerText = '';
    });
    _gridContainer.appendChild(restartBtn);
  };

  const displayWinner = (winner) => {
    const winnerContainer = document.querySelector('.winner-container');
    const winnerName = winner.getName();
    winnerContainer.querySelector('h1').innerText = `${winnerName} wins!`;
    addRestartBtn();
  };

  const displayTie = () => {
    const winnerContainer = document.querySelector('.winner-container');
    winnerContainer.querySelector('h1').innerText = 'It\'s a tie!';
    addRestartBtn();
  };

  return {
    createGrid, displayWinner, displayTie, addRestartBtn,
  };
})();

displayController.createGrid();
