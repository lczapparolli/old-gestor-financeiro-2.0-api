//Libs
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

//Configuring middlewares
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
app.use('/users', UserController);
//Login
app.use('/users/login', LoginController);

module.exports = app.listen(3030, () => { });

