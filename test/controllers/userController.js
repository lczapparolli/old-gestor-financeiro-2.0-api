const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const db = require('../../app/models/db');

const expect = chai.expect;

chai.use(chaiHttp);

var server = chai.request(app).keepOpen();

var userData = {
    name: 'User test',
    email: 'user@test.com',
    password: 'pass123'
};

describe('UserController', function() {
    describe('User creation', () => {
        it('Should have a method for adding a new user', async () => {
            var response = await server.post('/users').send({});
            expect(response).to.have.property('status').not.equal(404);
        });

        it('Should validate user fields', async () => {
            var response = await server.post('/users').send({});

            expect(response).to.have.property('status', 400);
            expect(response).to.have.nested.property('body.length').greaterThan(0);
            expect(response).to.have.nested.property('body[0]').and.have.all.keys('message', 'field');
            // There is no need to verify individual fields, since the user model tests do it
        });
        
        it('Should persist created user', async () => {
            var response = await server.post('/users').send(userData);
            expect(response).to.have.property('status', 200);
            
            var users = await db.User.findAndCount({ where: { email: userData.email } });
            expect(users).to.have.property('count', 1); 
        });

        it('Should validate duplicated user', async () => {
            var response = await server.post('/users').send(userData);
            
            expect(response).to.have.property('status', 400);
            expect(response).to.have.nested.property('body[0].field', 'email');
            expect(response).to.have.nested.property('body[0].message', 'Email already used');
        });

        it('Shoud store encripted password', async () => {
            var user = await db.User.findOne({ where: { email: userData.email} } );
            expect(user).to.have.property('passwordDigest').not.equal(userData.password);
        });
    });
});

after(() => {
    return server.close();
});