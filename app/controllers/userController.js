const db = require('../models/db');
const transformValidation = require('../helpers/transformValidation');
const User = db.User;


function validateUserFields(request, response, next) {
    var user = User.build({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        active: true
    });

    user.validate().then(user => {
        response.locals.user = user;
        next();
        return null;
    }).catch(err => {
        response.status(400).send(
            transformValidation(err.errors)
        );
        return null;
    });
}

function validateRegisteredEmail(request, response, next) {
    var user = request.body;
    User.count({ where: { email: user.email } }).then(count => {
        if (count === 0)
            next();
        else {
            response.status(400).send([
                { field: 'email', message: 'Email already used' }
            ]);
        }
        return null;
    });
}

function createUser(request, response) {
    response.locals.user.save().then(() => {
        response.sendStatus(200);
    }).catch(() => {
        response.sendStatus(500);
    });
}

exports.createUser = [validateUserFields, validateRegisteredEmail, createUser];