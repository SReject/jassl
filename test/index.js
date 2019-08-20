/*globals describe, it*/

const assert = require('assert');
const puzzles = require('./puzzles');
const Sudoku = require('..');


describe('SudokuSolver Class', function () {
    describe('#Constructor()', function () {
        describe('Should require', function () {
            it('An array as the puzzle input', function () {
                assert.throws(() => new Sudoku());
            });

            it('Puzzles to be a square', function () {
                assert.throws(() => new Sudoku(puzzles['Non-Square Puzzle']));
            });

            it('All given cell values to be unsigned integer', function () {
                assert.throws(() => new Sudoku(puzzles['Invalid:Decimal']));
                assert.throws(() => new Sudoku(puzzles['Invalid:String']));
                assert.throws(() => new Sudoku(puzzles['Invalid:NumericString']));
            });

            it('All cell values to be no greater than the number of cells in a group', function () {
                assert.throws(() => new Sudoku(puzzles['Invalid:ValueToLarge']));
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


