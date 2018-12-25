const bcrypt = require('bcrypt');

const ENCRYPT_ROUNDS = 10;

/**
 * Encrypts a string using a standart configuration
 * @param {string} value The value to be encrypted
 */
function encrypt(value) {
    if (typeof value === 'string')
        return bcrypt.hashSync(value, ENCRYPT_ROUNDS);
    else
        throw new TypeError('value is not a string');
}

/**
 * Check if an unencrypted value is equal to an encrypted one
 * @param {string} plainValue The unencrypted value to be checked
 * @param {string} cryptValue The encrypted value stored
 * @returns {boolean} Returns `true` if the values are equal
 * @throws {TypeError} Throws an error when one of the values is not a string
 */
function compare(plainValue, cryptValue) {
    if (typeof plainValue === 'string' && typeof cryptValue === 'string')
        return bcrypt.compareSync(plainValue, cryptValue);
    else
        throw new TypeError('Both values must be strings');
}

exports.encrypt = encrypt;
exports.compare = compare;