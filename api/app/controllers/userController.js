const db = require('../models/db');
const User = db.User;


function validateUserFields(request, response, next) {
    var user = User.build({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        active: true
    });

    user.validate().then(user => {
        request.body = user;
        next();
    }).catch(err => {
        response.status(500).send(err.errors);
    });
}

function validateRegisteredEmail(request, response, next) {
    var user = request.body;
    User.count({ where: { email: user.email } }).then(count => {
        if (count === 0)
            next();
        else {
            response.status(500).send([
                { field: 'email', message: 'Email already used' }
            ]);
        }
    });
}

function createUser(request, response) {
    request.body.save().then(user => {
        response.sendStatus(200);
    }).catch(error => {
        response.sendStatus(500);
    });
}

function loginUser(request, response) {
    response.sendStatus(200);
}
//module.exports = UserController;

exports.createUser = [validateUserFields, validateRegisteredEmail, createUser];
exports.loginUser = [loginUser];