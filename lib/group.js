const {isUINT} = require('./misc/util.js');

module.exports = class SudokuGroup {

    constructor(type, sudoku, index, cells) {

        if (type !== 'row' && type !== 'column' && type !== 'sector') {
            throw new Error('invalid group type');
        }
        if (!sudoku.groupLength) {
            throw new Error('sudoku missing group length; unable to continue');
        }
        if (cells.length !== sudoku.groupLength) {
            throw new Error('invalid list of cells for group');
        }

        this.sudoku = sudoku;
        this.index = index;
        this.cells = cells;
        this.candidates = Array(sudoku.groupLength).fill().map((value, index) => index + 1);
        this.solved = false;

        // loop over each cell that is a part of the group and add a reference to the group on the cell
        cells.forEach(cell => cell[type] = this);
    }

    exclude(candidate) {

        // Validate candidate
        if (!isUINT(candidate, {min: 1, max: this.sudoku.groupLength})) {
            throw new Error('invalid candidate');
        }

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
        this.candidates.splice(idx, 1);

        // check if group has been solved; if so, update solved property
        if (this.candidates.length === 0) {
            this.solved = true;
        }

        // return true indicating the puzzle updated
        return true;
    }

    excludeNakedSubsets() {
        if (this.solved) {
            return false;
        }

        // get a list of unsolved cells with more than 1 candidate
        let subsets = {},
            cells = this.cells.filter(cell => !cell.solved && cell.candidates.length > 1);

        // build list of candidate subsets and cells belonging to the subset
        cells.forEach(cell => {
            let key = cell.candidates.join('-');

            if (subsets[key]) {
                subsets[key].push(cell);
            } else {
                subsets[key] = [cell];
            }
        });

        // Loop over each subset
        // returns true if any cell was updated, false otherwise
        return Object.keys(subsets).reduce((updated, key) => {

            // Naked subsets should have same number of cells as candidates for the cells
            if (subsets[key].length !== key.split('-').length) {
                return updated;
            }

            // Get the list of candidates belonging to the subset
            let candidates = subsets[key][0].candidates;

            // loop over each cell in the group
            return cells.reduce((updated, cell) => {

                // ignore cells that are part of the subset
                if (cell.candidates.join('-') === key) {
                    return updated;
                }

                // Remove candidates from the cell that are part of the subset
                return candidates.reduce((updated, candidate) => cell.exclude(candidate) || updated, updated);

            }, updated);
        }, false);
    }
};