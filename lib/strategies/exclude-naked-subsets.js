function excludeNakedSubset(sudoku, cellGroups) {

    return cellGroups.reduce((updated, cellGroup) => {

        // all cells in group solved
        if (cellGroup.solved) {
            return updated;
        }

        // get a list of unsolved cells with more than 1 candidate
        let cells = cellGroup.cells.filter(cell => !cell.solved && cell.candidates.length > 1);

        // build list of candidate subsets and cells belonging to the subset
        let subsets = {};
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
    }, false);
}

module.exports = sudoku => {

    let updated = excludeNakedSubset(sudoku, sudoku.rows);

    updated = excludeNakedSubset(sudoku, sudoku.columns) || updated;

    updated = excludeNakedSubset(sudoku, sudoku.sectors) || updated;

    return updated;
};