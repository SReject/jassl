const uniqueInGroup = (self, group, candidate) => !group.cells.find(groupCell => self !== groupCell && !groupCell.solved && groupCell.candidates.indexOf(candidate) > -1);

module.exports = class SudokuCell {

    constructor(sudoku, index) {
        this.sudoku = sudoku;
        this.index = index;
        this.candidates = Array(sudoku.groupLength).fill().map((value, index) => index + 1);
        this.solved = false;
    }

    exclude(candidate) {

        // TODO?: Throw error if candidate is outside of groupLength

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

    solveTo(solution) {

        // TODO?: Throw error if candidate is outside of groupLength

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