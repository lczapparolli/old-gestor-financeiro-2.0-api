const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');

//Controllers
const UserController = require('./app/controllers/userController');
const LoginController = require('./app/controllers/loginController');
//Helpers
const auth = require('./app/helpers/auth');

const app = express();
const env = process.env.NODE_ENV || 'development';

app.use(parser.json());
app.use(auth.getMiddleware().unless({
    path: [ 
        { url: '/users', methods: ['POST'] },
        { url: '/users/login', methods: ['POST'] }
    ]
}));

if (env === 'production') {
    app.use(morgan('combined'));
} else if (env === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (request, response) => {
    response.send('gestor-financeiro-2.0');
});

//Users
app.post('/users', UserController.createUser);
//Login
app.post('/users/login', LoginController.loginUser);
app.get('/users/login', LoginController.loginValidation);

module.exports = app.listen(3030, () => {
});

