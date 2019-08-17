# JASSL
(WIP) Just Another Sudoku Solving Library

### About
JASSL aims to be a sudoku solving companion library. In the simplest use-case it functions as a mere puzzle validator and cell tracker but has capabilities to completely solve most sudoku puzzles

### Install

```
npm install --save jassl
```


### API Overview

Create a new puzzle instance
```js
// import library
let SudokuPuzzle = require('jassl');

// empty puzzle
let puzzleValues = Array(81).fill();

// create puzzle entry: defaults to 9x9 with 3x3 sectors
let sudoku = new SudokuPuzzle(puzzleValues);
```

Attempt to solve puzzle
```js
// returns true if the puzzle was fully solved
let solved = sudoku.solve();
```

External Solve attempt
```js
try {
    sudoku.cells[0].solveTo(1);

// invalid solution for cell
} catch (e) {
    console.error(e.message);
}
```

Retrieving applicable candidates
```js
// for a cell
let cellCandidates = sudoku.cells[0].candidates;

// For a row
let rowCandidates = sudoku.rows[0].candidates;

// For a column
let columnCandidates = sudoku.columns[0].candidates;

// For a sector
let sectorCandidates = sudoku.sector[0].candidates;
```