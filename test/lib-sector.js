/*globals describe, it, beforeEach*/

const assert = require('assert');
const SudokuCell = require('../lib/cell.js');
const SudokuGroup = require('../lib/group.js');
const SudokuSector = require('../lib/sector.js');

describe('SudokuSector Class', function () {

    // dummy puzzle
    let dummySudoku;
    beforeEach(function () {
        dummySudoku = {
            groupLength: 9,
            sectorWidth: 3,
            sectorHeight: 3,
            rows: [{cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}],
            columns: [{cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}, {cells: []}]
        };
        dummySudoku.cells = Array(81).fill().map((ignore, index) => {
            let cell = new SudokuCell(dummySudoku, index);
            cell.row = dummySudoku.rows[Math.floor(index / dummySudoku.groupLength)];
            cell.column = dummySudoku.columns[index % dummySudoku.groupLength];
            cell.row.cells.push(cell);
            cell.column.cells.push(cell);
            return cell;
        });
    });

    describe('#Constructor', function () {
        it('Should create an instance of SudokuGroup', function () {
            let sector = new SudokuSector(dummySudoku, 0);
            assert.strictEqual(sector instanceof SudokuGroup, true);
        });
        it('Should generate a list of cells for the sector', function () {
            let sector = new SudokuSector(dummySudoku, 0);
            let indexes = [0, 1, 2, 9, 10, 11, 18, 19, 20];
            assert.strictEqual(sector.cells.length, 9);
            sector.cells.forEach((cell, index) => {
                if (cell.index !== indexes[index]) {
                    throw new Error('sector stored wrong cell');
                }
            });
        });
    });
});