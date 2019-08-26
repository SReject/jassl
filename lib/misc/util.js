module.exports.isUINT = (subject, options = {}) => {

    // Return false if subject is not a safe integer
    if (!Number.isSafeInteger(subject)) {
        return false;
    }

    // Return false if subject is negetive
    if (subject < 0) {
        return false;
    }

    // Return false is subject is less than specified minimum
    if (options.min && subject < options.min) {
        return false;
    }

    // Return false if subject is greater than specified maximum
    if (options.max && subject > options.max) {
        return false;
    }

    // All checks passed, return true
    return true;
};

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