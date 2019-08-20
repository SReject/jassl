/*globals describe, it*/

const assert = require('assert');
const puzzles = require('./puzzles');
const Sudoku = require('..');


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

            it('May be numerical', function () {
                new Sudoku(puzzle, 3);
            });

            it('May be an empty object', function () {
                new Sudoku(puzzle, {});
            });

            it('May be an object with only a width specified', function () {
                new Sudoku(puzzle, {width: 3});
            });

            it('May be an object with only a height specified', function () {
                new Sudoku(puzzle, {height: 3});
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


