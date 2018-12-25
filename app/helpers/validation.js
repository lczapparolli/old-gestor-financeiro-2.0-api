/**
 * Validates if a string has a valid email format like 'email@email.com'
 * 
 * @param {string} value The value to validated
 * @returns {boolean} Returns `true` if is a valid email
 */
function isEmail(value) {
    const regExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExpression.test(String(value).toLowerCase());
}

exports.isEmail = isEmail;