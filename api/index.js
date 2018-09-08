const express = require('express');
const parser = require('body-parser');
const UserController = require('./app/controllers/userController');
const app = express();

app.use(parser.json());

app.get('/', (request, response) => {
    response.send('gestor-financeiro-2.0');
});

app.post('/users', UserController.createUser);
app.post('/users/login', UserController.loginUser);

module.exports = app.listen(3000, () => {
    console.log('Server is listening!');
});

