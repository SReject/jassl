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
    it('Should solve a sole-candidate', function () {
        let puzzle, input = puzzles['Solved Puzzle'].slice(0);
        input[0] = 0;
        puzzle = new Sudoku(input);
        assert.strictEqual(puzzle.solve(), true);
        assert.strictEqual(puzzle.cells[0].value, 3);
    });
    it('Should solve a unique-candidate', function () {
        let puzzle = new Sudoku(puzzles['Unique Candidate']);
        assert.strictEqual(puzzle.solve(), false);
        assert.strictEqual(puzzle.cells[0].value, 1);
    });
});