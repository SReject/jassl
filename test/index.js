/*globals describe, it*/

const assert = require('assert');
const puzzles = require('./puzzles');
const Sudoku = require('../');
const {isUINT} = require('../lib/misc/util.js');

describe('toUINT()', function () {
    it('Should return false if input is not numerical', function () {
        assert.strictEqual(isUINT(null), false);
        assert.strictEqual(isUINT(true), false);
        assert.strictEqual(isUINT(false), false);
        assert.strictEqual(isUINT('text'), false);
        assert.strictEqual(isUINT([]), false);
        assert.strictEqual(isUINT({}), false);
    });
    it('Should return false if the input is less than 0', function () {
        assert.strictEqual(isUINT(-1), false);
    });
    it('Should return false if input is a decimal', function () {
        assert.strictEqual(isUINT(1.2), false);
    });
    it('Should return true if input is equal to or greater than specified minimum', function () {
        assert.strictEqual(isUINT(1, {min: 1}), true);
        assert.strictEqual(isUINT(2, {min: 1}), true);
    });
    it('Should return false if input is below specified minimum', function () {
        assert.strictEqual(isUINT(0, {min: 1}), false);
    });
    it('Should return true if input is equal to or less than specified maximum', function () {
        assert.strictEqual(isUINT(2, {max: 2}), true);
        assert.strictEqual(isUINT(1, {max: 2}), true);
    });
    it('Should return false if input is above specified maximum', function () {
        assert.strictEqual(isUINT(2, {max: 1}), false);
    });
    it('Should return false if input falls outside of specified minimum and maximum ranges', function () {
        assert.strictEqual(isUINT(3, {min: 4, max: 6}), false);
        assert.strictEqual(isUINT(4, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(5, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(6, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(7, {min: 4, max: 6}), false);
    });
});

describe('SudokuSolver Class', function () {
    describe('#Constructor()', function () {
        describe('Puzzle inputs', function () {
            it('must be an array', function () {
                assert.throws(() => new Sudoku());
            });
            it('must be square', function () {
                assert.throws(() => new Sudoku(puzzles['Non-Square Puzzle']));
            });
            it('must only have cell values that are unsigned integers', function () {
                assert.throws(() => new Sudoku(puzzles['Invalid:Decimal']));
                assert.throws(() => new Sudoku(puzzles['Invalid:String']));
                assert.throws(() => new Sudoku(puzzles['Invalid:NumericString']));
            });
            it('must not have any cell value greater than the number of cells in a group', function () {
                assert.throws(() => new Sudoku(puzzles['Invalid:ValueToLarge']));
            });
        });

        describe('Sector-size inputs', function () {
            let puzzle = puzzles['Empty Puzzle'];
            it('May be omitted', function () {
                new Sudoku(puzzle);
            });
            it('May not be anything else other than a number or object if specified', function () {
                assert.throws(() => new Sudoku(puzzle, true));
                assert.throws(() => new Sudoku(puzzle, 'text'));
                assert.throws(() => new Sudoku(puzzle, []));
            });
            it('May be numerical', function () {
                new Sudoku(puzzle, 3);
            });
            it('Must be an unsigned integer if specified as a number', function () {
                assert.throws(() => new Sudoku(puzzle, 3.1));
            });
            it('May be an empty object', function () {
                new Sudoku(puzzle, {});
            });
            it('May be an object with only a width specified', function () {
                new Sudoku(puzzle, {width: 3});
            });
            it('As an object specifying a width must be an unsigned integer', function () {
                assert.throws(() => new Sudoku(puzzle, {width: 'a'}));
            });
            it('May be an object with only a height specified', function () {
                new Sudoku(puzzle, {height: 3});
            });
            it('As an object specifying a height must be an unsigned integer', function () {
                assert.throws(() => new Sudoku(puzzle, {width: 3, height: 'a'}));
            });
            it('May be an object that specifies both width and height', function () {
                new Sudoku(puzzle, {width: 3, height: 3});
            });
            it('Must divide the group-length evenly', function () {
                assert.throws(() => new Sudoku(puzzle, 4));
            });
        });

        describe('Should be able to create an instance', function () {
            it('With no solved cells', function () {
                new Sudoku(puzzles['Empty Puzzle']);
            });
            it('With at least one cell solved', function () {
                new Sudoku(puzzles['1 Solved Cell']);
            });
            it('With all cells solved', function () {
                new Sudoku(puzzles['Solved Puzzle']);
            });
        });

        describe('Should be able to create non-traditional sized puzzles', function () {
            it('25x25 with assumed sector size', function () {
                new Sudoku(puzzles['25x25 Puzzle']);
            });
            it('10x10 with specified sector size', function () {
                new Sudoku(puzzles['10x10 Puzzle'], {width: 5, height: 5});
            });
        });
    });

    describe('#solved', function () {
        it('should return true if the puzzle has been solved', function () {
            let puzzle = new Sudoku(puzzles['Solved Puzzle']);

            assert.strictEqual(puzzle.solved, true, 'Puzzle should have indicated it was solved');
        });

        it('should return false if the puzzle has not been solved', function () {
            let puzzle = new Sudoku(puzzles['Empty Puzzle']);

            assert.strictEqual(puzzle.solved, false, 'Puzzle should have indicated it was not solved');
        });
    });
});