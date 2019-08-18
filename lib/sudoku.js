/**
 * @module lib/sudoku
 * @exports SudokuPuzzle
*/

const {isUINT} = require('./misc/util');
const SudokuCell = require('./cell');
const SudokuGroup = require('./group');
const SudokuSector = require('./sector');

const {
    solveCells,
    excludeNakedSubsets,
    excludeSectorToPlane,
    excludeSectorToSector
} = require('./strategies');

/**Creates sudoku puzzle instance
 * @public
 * @property {number} groupLength Number of cells within a group
 * @property {Object} sectorSize Contains the width and height of a sector
 * @property {number} sectorWidth Number of cells wide a sector is
 * @property {number} sectorHeight Number of cells tall a sector is
 * @property {SudokuCell[]} cells List of cell instances comprising the puzzle
 * @property {SudokuCellGroup[]} row List of rows comprising the puzzle
 * @property {SudokuCellGroup[]} column List of rows comprising the puzzle
 * @property {SudokuCellGroup[]} sector List of rows comprising the puzzle
 * @property {boolean} solved true if the puzzle has been solved, false otherwise
 */
class SudokuPuzzle {

    get solved() {
        return this.cells.reduce((solved, cell) => solved && cell.solved, true);
    }

    /** Creates a sudoku puzzle instance
     * @param {number[]} puzzle A list of cell values for the puzzle where each item corrisponds to a cell
     * @param {number|Object} [sectorSize] The size of each sector; if number, it will be used as both the width and height of the sector
     * @param {number} [sectorSize.width] The width of the sector
     * @param {number} [sectorSize.height] The width of the sector
    */
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
        if (!puzzle.every(value => isUINT(value, {max: groupLength}))) {
            throw new Error('PUZZLE_INVALID: puzzle must only contain unsigned integer values');
        }

        // sector size not specified
        if (!sectorSize || (!sectorSize.width && !sectorSize.height)) {
            sectorSize = Math.sqrt(groupLength);
        }

        // sector size specified as an integer
        if (isUINT(sectorSize))  {
            sectorSize = {width: sectorSize, height: sectorSize};
        }

        // sector size specified as an object
        if (sectorSize.width || sectorSize.height) {

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

            // sector would not evenly divide the puzzle
            if (sectorSize.width * sectorSize.height !== groupLength) {
                throw new Error('PUZZLE_INVALID: sector dimensions do not divide the puzzle evenly');
            }

        } else {
            throw new Error('PUZZLE_INVALID: invalid sector size');
        }

        // store group length, sector width and sector height
        this.groupLength  = groupLength;
        this.sectorWidth  = sectorSize.width;
        this.sectorHeight = sectorSize.height;

        // create a list of all cells in the puzzle
        this.cells = Array(puzzle.length).fill().map((ignore, index) => new SudokuCell(this, index, puzzle[index]));

        // create a list of rows in the puzzle with references to their respective cells
        this.rows = Array(groupLength).fill().map((ignore, index) => {
            return new SudokuGroup(
                'row',
                this,
                index,
                this.cells.slice(index * groupLength, (index + 1) * groupLength)
            );
        });

        // create a list of columns in the puzzle with references to their respective cells
        this.columns = Array(groupLength).fill().map((ignore, columnIndex) => {
            return new SudokuGroup(
                'column',
                this,
                columnIndex,
                Array(groupLength).fill().map((ignore, cellIndex) => this.cells[groupLength * cellIndex + columnIndex])
            );
        });

        // create list of sectors in the puzzle
        this.sectors = Array(groupLength).fill().map((ignore, index) => new SudokuSector(this, index));

        // load the specified puzzle's values
        puzzle.forEach((value, index) => {
            if (value) {
                this.cells[index].solveTo(value);
            }
        });
    }


    /**Attempts to solve the sudoku puzzle
     * @returns {boolean} true if the puzzle has been solved
    */
    solve() {

        // puzzle has already been solved
        if (this.solved) {
            return true;
        }

        // Loop over the puzzle solving cells and removing candidates until the puzzle no longer updates
        // eslint-disable-next-line no-constant-condition
        while (!this.solved) {

            // attempt to solve cells, if any are solved restart the loop
            if (solveCells(this)) {
                continue;
            }

            // Exclude naked subset candidations
            if (excludeNakedSubsets(this)) {
                continue;
            }

            // Exclude candidates based on sector-to-plane interactions
            if (excludeSectorToPlane(this)) {
                continue;
            }

            // exclude candidates based on sector-to-sector interactions
            if (excludeSectorToSector(this)) {
                continue;
            }

            break;
        }

        return this.solved;
    }
}

module.exports = SudokuPuzzle;