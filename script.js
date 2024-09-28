let game;

// Set up button event listeners
window.onload = function() {
  
  game = GameController();
  ScreenController.updateScreen();
  
  // Loop for adding event listeners for all cells
  document.querySelectorAll('button').forEach(button => {
    
    button.addEventListener('click', function() {

      const row = button.getAttribute('data-row');
      const column = button.getAttribute('data-column');
      game.playRound(row, column);

      ScreenController.updateScreen();
    });
  });

}

// Gameboard object
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Add a Square into each square of the board
  // Start off with an empty board
  for (let i = 0; i < rows; i++) {
    board[i] = []; // For each row, create an empty array
    for (let j = 0; j < columns; j++) {
      board[i].push(Square()); // Then, push 3 squares into the empty array
      // Result, 3x3 array
    }
  }

  // Method for getting the entire board
  const getBoard = () => board;

  // Print out the board
  const printBoard = () => {
    
    const boardWithValues = board.map(
      (row) => row.map(
        (square) => square.getValue()
      )
    );

    console.log(boardWithValues);
  };

  // Check if square is empty and if yes, mark the player's symbol
  const markSquare = (row, column, player) => {
    // Check if the square is empty
    if (board[row][column].getValue() == 0) {

      board[row][column].setValue(player);
      return true;
    } else {

      console.log("Not a valid move!");
      return false;
    }
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };

  // Check if player has won
  const checkWin = (player) => {
    // Iterate through rows
    for (let i = 0; i < rows; i++) {
      // Check if all is equal
      if (board[i].every(element => element.getValue() === player)) {
        console.log("row win");
        return true;
      } 
    };
    // Transpose the board to check columns as rows
    const transposedBoard = transpose(board);

    // Check columns (which are now rows of the transposed board)
    for (let i = 0; i < columns; i++) {
      if (transposedBoard[i].every(element => element.getValue() === player)) {
          console.log("column win");
          return true;
      }
    }

    const diagonal1 = [board[0][0],board[1][1],board[2][2]];
    const diagonal2 = [board[0][2],board[1][1],board[2][0]];

    if (diagonal1.every(element => element.getValue() === player)) {
      console.log("dia1 win");
      return true;
    }

    if (diagonal2.every(element => element.getValue() === player)) {
      console.log("dia2 win");
      return true;
    }

    return false;
  }

  // Checks if board still includes 0. If not, it's a tie.
  const checkTie = () => {
    return board.every(row => row.every(square => square.getValue() !== 0));
  }

  // Provide interface
  return { getBoard, printBoard, markSquare, checkWin, checkTie };
}

// Square
function Square() {
  let value = 0;
  // let value = Math.floor(Math.random() * 3);

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { setValue, getValue };
}

// Main game logic
function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  // Initialize a new board
  const board = Gameboard();

  // Initialise two players
  const players = [
    {
      name: playerOne,
      value: 1
    },
    {
      name: playerTwo,
      value: 2
    }
  ];

  // Set player one to start
  let activePlayer = players[0];
  
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  // Print in console new round
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  };

  // Get updated board info
  const getBoard = () => {
    return board.getBoard();
  };

  const isGameOver = () => {
    
    const playerOneWon = board.checkWin(players[0].value);
    
    const playerTwoWon = board.checkWin(players[1].value);

    const tie = board.checkTie();
    console.log(playerOneWon || playerTwoWon || tie);
    
    return playerOneWon || playerTwoWon || tie;
  };

  // Main game round flow
  const playRound = (row, column) => {

    // Check if game is already over. If yes, there's no move
    if (isGameOver()) {
      return;
    };

    // Mark the square. If valid move, returns true.
    if (board.markSquare(row, column, getActivePlayer().value)) {

      // Mark a square for the current player
      console.log(`Making ${getActivePlayer().name}'s tic in row ${row} column ${column}...`);

      // Win logic here
      if (board.checkWin(getActivePlayer().value)) {
        console.log("Winner");
        return;
      }
      
      // Tie logic
      if (board.checkTie()) {
        console.log("Tie! Game over!");
        return;
      }

      // Switch active player
      switchPlayerTurn();
    }


    // Next round
    // printNewRound();
  }

  // Initial round (console mode)
  // printNewRound();

  return { getActivePlayer, getBoard, playRound };
}

// Control the screen
const ScreenController = {
  /**
   * Updates everything on the screen based on updated info.
   * 
   * Get updated board from game controller
   * Clear the current board display
   * Render each grid square
   * Get updated active player
   */
  updateScreen: function() {

    // Get updated board from game
    const updatedBoard = game.getBoard();
    
    // Update gameboard
    document.querySelectorAll('button').forEach( button => { 
      
      // Clear current board display
      button.innerHTML = ''; 
    
      // Get the button value from the updated board
      const row = button.getAttribute('data-row');
      const column = button.getAttribute('data-column');
      const newValue = updatedBoard[row][column].getValue();

      if (newValue == 0) {
        button.innerHTML = '';
      } else {
        button.innerHTML = newValue;
      }
    });

    // Update active player
    const updatedActivePlayer = game.getActivePlayer();
    const activePlayerSpan = document.querySelector('#active-player');
    activePlayerSpan.innerHTML = updatedActivePlayer.name;
  }
};
