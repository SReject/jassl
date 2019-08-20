/*globals describe, it*/

const assert = require('assert');
const puzzles = require('./puzzles');
const Sudoku = require('..');


describe('SudokuSolver', function () {
    describe('#Constructor()', function () {
        it('should be able to create an instance with no solved cells', function () {
            new Sudoku(puzzles['Empty Puzzle']);
        });

        it('should be able to create an instance with at least one cell solved', function () {
            new Sudoku(puzzles['1 Solved Cell']);
        });

        it('should be able to create an instance with all cells solved', function () {
            new Sudoku(puzzles['Solved Puzzle']);
        });

        it('should require puzzles to be a square', function () {
            assert.throws(() => new Sudoku(puzzles['Non-Square Puzzle']));
        });

        describe('should be able to create non-traditional sized puzzles', function () {
            it('25x25 with assumed sector size', function () {
                new Sudoku(puzzles['25x25 Puzzle']);
            });

            it('10x10 with specified sector size', function () {
                new Sudoku(puzzles['10x10 Puzzle'], {width: 5, height: 5});
            });
        });
    });
});


