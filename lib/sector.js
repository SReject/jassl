const SudokuGroup = require('./group.js');

const generateStubCandidates = self => {
    [...self.rowStubs, ...self.columnStubs].forEach(stub => {
        stub.innerCandidates = [...new Set(stub.innerCells.reduce((candidates, cell) => candidates.concat(cell.candidates), []))].sort((a, b) => a - b);
        stub.outerCandidates = [...new Set(stub.outerCells.reduce((candidates, cell) => candidates.concat(cell.candidates), []))].sort((a, b) => a - b);
    });
};

const excludeUniqueStubCandidate = (stubs, candidate) => {
    let uniqueToStub = false;

    // Loop over each stub
    for (let idx = 0, stub; idx < stubs.length; idx += 1) {

        // get stub
        stub = stubs[idx];

        // candidate not in stub's candidate list
        if (stub.innerCandidates.indexOf(candidate) === -1) {
            continue;
        }

        // candidate was found in another stub, so its not unique
        if (uniqueToStub !== false) {
            return false;
        }

        // store the stub the candidate is unique to
        uniqueToStub = stub;
    }

    // No stub found matching candidiate or no cells in outer having the candidate
    if (!uniqueToStub || uniqueToStub.outerCandidates.indexOf(candidate) === -1) {
        return false;
    }

    return uniqueToStub.outerCells.reduce((updated, cell) => cell.exclude(candidate) || updated, false);
};

module.exports = class SudokuSector extends SudokuGroup {

    constructor(sudoku, index) {

        // List of cells belonging to the sector to be populated
        let cells = [];

        // gets the index of the top-right cell of the sector
        let rowOffset = Math.floor(index / (sudoku.groupLength / sudoku.sectorWidth)) * sudoku.sectorHeight * sudoku.groupLength;
        let columnOffset = (index % (sudoku.groupLength / sudoku.sectorWidth)) * sudoku.sectorWidth;
        let startCell = rowOffset + columnOffset;

        // get the index of the cell to stop looping at
        let endCell = startCell + (sudoku.groupLength * sudoku.sectorHeight);

        // Get all cells belonging to the sector
        for (;startCell < endCell; startCell += sudoku.groupLength) {
            cells.push(...sudoku.cells.slice(startCell, startCell + sudoku.sectorWidth));
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
                outerCells: innerCells[0].row.cells.filter(cell => cell.sector !== this)
            });
        }

        // build column stubs for sector
        this.columnStubs = [];
        let columnCellGroups = Array(sudoku.sectorWidth).fill().map(() => []);
        this.cells.forEach((cell, index) => columnCellGroups[index % sudoku.sectorWidth].push(cell));
        columnCellGroups.forEach(cellGroup => {
            this.columnStubs.push({
                innerCells: cellGroup,
                outerCells: cellGroup[0].column.cells.filter(cell => cell.sector !== this)
            });
        });

        // generate inner and outer candidate lists for each stub
        generateStubCandidates(this);
    }

    exclude(candidate) {
        if (!super.exclude(candidate)) {
            return false;
        }

        generateStubCandidates(this);
        return true;
    }

    excludeSectorToPlaneCandidates() {
        if (this.solved) {
            return false;
        }

        return this.candidates.reduce((updated, candidate) => {
            updated = excludeUniqueStubCandidate(this.rowStubs, candidate) || updated;
            return excludeUniqueStubCandidate(this.columnStubs, candidate) || updated;
        }, false);
    }

    excludeSectorToSectorCandidates() {
        if (this.solved) {
            return false;
        }
    }
};
