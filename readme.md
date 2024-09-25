# Tic Tac Toe

Goal is to create a JS tic tac toe game.

## Requirements

1. Gameboard stored as an array inside of a Gameboard object.

2. Players stored in objects.

3. Object to control the gameflow.

4. Use factories. If only need a single instance of something, use the module pattern.

## Plan

1. Brainstorm the main logic.

2. Build it out in the console first.

## Development Notes

Gameboard is a 3x3 array
Players are 'x' or 'o'.
Players take turns inserting the piece onto the board.

After every move, game should check for a gameover condition:
1) If the player has 3 in a row/diagonal, they win.
2) Otherwise, if the board is full, it's a tie.

Game starts with initializing the gameboard as an empty array.

Start out with creating the gameboard object.
