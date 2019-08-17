/**
 * @module cell
 * @exports SudokuCell
 */

/**Deduces if a candidate is unique to the cell for the group
 * @param {SudokuCell} self The cell in question
 * @param {SudokuGroup} group The group to check against
 * @param {number} candidate The candidate to check
 * @returns {boolean} true if the candidate is unique to the cell, false otherwise
*/
const uniqueInGroup = (self, group, candidate) => !group.cells.find(groupCell => self !== groupCell && !groupCell.solved && groupCell.candidates.indexOf(candidate) > -1);

/**Wrapper for cells within a sudoku puzzle instance
 * @private
 * @property {number} index the cell's index in the grid
 * @property {boolean} solved true if the cell has been solved
 * @property {array<Number>} candidates list of possibile solutions for the cell
 * @property {SudokuPuzzle} sudoku reference to the sudoku puzzle the cell is a part of
 * @property {SudokuCellGroup} row reference to the row instance the cell is a part of
 * @property {SudokuCellGroup} column reference to the column instance the cell is a part of
 * @property {SudokuCellGroup} sector reference to the sector instance the cell is a part of
 */
module.exports = class SudokuCell {

    /**Creates a cell instance
     * @param {SudokuPuzzle} sudoku Instance of sudoku puzzle the cell is a part of
     * @param {number} index The cell's index in the sudoku puzzle
     */
    constructor(sudoku, index) {
        this.sudoku = sudoku;
        this.index = index;
        this.candidates = Array(sudoku.groupLength).fill().map((value, index) => index);
        this.solved = false;
    }

    /**Removes a candidate from the cell's candidate list
     * @param {number} candidate The candidate value to remove
     * @returns {boolean} true if the candidate was removed, false if not
     * @throws {Error} Removing the candidate would leave the cell without a possible solution
    */
    exclude(candidate) {
        if (this.solved) {
            return false;
        }

        // find the specified candidate in the cell's candidates list
        let idx = this.candidates.findIndex(value => value === candidate);

        // candidate not found
        if (idx === -1) {
            return false;
        }

        // no candidates would be left for the cells
        if (this.candidates.length === 1) {
            throw new Error('No candidates would be left');
        }

        // remove the candidate
        this.candidates.splice(idx, 1);

        // return true indicating the cell was changed
        return true;
    }

    /**Sets the cell's state to solved using the specified value
     * @param {number} solution The value to use as the cell's solution
     * @returns {boolean} true if the cell was solved
     * @throws {Error} The cell has already been solved
     * @throws {Error} The specified solution is not in the cell's candidates list
    */
    solveTo(solution) {
        if (this.solved) {
            throw new Error('cell already solved');
        }

        if (this.candidates.indexOf(solution) === -1) {
            throw new Error('given solution for cell is not valid');
        }

        // Update cell
        this.value = solution;
        this.solved = true;
        this.candidates = [];

        // Remove the solution from candidate lists of cells that share this row column or sector
        this.row.exclude(solution);
        this.column.exclude(solution);
        this.sector.exclude(solution);
        return true;
    }

    /**Attempts to solve the cell, first by sole-candidate then unique-candidate
     * @returns {boolean} true if the cell was solved, false otherwise
    */
    solve() {

        // cell has already been solved
        if (this.solved) {
            return false;
        }

        // Sole Candidate
        if (this.candidates.length === 1) {
            return this.solveTo(this.candidates[0]);
        }

        // Attempt to find a candidate that is unique to the cell
        let uniqueCandidate = this.candidates.find(candidate => {
            if (
                uniqueInGroup(this, this.row, candidate) ||
                uniqueInGroup(this, this.column, candidate) ||
                uniqueInGroup(this, this.sector, candidate)
            ) {
                return true;
            }
        });

        // No unqiue candidates for the cell
        if (!uniqueCandidate) {
            return false;
        }

        // solve the cell using the uniqueCandidate as the solution
        return this.solveTo(uniqueCandidate);
    }
};