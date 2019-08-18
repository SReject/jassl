/**
 * @module lib/strategies
 * @exports strategies
 */

module.exports = {
    solveCells: require('./solveCells'),
    excludeNakedSubsets: require('./exclude-naked-subsets'),
    excludeSectorToPlane: require('./exclude-sector-to-plane'),
    excludeSectorToSector: require('./exclude-sector-to-sector')
};