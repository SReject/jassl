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
        // TODO?: throw error if invalid type(row, column, sector)
        // TODO?: throw error if sudoku doesn't have groupLength value?
        // TODO?: throw error if cells is not a populated array of sudoku.groupLength items

        this.sudoku = sudoku;
        this.index = index;
        this.cells = cells;
        this.candidates = Array(sudoku.groupLength).fill().map((value, index) => index + 1);
        this.solved = false;

        // loop over each cell that is a part of the group and add a reference to the group on the cell
        cells.forEach(cell => cell[type] = this);
    }

    /**Removes a candidate from the group's candidate list and candidate list of each cell belonging to the group
     * @param {number} candidate The candidate to remove
     * @returns {boolean} true if the puzzle was updated, false otherwise
     */
    exclude(candidate) {

        //TODO? throw error if candidate is outside of groupLength

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

        // TODO?: throw error if candidate removal would leave the group without the candidate

        // exclude the candidate from all applicable cells in the group
        this.cells.forEach(cell => cell.exclude(candidate));

        // remove the candidate from the group's candidate list
        this.candidates.splice(idx, 1);

        // check if group has been solved; if so, update solved property
        if (this.candidates.length === 0) {
            this.solved = true;
        }

        // return true indicating the puzzle updated
        return true;
    }

    excludeNakeSubsets() {
        if (this.solved) {
            return false;
        }


        // get a list of unsolved cells with more than 1 candidate
        let updated = false,
            subsets = {},
            cells = this.cells.filter(cell => !cell.solved && cell.candidates.length > 1);

        // build list of candidate subsets and cells belonging to the subset
        cells.forEach(cell => {
            let key = cell.candidates.join('');

            if (subsets[key]) {
                subsets[key].push(cell);
            } else {
                subsets[key] = [cell];
            }
        });

        Object.keys(subsets).forEach(key => {

            // naked subsets should have same number of cells as candidates for the cells
            if (subsets[key].length !== key.length) {
                return;
            }

            // get a list of candidates for the subset
            let candidates = subsets[key][0].candidates;

            // loop over each cell in the group
            cells.forEach(cell => {

                // cell is a part of the subset, ignore
                if (cell.candidates.join('') === key) {
                    return;
                }

                // remove candidates of the subset cells from all cells not part of the subset
                candidates.forEach(candidate => {

                    // cell has candidate from subset
                    if (cell.candidates.indexOf(candidate) > -1) {
                        updated = cell.exclude(candidate) || updated;
                    }
                });
            });
        });

        return updated;
    }
};