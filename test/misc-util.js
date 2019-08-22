/*globals describe, it*/

const assert = require('assert');
const {isUINT, getType} = require('../lib/misc/util.js');

// Tests toUINT()
describe('toUINT()', function () {
    it('Should return false if input is not numerical', function () {
        assert.strictEqual(isUINT(null), false);
        assert.strictEqual(isUINT(true), false);
        assert.strictEqual(isUINT(false), false);
        assert.strictEqual(isUINT('text'), false);
        assert.strictEqual(isUINT([]), false);
        assert.strictEqual(isUINT({}), false);
    });
    it('Should return false if the input is less than 0', function () {
        assert.strictEqual(isUINT(-1), false);
    });
    it('Should return false if input is a decimal', function () {
        assert.strictEqual(isUINT(1.2), false);
    });
    it('Should return true if input is equal to or greater than specified minimum', function () {
        assert.strictEqual(isUINT(1, {min: 1}), true);
        assert.strictEqual(isUINT(2, {min: 1}), true);
    });
    it('Should return false if input is below specified minimum', function () {
        assert.strictEqual(isUINT(0, {min: 1}), false);
    });
    it('Should return true if input is equal to or less than specified maximum', function () {
        assert.strictEqual(isUINT(2, {max: 2}), true);
        assert.strictEqual(isUINT(1, {max: 2}), true);
    });
    it('Should return false if input is above specified maximum', function () {
        assert.strictEqual(isUINT(2, {max: 1}), false);
    });
    it('Should return false if input falls outside of specified minimum and maximum ranges', function () {
        assert.strictEqual(isUINT(3, {min: 4, max: 6}), false);
        assert.strictEqual(isUINT(4, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(5, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(6, {min: 4, max: 6}), true);
        assert.strictEqual(isUINT(7, {min: 4, max: 6}), false);
    });
});

// tests getType
describe('getType()', function () {
    it('Should return \'undefined\' for undefined subjects', function () {
        assert.strictEqual(getType(undefined), 'undefined');
    });
    it('Should return \'null\' for null subjects', function () {
        assert.strictEqual(getType(null), 'null');
    });
    it('Should return \'boolean\' for boolean values', function () {
        assert.strictEqual(getType(false), 'boolean');
        assert.strictEqual(getType(true), 'boolean');
    });
    it('Should return \'number\' for numerical values', function () {
        assert.strictEqual(getType(1), 'number');
        assert.strictEqual(getType(-1), 'number');
        assert.strictEqual(getType(1.1), 'number');
        assert.strictEqual(getType(-1.1), 'number');
        assert.strictEqual(getType(NaN), 'number');
        assert.strictEqual(getType(Infinity), 'number');
    });
    it('Should return \'string\' for text values', function () {
        assert.strictEqual(getType(''), 'string');
        assert.strictEqual(getType('string'), 'string');
    });
    it('Should return the constructor for non-primitive types', function () {
        assert.strictEqual(getType([]), 'array');
        assert.strictEqual(getType(new Date()), 'date');
        assert.strictEqual(getType(/^$/), 'regexp');
    });
    it('Should return \'object\' for literal objects', function () {
        assert.strictEqual(getType({}), 'object');
    });
    it('Should return \'object\' for primitives created with \'new\'', function () {
        assert.strictEqual(getType(new Boolean(1)), 'object');
        assert.strictEqual(getType(new Number(10)), 'object');
        assert.strictEqual(getType(new String('')), 'object');
    });
});