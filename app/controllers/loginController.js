const db = require('../models/db');
const crypt = require('../helpers/crypt');
const validation = require('../helpers/validation');
const auth = require('../helpers/auth');

const User = db.User;
const Access = db.Access;

/**
 * Middleware to validate the email and password fields sent by client.
 * Validates the presence and the format of the fields.
 * @param {Object} request Express request object
 * @param {Object} request.body The body of the request, sent by client
 * @param {string} request.body.email The user email
 * @param {string} request.body.password The user password
 * @param {Object} response Express response object
 * @param {function} response.status Send a status response to client
 * @param {function} next Calls the next middleware function
 */
function validateFields(request, response, next) {
    const body = request.body;
    let validationMessages = [];
    
    if ((typeof body.email === 'undefined') || (body.email === '')) {
        validationMessages.push({ field: 'email', message: 'Email is required' });
    } else if (!validation.isEmail(body.email)) {
        validationMessages.push({ field: 'email', message: 'Is not a valid email'});
    }

    if ((typeof body.password === 'undefined') || (body.password === '')) {
        validationMessages.push({ field: 'password', message: 'Password is required' });
    }

    if (validationMessages.length > 0)
        response.status(400).send(validationMessages);
    else
        next();
}

/**
 * Find the user data in the database
 * @param {Object} request Express request object
 * @param {Object} request.body The body of the request, sent by client
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares
 * @param {function} next Calls the next middleware function
 */
async function findUser(request, response, next) {
    const body = request.body;

    const users = await User.findAll({
        attributes: ['id', 'email', 'passwordDigest'],
        where: {
            email: body.email,
            active: true
        }
    });

    if (users.length === 1) {
        response.locals.user = users[0];
        next();
    } else {
        response.locals.user = null;
        next();
    }
}

/**
 * Checks if the password present into the request is equal to the password of the user
 * @param {Object} request Express request object
 * @param {string} request.body.password The user password
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares
 * @param {Object} response.locals.user The user data stored
 * @param {function} next Calls the next middleware function
 */
function validatePassword(request, response, next) {
    const defaultDigest = crypt.encrypt('invalid password');
    const user = response.locals.user || {id: 0, passwordDigest: defaultDigest};
    const password = request.body.password;

    if ((crypt.compare(password, user.passwordDigest)) && (user.id > 0))
        next();
    else
        response.sendStatus(400);
}

/**
 * Identifies and store into `locals` the user-agent header
 * @param {Object} request Express request object
 * @param {function} request.get Gets a header of the request
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares
 * @param {function} next Calls the next middleware function
 */
function getUserAgent(request, response, next) {
    response.locals.userAgent = request.get('User-Agent');
    next();
}

/**
 * Stores a new acess information into the database
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares
 * @param {function} response.sendStatus Send a status code to client
 * @param {function} next Calls the next middleware function
 */
async function saveAccess(request, response, next) {
    try {
        const access = await Access.build({
            userId: response.locals.user.id,
            userAgent: response.locals.userAgent,
            active: true
        }).save();

        response.locals.accessUUID = access.UUID;
        next();
    } catch (err) {
        response.sendStatus(500);
    }
}

/**
 * Build a JWT token and return to the client
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {function} response.status Send a status response to client
 */
function buildToken(request, response) {
    const token = {
        access: response.locals.accessUUID
    };

    const signedToken = auth.signToken(token);
    response.status(200).send({ token: signedToken });
}

/**
 * Validates if the access token sent by the client is valid
 * @param {Object} request Express request object
 * @param {Object} request.locals Local variables created by previous middlewares
 * @param {Object} request.locals.accessToken JWT token sent by client
 * @param {Object} response Express response object
 * @param {function} response.sendStatus Send a status code to client
 */
async function loginValidation(request, response) {
    try {
        const accessUUID = request.locals.accessToken.access;
    
        const access = await Access.findOne({
            where: {
                UUID: accessUUID,
                active: true
            }
        });

        if (access !== null)
            response.sendStatus(200);
        else
            response.sendStatus(401);
    } catch (err) {
        response.sendStatus(401);
    }
}

exports.loginUser = [validateFields, findUser, validatePassword, getUserAgent, saveAccess, buildToken];
exports.loginValidation = [loginValidation];