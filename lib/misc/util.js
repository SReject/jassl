/** @module misc/util */



/**Checks if the subject is an unsigned integer
 * @param {*} subject the subject to test
 * @param {Object} options options defining how to process the subject
 * @param {number} options.min The minimual value the subject can be
 * @param {number} options.max the maximum value the subject can be
 * @returns {boolean} true if the value is an unsigned integer that meets the requirements
*/
module.exports.isUINT = (subject, options = {}) => {
    if (!Number.isSafeInteger(subject)) {
        return false;
    }
    if (subject < 0) {
        return false;
    }
    if (options.min && subject < options.min) {
        return false;
    }
    if (options.max && subject > options.max) {
        return false;
    }
    return true;
};

/**Returns the primitive type of the subject
 * @param {*} subject the subject to get a type for
 * @returns {string} The type of the subject
 */
module.exports.getType = subject => {

    // subject is null
    if (subject === null) {
        return 'null';
    }

    // get type
    let type = Object.prototype.toString.call(subject).replace(/^\[\S+ (\S+)\]$/i, '$1').toLowerCase();

    // subject is a primitive
    if (typeof subject === type) {
        return type;
    }

    // subject is not a primitive or was not created with 'new'
    if (type !== 'undefined' && type !== 'boolean' && type !== 'number' && type !== 'string') {
        return type;
    }

    // Subjet was created with 'new'
    return 'object';
};