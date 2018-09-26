const bcrypt = require('bcrypt');

const ENCRYPT_ROUNDS = 10;

function encrypt(value) {
    if (typeof value === 'string')
        return bcrypt.hashSync(value, ENCRYPT_ROUNDS);
    else
        throw new TypeError('value is not a string');
}

function compare(plainValue, cryptValue) {
    if (typeof plainValue === 'string' && typeof cryptValue === 'string')
        return bcrypt.compareSync(plainValue, cryptValue);
    else
        throw new TypeError('Both values must be strings');
}

exports.encrypt = encrypt;
exports.compare = compare;