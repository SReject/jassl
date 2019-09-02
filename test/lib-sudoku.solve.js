/*globals describe, it*/

const assert = require('assert');
const puzzles = require('./puzzles');
const Sudoku = require('..');

describe('SudokuPuzzle#solve()', function () {
    it('Should return true if the puzzle has already been solved', function () {
        let puzzle = new Sudoku(puzzles['Solved Puzzle']);
        assert.strictEqual(puzzle.solve(), true, 'Puzzle should have indicated it was solved');
    });
    it('Should return false if the puzzle could not be solved', function () {
        let puzzle = new Sudoku(puzzles['Empty Puzzle']);
        assert.strictEqual(puzzle.solve(), false, 'Puzzle should have indicated it could not be solved');
    });
});