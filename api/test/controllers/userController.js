const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiPromised = require('chai-as-promised');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiPromised);

var server = chai.request(app).keepOpen();

describe('UserController', function() {
    describe('User creation', () => {
        it('Should have a method for adding a new user', () => {
            var request = server.post('/users').send();
            return expect(request).to.eventually.have.property('status', 200);
        });
    });

    describe('User login', () => {
        it('Should have a method for user login', () => {
            var request = server.post('/users/login').send();
            return expect(request).to.eventually.have.property('status', 200);
        });
    });
});

after((done) => {
    server.close(done);
    console.log('Server is closed');
});