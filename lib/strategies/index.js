/**
 * @module lib/strategies
 * @exports strategies
 */

module.exports = {
    solveCells: require('./solveCells.js'),
    excludeSectorToPlane: require('./exclude-sector-to-plane.js'),
    excludeSectorToSector: require('./exclude-sector-to-sector.js')
};