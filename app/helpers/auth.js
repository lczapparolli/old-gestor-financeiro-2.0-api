const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const tokenSecret = process.env.TOKEN_SECRET;

/**
 * Creates a JWT token using the provided parameter as payload.
 * Uses TOKEN_SECRET environment variable as secret key.
 * 
 * @param {String | Object} payload - The value to be signed
 * @returns {string} The signed token string
 */
function signToken(payload) {
    if ((typeof payload === 'undefined') || (payload === null))
        throw new TypeError('Payload must be provided.');
    return jwt.sign(payload, tokenSecret);
}

/**
 * Returns the access token of an request
 * @param {Object} request Express request object
 * @param {function} request.get Returns a header of the request
 * @returns {string} The request access token
 */
function getToken(request) {
    return request.get('x-access-token');
}

/**
 * Returns a middleware configured to validate the presency of the access token.
 * The valid token is present into `locals.accessToken` property
 */
function getMiddleware() {
    return expressJWT({
        secret: tokenSecret,
        requestProperty: 'locals.accessToken',
        getToken: getToken
    });
}

exports.signToken = signToken;
exports.getMiddleware = getMiddleware;