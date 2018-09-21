const validation = require('../helpers/validation');

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
        response.status(500).send(validationMessages);
    else
        next();
}

function loginUser(request, response) {
    response.sendStatus(200);
}

function loginValidation(request, response) {
    response.sendStatus(200);
}

exports.loginUser = [validateFields, loginUser];
exports.loginValidation = [loginValidation];