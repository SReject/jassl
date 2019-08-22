[![Build Status](https://travis-ci.org/SReject/jassl.svg?branch=master)](https://travis-ci.org/SReject/jassl) [![npm](https://img.shields.io/npm/v/jassl "npm")](https://npmjs.com/package/jassl) [![Dev Dependencies](https://img.shields.io/david/dev/sreject/jassl)](https://david-dm.org/SReject/jassl?type=dev) [![Coverage Status](https://coveralls.io/repos/github/SReject/jassl/badge.svg?branch=master)](https://coveralls.io/github/SReject/jassl?branch=master)

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

// empty list of values for the puzzle
let puzzleValues = Array(81).fill();

// create sudoku instance: defaults to 9x9 with 9 3x3 sectors
let sudoku = new SudokuPuzzle(puzzleValues);
```

Create puzzle instance with non-traditional sector size
```js
// empty list of values for the puzzle
let puzzleValues = Array(10 * 10).fill();

// creates a 10x10 with 10 5x2 sectors
let sudoku = new SudokuPuzzle(puzzleValues, {sectorWidth: 5, sectorHeight: 2});
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