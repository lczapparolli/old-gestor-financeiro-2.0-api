const db = require('../models/db');
const transformValidation = require('../helpers/transformValidation');
const User = db.User;


async function validateUserFields(request, response, next) {
    try {
        var user = await User.build({
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

async function validateRegisteredEmail(request, response, next) {
    var user = request.body;
    var count = await User.count({ where: { email: user.email } });
    if (count === 0)
        next();
    else {
        response.status(400).send([
            { field: 'email', message: 'Email already used' }
        ]);
    }
}

function createUser(request, response) {
    response.locals.user.save().then(() => {
        response.sendStatus(200);
    }).catch(() => {
        response.sendStatus(500);
    });
}

exports.createUser = [validateUserFields, validateRegisteredEmail, createUser];