/** @module exclude-sector-to-plane */

/**Removes candidates from a plane that are unique to a sector stub
 * @private
 * @param {Array.<SectorPlainStub>} stubs Array of stubs that comprise the sector
 * @param {number} candidate The candidate to check for uniqueness
 * @return {boolean} true if the puzzle was changed
 */
function uniqueStubCandidate(stubs, candidate) {
    let uniqueStub = false;

    for (let idx = 0; idx < stubs.length; idx += 1) {
        if (stubs[idx].innerCandidates.indexOf(candidate) > -1) {
            if (uniqueStub !== false) {
                return false;
            }
            uniqueStub = stubs[idx];
        }
    }
    if (!uniqueStub || uniqueStub.outterCandidates.indexOf(candidate) === -1) {
        return false;
    }

    return uniqueStub.outerCells.reduce((updated, cell) => cell.exclude(candidate) || updated, false);
}

/**Removes candidates based on sector to row or column interactions
 * @param {Array.<SudokuPuzzle>} sudoku the Puzzle to process
 * @returns {boolean} true if the puzzle was updated, false otherwise
*/
module.exports = sudoku => {

    return sudoku.sectors.reduce((updated, sector) => {

        // sector has been solved so skip it
        if (sector.solved) {
            return updated;
        }

        // Attempt to remove candidates unique to a stub in the sector
        // then return true|false based on if the puzzle was updated
        return sector.candidates.reduce(candidate => {
            updated = uniqueStubCandidate(this.rowStubs, candidate) || updated;
            updated = uniqueStubCandidate(this.columnStubs, candidate) || updated;
        }, updated);
    }, false);
};