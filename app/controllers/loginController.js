const db = require('../models/db');
const crypt = require('../helpers/crypt');
const validation = require('../helpers/validation');

const User = db.User;

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

function loginUser(request, response) {
    response.sendStatus(200);
}

function loginValidation(request, response) {
    response.sendStatus(200);
}

exports.loginUser = [validateFields, findUser, validatePassword, loginUser];
exports.loginValidation = [loginValidation];