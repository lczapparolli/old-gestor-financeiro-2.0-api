const jwt = require('jsonwebtoken');
const db = require('../models/db');
const crypt = require('../helpers/crypt');
const validation = require('../helpers/validation');
const auth = require('../helpers/auth');

const User = db.User;
const Access = db.Access;
const tokenSecret = process.env.TOKEN_SECRET;

function validateFields(request, response, next) {
    var body = request.body;
    var validationMessages = [];
    
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

function findUser(request, response, next) {
    var body = request.body;

    User.findAll({
        attributes: ['id', 'email', 'passwordDigest'],
        where: {
            email: body.email,
            active: true
        }
    }).then(users => {
        if (users.length === 1) {
            response.locals.user = users[0];
            next();
            return null;
        } else {
            response.locals.user = null;
            next();
            return null;
        }
    });
}

function validatePassword(request, response, next) {
    var defaultDigest = crypt.encrypt('invalid password');
    var user = response.locals.user || {id: 0, passwordDigest: defaultDigest};
    var password = request.body.password;

    if ((crypt.compare(password, user.passwordDigest)) && (user.id > 0))
        next();
    else
        response.sendStatus(400);
}

function getUserAgent(request, response, next) {
    response.locals.userAgent = request.get('User-Agent');
    next();
}

function saveAccess(request, response, next) {
    var access = Access.build({
        userId: response.locals.user.id,
        userAgent: response.locals.userAgent,
        active: true
    });

    access.save().then(access => {
        response.locals.accessUUID = access.UUID;
        next();
    }).catch(() => {
        response.sendStatus(500);
    });
}

function buildToken(request, response) {
    var token = {
        access: response.locals.accessUUID
    };

    var signedToken = auth.signToken(token);
    response.status(200).send({ token: signedToken });
}

function loginValidation(request, response) {
    var token = request.get('x-access-token');
    if (typeof token !== 'undefined') {
        try {
            var accessUUID = jwt.verify(token, tokenSecret).access;
            
            Access.findOne({
                where: {
                    UUID: accessUUID,
                    active: true
                }
            }).then(access => {
                if (access !== null)
                    response.sendStatus(200);
                else
                    response.sendStatus(401);
            }).catch(() => {
                response.sendStatus(401);
            });
        } catch (err) {
            response.sendStatus(401);
        }
    } else {
        response.status(401).send({ message: 'Token header not present' });
    }
}

exports.loginUser = [validateFields, findUser, validatePassword, getUserAgent, saveAccess, buildToken];
exports.loginValidation = [loginValidation];