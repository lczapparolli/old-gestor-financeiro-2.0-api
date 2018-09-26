const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiPromised = require('chai-as-promised');
const app = require('../../index');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiPromised);

var server = chai.request(app).keepOpen();

var userData = {
    name: 'Login test',
    email: 'login@test.com',
    password: 'pass123'
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
            chai.assert.fail(true, true, 'Not implemented');
        });
    });

    describe('Token validation', () => {
        it('Should have a method for login validation', () => {
            var response = server.get('/users/login').send();
            return expect(response).to.eventually.have.property('status').not.equal(404);
        });

        it('Should validate the JWT token', () => {
            chai.assert.fail(true, true, 'Not implemented');
        });

        it('Should fail when invalid JWT token is provided', () => {
            chai.assert.fail(true, true, 'Not implemented');
        });
    });
});

after(() => {
    return server.close();
});