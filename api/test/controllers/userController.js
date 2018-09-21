const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiPromised = require('chai-as-promised');
const app = require('../../index');
const db = require('../../app/models/db');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiPromised);

var server = chai.request(app).keepOpen();

var userData = {
    name: 'User test',
    email: 'user@test.com',
    password: 'pass123'
};

describe('UserController', function() {
    describe('User creation', () => {
        it('Should have a method for adding a new user', () => {
            var response = server.post('/users').send({});
            return expect(response).to.eventually.have.property('status').not.equal(404);
        });

        it('Should validate user fields', () => {
            var response = server.post('/users').send({});

            return Promise.all([
                expect(response).to.eventually.have.property('status', 400),
                expect(response).to.eventually.have.nested.property('body.length').greaterThan(0),
                expect(response).to.eventually.have.nested.property('body[0]').and.have.all.keys('message', 'field')
                // There is no need to verify individual fields, since the user model tests do it
            ]);
        });
        
        it('Should persist created user', () => {
            var response = server.post('/users').send(userData);
            
            return response.then(response => {
                expect(response).to.have.property('status', 200);
                return db.User.findAndCount({ where: { email: userData.email } }).then(users => { 
                    expect(users).to.have.property('count', 1); 
                });
            });
        });

        it('Should validate duplicated user', () => {
            var response = server.post('/users').send(userData);
            
            return Promise.all([
                expect(response).to.eventually.have.property('status', 400),
                expect(response).to.eventually.have.nested.property('body[0].field', 'email'),
                expect(response).to.eventually.have.nested.property('body[0].message', 'Email already used')                
            ]);
        });

        it('Shoud store encripted password', () => {
            return db.User.findOne({ where: { email: userData.email} } ).then(user => {
                expect(user).to.have.property('passwordDigest').not.equal(userData.password);
            });
        });
    });
});

after(() => {
    return server.close();
});