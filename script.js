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

  // Provide interface
  return { getBoard, printBoard, markSquare, checkWin };
}

// Square
function Square() {
  let value = 0;

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

  // Next round
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  };

  const playRound = (row, column) => {

    // Mark a square for the current player
    console.log(`Making ${getActivePlayer().name}'s tic in row ${row} column ${column}...`);

    // Mark the square. If valid move, returns true.
    if (board.markSquare(row, column, getActivePlayer().value)) {

      // Win logic here
      if (board.checkWin(getActivePlayer().value)) {
        console.log("winner");
      }

      // Switch active player
      switchPlayerTurn();
    }

    // Next round
    printNewRound();
  }

  // Initial round
  printNewRound();

  return { getActivePlayer, playRound };
}

const game = GameController();

game.playRound(0,2);
game.playRound(1,0);
game.playRound(1,1);
game.playRound(1,2);
game.playRound(2,0);
