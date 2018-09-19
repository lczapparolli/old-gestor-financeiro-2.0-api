const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const UserController = require('./app/controllers/userController');
const app = express();
const env = process.env.NODE_ENV || 'development';

app.use(parser.json());
if (env === 'production') {
    app.use(morgan('combined'));
} else if (env === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (request, response) => {
    response.send('gestor-financeiro-2.0');
});

app.post('/users', UserController.createUser);
app.post('/users/login', UserController.loginUser);

module.exports = app.listen(3000, () => {
});

