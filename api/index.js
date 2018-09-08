const express = require('express');
const UserController = require('./app/controllers/userController');
const app = express();

app.get('/', (request, response) => {
    response.send('gestor-financeiro-2.0');
});

app.post('/users', UserController.createUser);
app.post('/users/login', UserController.loginUser);

module.exports = app.listen(3000, () => {
    console.log('Server is listening!');
});

