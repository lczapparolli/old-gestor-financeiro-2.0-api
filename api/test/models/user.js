const chai = require('chai');
const chaiPromised = require('chai-as-promised');
const expect = chai.expect;
const db = require('../../app/models/db');

chai.use(chaiPromised);

var userData = {
    name: 'User name',
    email: 'teste@user.com',
    password: '123456',
    active: true
};

describe('User model', function() {
    it('should exists a User model', () => {
        expect(db).to.have.property('User');
    });

    it('Should have specific properties', () => {
        var user = db.User.build({});
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('email');
        expect(user).to.have.property('password_digest');
        expect(user).to.have.property('active');
    });

    it('Should persist to database', () => {
        var user = db.User.build(userData);

        return user.save().then((user) => {
            expect(user).to.have.property('id').not.null;
            expect(user).to.have.property('id').greaterThan(0);
        });
    });

    it('Should validate null name', () => {
        var user = db.User.build(userData);
        
        user.name = null;

        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate name length', () => {
        var user = db.User.build(userData);

        user.name = '';
        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'len');
    });

    it('Should validate null email', () => {
        var user = db.User.build(userData);

        user.email = null;
        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate email format', () => {
        var user = db.User.build(userData);

        user.email = 'invalid email';
        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'isEmail');
    });

    it('Should validate null password', () => {
        var user = db.User.build(userData);
        user.password = null;

        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate password length', () => {
        var user = db.User.build(userData);
        user.password = '123';

        var validation = user.validate();
        return expect(validation).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'len');
    });

    it('Should not exposes uncrypted password', () => {
        var user = db.User.build(userData);

        expect(user).to.have.property('password').not.equal(userData.password);
    });
});