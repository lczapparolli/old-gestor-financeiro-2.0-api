const db = require('../models/db');
const User = db.User;


function validateUser(request, response, next) {
    var user = User.build(request.body);
    user.validate().then(user => {
        request.body = user;
        next();
    }).catch(err => {
        response.status(500).send(err.errors);
    });
}

function createUser(request, response) {
    response.sendStatus(200);
}

function loginUser(request, response) {
    response.sendStatus(200);
}
//module.exports = UserController;

exports.createUser = [validateUser, createUser];
exports.loginUser = [loginUser];