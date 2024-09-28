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
      value: 'X'
    },
    {
      name: playerTwo,
      value: 'O'
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

  // Check if either player won or it's a tie
  // For a win, returns 1
  // For tie, returns 2
  // If game is not over, returns 0
  const isGameOver = () => {
    const playerOneWon = board.checkWin(players[0].value);
    const playerTwoWon = board.checkWin(players[1].value);
    const tie = board.checkTie();

    console.log(playerOneWon || playerTwoWon || tie);
    
    if (playerOneWon || playerTwoWon) {
      return 1;
    } else if (tie) {
      return 2;
    } else {
      return 0;
    }
  };

  // Main game round flow
  const playRound = (row, column) => {

    // Check if game is already over. If yes, there's no move
    if (isGameOver() != 0) {
      console.log("Game already over.");
      return;
    };

    // Mark the square. If valid move, returns true.
    if (board.markSquare(row, column, getActivePlayer().value)) {

      // Mark a square for the current player
      console.log(`Making ${getActivePlayer().name}'s tic in row ${row} column ${column}...`);

      if (isGameOver() != 0) {
        // If game over, update the screen and return
        ScreenController.updateScreen();
        return;
      }

      // Switch active player if game isn't over
      switchPlayerTurn();

    } else {
      console.log("Invalid move!");
    }


    // Next round
    // printNewRound();
  }

  // Initial round (console mode)
  // printNewRound();

  return { getActivePlayer, getBoard, isGameOver, playRound };
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

    if (game.isGameOver() == 0) {
      activePlayerSpan.innerHTML = `It's ${updatedActivePlayer.name}'s turn.`;
    } else if (game.isGameOver() == 1) {
      activePlayerSpan.innerHTML = `Game over! ${updatedActivePlayer.name} won!`;
    } else if (game.isGameOver() == 2) {
      activePlayerSpan.innerHTML = `Game over! It's a tie!`;
    } 
  }
};
