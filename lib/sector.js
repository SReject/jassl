/**
 * @module sector
 * @exports SudokuSector
 */

/**
 * @desc Sudoku puzzle sector class */
module.exports = class SudokuSector extends require('./group.js') {

    constructor(sudoku, index) {

        let cells = [],

            // Calculate the index of the first row of which enters the sector
            rowIndex = Math.floor(index / sudoku.sectorHeight) * sudoku.sectorHeight,

            // Calculate the index of which cells start for the sector within a row
            cellStart = index * sudoku.sectorWidth % sudoku.groupLength,

            // Calculate the index of which cells end for the sector within a row
            cellEnd = cellStart + sudoku.sectorWidth;

        // loop over each row starting at rowIndex and ending just before rowIndex + sector_height
        for (let rowOffset = 0; rowOffset < sudoku.sectorHeight; rowOffset += 1) {

            // get the list of cells from the row that belong to this sector and append them to the sectors cell list
            cells.push(...sudoku.rows[rowIndex + rowOffset].slice(cellStart, cellEnd));
        }

        // create a cell group instance for the sector
        super('sector', sudoku, index, cells);

        // Build row stubs for sector
        this.rowStubs = [];
        for (let idx = 0; idx < sudoku.sectorHeight; idx += 1) {
            let startIdx = idx * sudoku.sectorWidth;
            let innerCells = this.cells.slice(startIdx, startIdx + sudoku.sectorWidth);

            this.rowStubs.push({
                innerCells,
                outerCells: innerCells[0].row.filter(cell => cell.sector !== this)
            });
        }

        // build column stubs for sector
        this.columnStubs = [];
        let columnCellGroups = Array(sudoku.sectorWidth).fill().map(() => []);
        this.cells.forEach((cell, index) => columnCellGroups[index % sudoku.sectorWidth].push(cell));
        columnCellGroups.forEach(cellGroup => {
            this.columnStubs.push({
                innerCells: cellGroup,
                outerCells: cellGroup[0].column.filter(cell => cell.sector !== this)
            });
        });

        this.generateStubCandidates();
    }

    // generate inner and outer candidate lists for each stub
    generateStubCandidates() {
        [...this.rowStubs, ...this.columnStubs].forEach(stub => {
            stub.innerCandidates = [...new Set(stub.innerCells.reduce((candidates, cell) => candidates.concat(cell.candidates), []))].sort((a, b) => a - b);
            stub.outerCandidates = [...new Set(stub.outerCells.reduce((candidates, cell) => candidates.concat(cell.candidates), []))].sort((a, b) => a - b);
        });
    }

    exclude(candidate) {
        if (!super.exclude(candidate)) {
            return false;
        }

        this.generateStubCandidates();
        return true;
    }
};
