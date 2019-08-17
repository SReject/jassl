/**
 * @module lib/strategies
 * @exports strategies
 */

module.exports = {
    solveCells: require('./solveCells.js'),
    excludeSectorToPlain: require('./exclude-sector-to-plane.js'),
    excludeSectorToSector: require('./exclude-sector-to-sector.js')
};