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
module.exports.getType = subject => {
    return Object.prototype.toString.call(subject).replace(/^\[\S+ (\S+)\]$/i, '$1').toLowerCase();
};