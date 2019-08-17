/**
 * @module group
 * @exports SudokuGroup
 */

/**Wrapper for rows, columns and sectors in a sudoku puzzle instance
 * @private
 * @property {SudokuPuzzle} sudoku - The sudoku puzzle instance the group belongs to
 * @property {number} index - The index of the group
 * @property {SudokuCell[]} cells - List of cells in the group
 * @property {number[]} candidates - List of candidates left for the group
 * @property {boolean} solved - true if all cells in the group have been solved
 */
module.exports = class SudokuGroup {

    /** Creates a group instance
     * @param {'row'|'column'|'sector'} type The group type
     * @param {SudokuPuzzle} sudoku The sudoku puzzle instance the group belongs to
     * @param {number} index The index of the group
     * @param {SudokuCell[]} cells The cells belonging to the group
    */
    constructor(type, sudoku, index, cells) {
        this.sudoku = sudoku;
        this.index = index;
        this.candidates = Array(sudoku.groupLength).fill().map((value, index) => index);
        this.solved = false;

        // loop over each cell that is a part of the group and add a reference to the group on the cell
        let self = this;
        cells.forEach(() => cells[type] = self);
    }

    /**Removes a candidate from the group's candidate list and candidate list of each cell belonging to the group
     * @param {number} candidate The candidate to remove
     * @returns {boolean} true if the puzzle was updated, false otherwise
     */
    exclude(candidate) {

        // all cells in group have been solved
        if (this.solved) {
            return false;
        }

        // attempt to find the index of the candidate in the group's candidates list
        let idx = this.candidates.indexOf(candidate);

        // candidate not found
        if (idx === -1) {
            return false;
        }

        // exclude the candidate from all applicable cells in the group
        this.cells.forEach(cell => cell.exclude(candidate));

        // remove the candidate from the group's candidate list
        this.candidates = this.candidates.splice(idx, 1);

        // return true indicating the puzzle updated
        return true;
    }
};