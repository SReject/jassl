/**
 * @module solveCells
 * @exports solveCells
 */

/**Calls each cell in the puzzle's .solve() function
 * @param {SudokuPuzzle} sudoku the puzzle to process
 * @returns {boolean} true if atleast one cell was solved
*/
module.exports = function solveCells(sudoku) {
    return sudoku.cells.reduce((changed, cell) => cell.solve() || changed, false);
};