const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../../index');
const db = require('../../app/models/db');

const tokenSecret = process.env.TOKEN_SECRET;
const expect = chai.expect;

chai.use(chaiHttp);

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
        it('Should have a method for user login', async () => {
            var response = await server.post('/users/login').send();
            
            expect(response).to.have.property('status').not.equal(404);
        });

        it('Should validates presence of email field', async () => {
            var response = await server.post('/users/login').send({
                password: userData.password
            });

            expect(response).to.have.property('status').equal(400);
            expect(response).to.have.nested.property('body[0].field', 'email');
            expect(response).to.have.nested.property('body[0].message', 'Email is required');
        });

        it('Should validates valid email', async () => {
            var response = await server.post('/users/login').send({
                email: 'invalid email',
                password: userData.password
            });

            expect(response).to.have.property('status').equal(400);
            expect(response).to.have.nested.property('body[0].field', 'email');
            expect(response).to.have.nested.property('body[0].message', 'Is not a valid email');
        });

        it('Should validates presence of password field', async () => {
            var response = await server.post('/users/login').send({
                email: userData.email
            });

            expect(response).to.have.property('status', 400);
            expect(response).to.have.nested.property('body[0].field', 'password');
            expect(response).to.have.nested.property('body[0].message', 'Password is required');
        });

        it('Should fail when email do not exists', async () => {
            var response = await server.post('/users/login').send({
                email: 'different@email.com',
                password: userData.password
            });

            expect(response).to.have.property('status', 400);
        });

        it('Should fail when password do not match', async () => {
            var response = await server.post('/users/login').send({
                email: userData.email,
                password: 'invalid password'
            });

            expect(response).to.have.property('status', 400);
        });

        it('Should return a valid JWT when user and password match', async () => {
            var response = await server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            expect(response).to.have.property('status', 200);
            expect(response).to.have.nested.property('body.token').not.empty;
            expect(() => { jwt.verify(response.body.token, tokenSecret); }).to.not.throw();
        });

        it('Token should have a property access', async () => {
            var response = await server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            var token = jwt.decode(response.body.token, tokenSecret);
            expect(token).to.have.property('access');
        });

        it('Should save an Access when user login', async () => {
            var accesses = await db.Access.findAll({
                include: [{
                    model: db.User,
                    where: { email: userData.email }
                }]
            });

            expect(accesses).to.have.property('length').greaterThan(0);
            expect(accesses).to.have.nested.property('[0].userAgent').not.null;
        });
    });

    describe('Token validation', () => {
        before(async () => {
            var response = await server.post('/users/login').send({
                email: userData.email,
                password: userData.password
            });

            userData.token = response.body.token;
        });
        
        it('Should have a method for login validation', async () => {
            var response = await server.get('/users/login').send();
            expect(response).to.have.property('status').not.equal(404);
        });

        it('Should fail when a token is not provided', async () => {
            var response = await server.get('/users/login').send();
            expect(response).to.have.property('status').equal(401);
        });

        it('Should validate the JWT token', async () => {
            var response = await server.get('/users/login').set('x-access-token', userData.token).send();
            expect(response).to.have.property('status').equal(200);            
        });

        it('Should fail when invalid JWT token is provided', async () => {
            var invalidToken = jwt.sign({access: ''}, tokenSecret);
            var response = await server.get('/users/login').set('x-access-token', invalidToken).send();
            
            expect(response).to.have.property('status').equal(401);            
        });

        it('Should fail when an invalid secret is used', async () => {
            var decodedToken = jwt.decode(userData.token);
            var newToken = jwt.sign({ access: decodedToken.access }, 'invalid secret');
            var response = await server.get('/users/login').set('x-access-token', newToken).send();
            
            expect(response).to.have.property('status').equal(401);
        });

        it('Should fail when an inactive access is provided', async () => {
            var decodedToken = jwt.decode(userData.token);
            
            await db.Access.update(
                { active: false },
                { where: { UUID: decodedToken.access } }
            );
            var response = await server.get('/users/login').set('x-access-token', userData.token).send();
            expect(response).to.have.property('status').equal(401);
        });
    });
});

after(() => {
    return server.close();
});