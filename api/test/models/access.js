const chai = require('chai');
const chaiPromised = require('chai-as-promised');
const expect = chai.expect;
const db = require('../../app/models/db');

chai.use(chaiPromised);

var userData = {
    name: 'User name',
    email: 'access_test@user.com',
    password: '123456',
    active: true
};

var accessData = {
    loginDate: Date.now(),
    lastRequest: Date.now(),
    active: true
};

describe('Access model', function() {
    before(() => {
        var user = db.User.build(userData);

        return user.save().then(newUser => {
            userData.id = newUser.id;
        });
    });

    it ('Should exists a Access model', () => {
        expect(db).to.have.property('Access');
    });

    it ('Should have specific properties', () => {
        var access = db.Access.build({});

        expect(access).to.have.property('userId');
        expect(access).to.have.property('accessUUID');
        expect(access).to.have.property('loginDate');
        expect(access).to.have.property('lastRequest');
        expect(access).to.have.property('userAgent');
        expect(access).to.have.property('active');
    });

    it ('Should persist to database', () => {
        var access = db.Access.build(accessData);
        access.userId = userData.id;

        return access.save().then(access => {
            expect(access).to.have.property('id').not.null;
            expect(access).to.have.property('id').greaterThan(0);
        });
    });

    it ('Should validate null userId', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate null accessUUID', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate null loginDate', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate null lastRequest', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate null active', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate future loginDate', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate future lasRequest', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });

    it ('Should validate duplicated accessUUID', () => {
        chai.assert.fail(null, null, 'Not implemented');
    });
});