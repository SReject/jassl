/*globals describe, it, beforeEach*/

const assert = require('assert');
const puzzles = require('./puzzles');
const SudokuPuzzle = require('../');


describe('SudokuCell#solve()', function () {
    let puzzle;
    beforeEach(function () {
        puzzle  = new SudokuPuzzle(puzzles['SudokuCell.solve()']);
    });
    it('Should return false if the cell has already been solved', function() {
        assert.strictEqual(puzzle.cells[0].solve(), false);
    });
    it('Should return false if the cell cannot be solved', function () {
        assert.strictEqual(puzzle.cells[80].solve(), false);
        assert.strictEqual(puzzle.cells[80].value, undefined);
    });
    it('Should solve if the cell has only one candidate', function() {
        assert.strictEqual(puzzle.cells[1].solve(), true);
        assert.strictEqual(puzzle.cells[1].value, 2);
    });
    it('Should solve cell if it has a unique candidate', function () {
        assert.strictEqual(puzzle.cells[10].solve(), true);
        assert.strictEqual(puzzle.cells[10].value, 9);
    });
});