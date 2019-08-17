/**
 * @module solveCells
 * @exports solveCells
 */

/**Calls each cell in the puzzle's .solve() function
 * @param {SudokuPuzzle} puzzle the puzzle to process
 * @returns {boolean} true if atleast one cell was solved
*/
module.exports = function solveCells(puzzle) {
    return puzzle.cells.reduce((changed, cell) => cell.solve() || changed, false);
};