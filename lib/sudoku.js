const {isUINT, getType} = require('./misc/util');

const SudokuCell = require('./cell');
const SudokuGroup = require('./group');
const SudokuSector = require('./sector');

module.exports = class SudokuPuzzle {

    constructor(puzzle, sectorSize) {

        // Puzzle not specified
        if (!Array.isArray(puzzle)) {
            throw new Error('INVALID_PUZZLE: puzzle must be an 1-dimensional array');
        }

        // Puzzle must be a square
        let groupLength = Math.sqrt(puzzle.length);
        if (!isUINT(groupLength)) {
            throw new Error('INVALID_PUZZLE: puzzle must be a square: ' + isUINT(groupLength));
        }

        // Every cell value in the puzzle must be an unsigned integer no larger than the length of a row|column|sector
        if (!puzzle.every(value => value == null || isUINT(value, {max: groupLength}))) {
            throw new Error('PUZZLE_INVALID: puzzle must only contain unsigned integer values');
        }

        // Sector size not specified
        if (!sectorSize) {
            sectorSize = Math.sqrt(groupLength);
        }

        // sector size is numeric
        if (isUINT(sectorSize)) {
            sectorSize = {width: sectorSize, height: sectorSize};

        // sector size invalid
        } else if (getType(sectorSize) !== 'object') {
            throw new Error('PUZZLE_INVALID: invalid sector size');
        }

        // sector size does not contain either width or height property
        if (!sectorSize.width && !sectorSize.height) {
            sectorSize = Math.sqrt(groupLength);
            sectorSize = {width: sectorSize, height: sectorSize};
        }

        // only one dimension of the sector specified
        if (!sectorSize.width) {
            sectorSize.width = sectorSize.height;
        } else if (!sectorSize.height) {
            sectorSize.height = sectorSize.width;
        }

        // sector width|height not an unsigned integer
        if (!isUINT(sectorSize.width)) {
            throw new Error('PUZZLE_INVALID: sector width not an unsigned integer');
        }
        if (!isUINT(sectorSize.height)) {
            throw new Error('PUZZLE_INVALID: sector height not an unsigned integer');
        }

        // sector must have same number of cells as does rows and columns
        if (sectorSize.width * sectorSize.height !== groupLength) {
            throw new Error('PUZZLE_INVALID: sectors must have the same number of cells as rows and columns');
        }

        // store group length, sector width and sector height
        this.groupLength  = groupLength;
        this.sectorWidth  = sectorSize.width;
        this.sectorHeight = sectorSize.height;

        // create a list of all cells in the puzzle
        this.cells = Array(puzzle.length).fill().map((ignore, index) => new SudokuCell(this, index));

        // create a list of rows in the puzzle with references to their respective cells
        this.rows = Array(groupLength).fill().map((ignore, index) => {
            return new SudokuGroup('row', this, index, this.cells.slice(index * groupLength, (index + 1) * groupLength));
        });

        // create a list of columns in the puzzle with references to their respective cells
        this.columns = Array(groupLength).fill().map((ignore, columnIndex) => {
            return new SudokuGroup('column', this, columnIndex, Array(groupLength).fill().map((ignore, cellIndex) => this.cells[groupLength * cellIndex + columnIndex]));
        });

        // create list of sectors in the puzzle
        this.sectors = Array(groupLength).fill().map((ignore, index) => new SudokuSector(this, index));

        // load the specified puzzle's values
        puzzle.forEach((value, index) => {
            if (isUINT(value, {min: 1})) {
                this.cells[index].solveTo(value);
            }
        });
    }

    get solved() {
        return this.cells.reduce((solved, cell) => solved && cell.solved, true);
    }

    solve() {

        // puzzle has already been solved
        if (this.solved) {
            return true;
        }

        // Loop over the puzzle solving cells and removing candidates until the puzzle no longer updates
        // eslint-disable-next-line no-constant-condition
        while (!this.solved) {

            // attempt to solve cells, if any are solved restart the loop
            if (this.cells.reduce((changed, cell) => cell.solve() || changed, false)) {
                continue;
            }

            // Exclude naked subsets from rows, columns, and sectors
            // If the puzzle changed, start at top of loop body
            if (this.sectors.reduce((changed, sector) => sector.excludeNakedSubsets() || changed, this.columns.reduce((changed, column) => column.excludeNakedSubsets() || changed, this.rows.reduce((changed, row) => row.excludeNakedSubsets() || changed, false)))) {
                continue;
            }

            // Exclude candidates based on sector to plane interactions
            if (this.sectors.reduce((updated, sector) => sector.excludeSectorToPlaneCandidates() || updated, false)) {
                continue;
            }

            // Exclude candidates based on sector to sector interactions
            if (this.sectors.reduce((updated, sector) => sector.excludeSectorToSectorCandidates() || updated, false)) {
                continue;
            }

            break;
        }

        // All avenues to solve have been exhausted, return solve state of puzzle
        return this.solved;
    }

    toArray(unsolvedCells = 0) {
        return this.cells.map(cell => {
            return cell.solved ? cell.value : unsolvedCells;
        });
    }

    toJSON() {
        return {
            solved: this.solved,
            rowCandidates: this.rows.map(row => row.candidates.slice(0)),
            columnCandidates: this.columns.map(column => column.candidates.slice(0)),
            sectorCandidates: this.sectors.map(sector => sector.candidates.slice(0)),
            cells: this.cells.map(cell => {
                return {
                    solved: cell.solved,
                    rowIndex: cell.row.index,
                    columnIndex: cell.column.index,
                    sectorIndex: cell.sector.index,
                    value: cell.solved ? cell.value : 0,
                    candidates: cell.solved ? [] : cell.candidates.slice(0)
                };
            })
        };
    }

    static fromJSON(json) {

        // generate a new sudoku puzzle from the input json
        let sudoku = new SudokuPuzzle(json.cells.map(cell => cell.value));

        // get a generic list of candidates that cells/rows/columns/sectors may have
        let candidates = Array(sudoku.groupLength).fill().map((ignore, index) => index + 1);

        // exclude candidates that do not appear in the input json's candidate list for a cell
        sudoku.cells.forEach((cell, index) => {
            candidates
                .filter(candidate => json.cells[index].candidates.indexOf(candidate) === -1)
                .forEach(candidate => cell.exclude(candidate));
        });

        // exclude candidates that do not appear in the input json's candidate list for a row
        sudoku.rows.forEach((row, index) => {
            candidates
                .filter(candidate => json.rowCandidates[index].indexOf(candidate) === -1)
                .forEach(candidate => row.exclude(candidate));
        });

        // exclude candidates that do not appear in the input json's candidate list for a column
        sudoku.columns.forEach((column, index) => {
            candidates
                .filter(candidate => json.columnCandidates[index].indexOf(candidate) === -1)
                .forEach(candidate => column.exclude(candidate));
        });

        // exclude candidates that do not appear in the input json's candidate list for a sector
        sudoku.sectors.forEach((sector, index) => {
            candidates
                .filter(candidate => json.sectorCandidates[index].indexOf(candidate) === -1)
                .forEach(candidate => sector.exclude(candidate));
        });

        // Return puzzle
        return sudoku;
    }
};