const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiPromised = require('chai-as-promised');
const jwt = require('jsonwebtoken');
const app = require('../../index');
const db = require('../../app/models/db');

const tokenSecret = process.env.TOKEN_SECRET;
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiPromised);

var server = chai.request(app).keepOpen();

var userData = {
    name: 'Login test',
    email: 'login@test.com',
    password: 'pass123',
    token: null
};

describe('LoginController', function() {
    before(() => {
        //Register login test user
        return server.post('/users').send(userData);
    });

    describe('User login', () => {
        it('Should have a method for user login', () => {
            var response = server.post('/users/login').send();
            return expect(response).to.eventually.have.property('status').not.equal(404);
        });

        it('Should validates presence of email field', () => {
            var response = server.post('/users/login').send({
                password: userData.password
            });

            return Promise.all([
                expect(response).to.eventually.have.property('status').equal(400),
                expect(response).to.eventually.have.nested.property('body[0].field', 'email'),
                expect(response).to.eventually.have.nested.property('body[0].message', 'Email is required')
            ]);
        });

        it('Should validates valid email', () => {
            var response = server.post('/users/login').send({
                email: 'invalid email',
                password: userData.password
            });

            return Promise.all([
                expect(response).to.eventually.have.property('status').equal(400),
                expect(response).to.eventually.have.nested.property('body[0].field', 'email'),
                expect(response).to.eventually.have.nested.property('body[0].message', 'Is not a valid email')
            ]);
        });

        it('Should validates presence of password field', () => {
            var response = server.post('/users/login').send({
                email: userData.email
            });

            return Promise.all([
                expect(response).to.eventually.have.property('status', 400),
                expect(response).to.eventually.have.nested.property('body[0].field', 'password'),
                expect(response).to.eventually.have.nested.property('body[0].message', 'Password is required')
            ]);
        });

        it('Should fail when email do not exists', () => {
            var response = server.post('/users/login').send({
                email: 'different@email.com',
                password: userData.password
            });

            return expect(response).to.eventually.have.property('status', 400);
        });

        it('Should fail when password do not match', () => {
            var response = server.post('/users/login').send({
                email: userData.email,
                password: 'invalid password'
            });

            return expect(response).to.eventually.have.property('status', 400);
        });

        it('Should return a valid JWT when user and password match', () => {
            var response = server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            return Promise.all([
                expect(response).to.eventually.have.property('status', 200),
                expect(response).to.eventually.have.nested.property('body.token').not.empty,
                response.then(response => { 
                    jwt.verify(response.body.token, tokenSecret); 
                })
            ]);
        });

        it('Token should have a property access', () => {
            var response = server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            return response.then(response => {
                var token = jwt.decode(response.body.token, tokenSecret);
                expect(token).to.have.property('access');
            });
        });

        it('Should save an Access when user login', () => {
            var accesses = db.Access.findAll({
                include: [{
                    model: db.User,
                    where: { email: userData.email }
                }]
            });

            return Promise.all([
                expect(accesses).to.eventually.have.property('length').greaterThan(0),
                expect(accesses).to.eventually.have.nested.property('[0].userAgent').not.null
            ]);
        });
    });

    describe('Token validation', () => {
        before(() => {
            var response = server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            return response.then(response => {
                userData.token = response.body.token;
            });
        });
        
        it('Should have a method for login validation', () => {
            var response = server.get('/users/login').send();
            return expect(response).to.eventually.have.property('status').not.equal(404);
        });

        it('Should fail when a token is not provided', () => {
            var response = server.get('/users/login').send();
            return expect(response).to.eventually.have.property('status').equal(401);
        });

        it('Should validate the JWT token', () => {
            var response = server.get('/users/login').set('x-access-token', userData.token).send();
            return expect(response).to.eventually.have.property('status').equal(200);            
        });

        it('Should fail when invalid JWT token is provided', () => {
            var invalidToken = jwt.sign({access: ''}, tokenSecret);
            var response = server.get('/users/login').set('x-access-token', invalidToken).send();
            
            return expect(response).to.eventually.have.property('status').equal(401);            
        });

        it('Should fail when an invalid secret is used', () => {
            var decodedToken = jwt.decode(userData.token);
            var newToken = jwt.sign({ access: decodedToken.access }, 'invalid secret');
            var response = server.get('/users/login').set('x-access-token', newToken).send();
            
            return expect(response).to.eventually.have.property('status').equal(401);            

        });
    });
});

after(() => {
    return server.close();
});