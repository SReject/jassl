/** @module exclude-sector-to-plane */

/**Removes candidates from a plane that are unique to a sector stub
 * @private
 * @param {Array.<SectorPlainStub>} stubs Array of stubs that comprise the sector
 * @param {number} candidate The candidate to check for uniqueness
 * @return {boolean} true if the puzzle was changed
 */
function uniqueStubCandidate(stubs, candidate) {
    let uniqueToStub = false;

    for (let idx = 0, stub; idx < stubs.length; idx += 1) {
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
    if (
        !uniqueToStub ||
        uniqueToStub.outerCandidates.indexOf(candidate) === -1
    ) {
        return false;
    }

    return uniqueToStub.outerCells.reduce((updated, cell) => cell.exclude(candidate) || updated, false);
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
        let result = sector.candidates.reduce((updated, candidate) => {
            updated = uniqueStubCandidate(sector.rowStubs, candidate) || updated;
            return uniqueStubCandidate(sector.columnStubs, candidate) || updated;
        }, updated);

        return result;
    }, false);
};