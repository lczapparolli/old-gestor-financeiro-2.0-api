//Libs
const db = require('../models/db');
const express = require('express');
//Helpers
const transformValidation = require('../helpers/transformValidation');

const router = express.Router();
const User = db.User;

/**
 * Validates the request data and builds an User object and
 * stores into response.locals
 * @param {Object} request Express request object
 * @param {Object} request.body The body of the request, sent by client
 * @param {Object} request.body.name New user name
 * @param {Object} request.body.email New user email
 * @param {Object} request.body.password New user password
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares
 * @param {function} next Calls the next middleware function
 */
async function validateUserFields(request, response, next) {
    try {
        const user = await User.build({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            active: true
        }).validate();
    
        response.locals.user = user;
        next();
    } catch (err) {
        response.status(400).send(transformValidation(err.errors));
    }
}

/**
 * Check if user email is already registered.
 * @param {Object} request Express request object
 * @param {Object} request.body The body of the request, sent by client
 * @param {Object} request.body.email New user email
 * @param {Object} response Express response object
 * @param {function} response.status Send a status response to client
 * @param {function} next Calls the next middleware function
 */
async function validateRegisteredEmail(request, response, next) {
    const user = request.body;
    const count = await User.count({ where: { email: user.email } });
    if (count === 0)
        next();
    else {
        response.status(400).send([
            { field: 'email', message: 'Email already used' }
        ]);
    }
}

/**
 * Save user into database
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Object} response.locals Local data to be used by subsequent middlewares 
 * @param {Object} response.locals.user Database object with user data
 */
function saveUser(request, response) {
    response.locals.user.save().then(() => {
        response.sendStatus(200);
    }).catch(() => {
        response.sendStatus(500);
    });
}

//Functions chain
const createUser = [validateUserFields, validateRegisteredEmail, saveUser];

//Defining routes
router.post('/', createUser);

module.exports = router;