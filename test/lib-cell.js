/*globals describe, it, beforeEach*/

const assert = require('assert');
const SudokuCell = require('../lib/cell.js');
const {getType} = require('../lib/misc/util.js');

describe('SudokuCell Class', function () {
    let sudoku = {groupLength: 9};

    describe('#Constructor', function () {
        it('Should create an empty cell', function () {
            new SudokuCell(sudoku, 0);
        });
        it('Should store the sudoku puzzle instance', function () {
            let cell = new SudokuCell(sudoku, 0);
            assert.strictEqual(cell.sudoku, sudoku);
        });
        it('Should have its index property set', function () {
            let cell = new SudokuCell(sudoku, 5);
            assert.strictEqual(getType(cell.index), 'number');
            assert.strictEqual(cell.index, 5);
        });
        it('Should have a default list of candidates', function () {
            let cell = new SudokuCell(sudoku, 0);
            assert.strictEqual(getType(cell.candidates), 'array');
            assert.strictEqual(cell.candidates.join(''), '123456789');
        });
        it('Should not be set as solved', function () {
            let cell = new SudokuCell(sudoku, 0);
            assert.strictEqual(cell.solved, false);
        });
    });

    describe('#exclude()', function () {
        let cell;
        beforeEach(function (done) {
            cell = new SudokuCell(sudoku, 0);
            cell.row = cell.column = cell.sector = {exclude: () => void 0};
            done();
        });

        it('Should return false if the cell is solved', function () {
            cell.solved = true;
            assert.strictEqual(cell.exclude(9), false);
            assert.strictEqual(cell.candidates.findIndex(candidate => candidate === 9), 8);
        });
        it('Should return false if the candidate is not found', function () {
            assert.strictEqual(cell.exclude(10), false);
            assert.strictEqual(cell.candidates.join(''), '123456789');
        });
        it('Should remove the candidate if found in the candidate list and return true', function () {
            assert.strictEqual(cell.exclude(1), true);
            assert.strictEqual(cell.candidates.findIndex(candidate => candidate === 1), -1);
        });
        it('Should throw an error if no candidates for the cell would be left', function () {
            cell.candidates = [1];
            assert.throws(() => cell.exclude(1));
        });
    });

    describe('#solveTo()', function () {
        let cell;
        beforeEach(function (done) {
            cell = new SudokuCell(sudoku, 0);
            cell.row = cell.column = cell.sector = {exclude: () => void 0};
            done();
        });

        it('Should throw an error if the cell has already been solved', function () {
            cell.solved = true;
            assert.throws(() => cell.solveTo(1));
        });
        it('Should throw an error if the specified solution is not a candidate for the cell', function () {
            assert.throws(() => cell.solveTo(10));
        });
        it('Should update state to being solved if solution is valid', function () {
            assert.strictEqual(cell.solveTo(1), true);
            assert.strictEqual(cell.value, 1);
            assert.strictEqual(cell.solved, true);
            assert.strictEqual(cell.candidates.length, 0);
        });
    });
});