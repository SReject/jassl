/*globals describe, it, beforeEach*/

const assert = require('assert');
const SudokuCell = require('../lib/cell.js');
const SudokuGroup = require('../lib/group.js');

describe('SudokuGroup', function () {
    describe('#Constructor', function () {
        let dummyPuzzle, dummyCells, group;
        beforeEach(function () {
            dummyPuzzle = {groupLength: 9};
            dummyCells = Array(9).fill().map((cell, index) => new SudokuCell(dummyPuzzle, index));
            group = new SudokuGroup('row', dummyPuzzle, 4, dummyCells);
        });
        it('Should throw an error for invalid group type', function () {
            assert.throws(() => new SudokuGroup('invalid', dummyPuzzle, 0, dummyCells));
        });
        it('Should throw an error if the sudoku is missing a groupLength property', function () {
            assert.throws(() => new SudokuGroup('row', {}, 4, dummyCells));
        });
        it('Should throw an error if the number of cells for the group does not match the puzzle\'s groupLength', function () {
            assert.throws(() => new SudokuGroup('row', {groupLength: 10}, 4, dummyCells));
        });
        it('Should store the sudoku', function () {
            assert.strictEqual(group.sudoku, dummyPuzzle);
        });
        it('Should store the group\'s index', function () {
            assert.strictEqual(group.index, 4);
        });
        it('Should store the group\'s cells', function () {
            assert.strictEqual(group.cells, dummyCells);
        });
        it('Should create a default list of candidates', function () {
            assert.strictEqual(group.candidates.join(''), '123456789');
        });
        it('Should set the solved property to false', function () {
            assert.strictEqual(group.solved, false);
        });
        it('Should add a reference to each cell in the group', function () {
            group.cells.forEach(cell => {
                if (cell.row !== group) {
                    throw new Error('Did not add reference to cell');
                }
            });
        });
    });

    describe('#exclude()', function () {
        let dummyPuzzle, dummyCells, group;
        beforeEach(function () {
            dummyPuzzle = {groupLength: 9};
            dummyCells = Array(9).fill().map((cell, index) => new SudokuCell(dummyPuzzle, index));
            group = new SudokuGroup('row', dummyPuzzle, 4, dummyCells);
        });
        it('Should throw an error if the candidate is invalid', function () {
            assert.throws(() => group.exclude('a'));
            assert.throws(() => group.exclude(0));
            assert.throws(() => group.exclude(10));
        });
        it('Should return false if the group has been solved', function () {
            group.solved = true;
            assert.strictEqual(group.exclude(1), false);
        });
        it('Should return false if the candidate is not in the group\'s candidate list', function () {
            group.candidates = [2];
            assert.strictEqual(group.exclude(1), false);
        });
        it('Should return true if the candidate is to be removed from the candidates list', function () {
            assert.strictEqual(group.exclude(1), true);
        });
        it('Should exclude a candidate from all cells in the group', function () {
            assert.strictEqual(group.exclude(1), true);
            group.cells.forEach(cell => {
                if (cell.candidates.indexOf(1) > -1) {
                    throw new Error('did not exclude candidate from cell');
                }
            });
        });
        it('Should remove the candidate from its own candidates list', function () {
            assert.strictEqual(group.exclude(1), true);
            if (group.candidates.indexOf(1) > -1) {
                throw new Error('Did not remove candidate from own group list');
            }
        });
    });

    describe('#excludeNakedSubsets()', function () {
        let dummyPuzzle, dummyCells, group;
        beforeEach(function () {
            dummyPuzzle = {groupLength: 9};
            dummyCells = Array(9).fill().map((cell, index) => new SudokuCell(dummyPuzzle, index));
            group = new SudokuGroup('row', dummyPuzzle, 4, dummyCells);
        });
        it('Should return false if the group has been solved', function () {
            group.solved = true;
            assert.strictEqual(group.excludeNakedSubsets(), false);
        });
        it('Should return false if no naked subsets are found', function () {
            group.cells.forEach((cell, index) => cell.candidates = [index + 1]);
            assert.strictEqual(group.excludeNakedSubsets(), false);
        });
        it('Should remove naked subsets', function () {
            group.cells[0].candidates = [1, 2];
            group.cells[1].candidates = [1, 2];
            assert.strictEqual(group.excludeNakedSubsets(), true);
            assert.strictEqual(group.cells[3].candidates[0], 3);
        });
    });
});