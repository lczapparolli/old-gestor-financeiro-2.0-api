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
    active: true
};

describe('Access model', function() {
    before(() => {
        var user = db.User.build(userData);

        return user.save().then(newUser => {
            userData.id = newUser.id;
            accessData.userId = newUser.id;
        });
    });

    it('Should exists a Access model', () => {
        expect(db).to.have.property('Access');
    });

    it('Should have specific properties', () => {
        var access = db.Access.build({});

        expect(access).to.have.property('userId');
        expect(access).to.have.property('accessUUID');
        expect(access).to.have.property('loginDate').instanceOf(Date);
        expect(access).to.have.property('lastRequest').instanceOf(Date);
        expect(access).to.have.property('userAgent');
        expect(access).to.have.property('active');
        expect(access).respondTo('getUser');
        expect(access).respondTo('setUser');
    });

    it('Should persist to database', () => {
        var access = db.Access.build(accessData);

        expect(access.save()).to.be.fulfilled.and.eventually.have.property('id').greaterThan(0);
    });

    it('Should validate null userId', () => {
        var access = db.Access.build(accessData);
        access.userId = null;

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate null accessUUID', () => {
        var access = db.Access.build(accessData);
        access.accessUUID = null;

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate null loginDate', () => {
        var access = db.Access.build(accessData);
        access.loginDate = null;

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate null lastRequest', () => {
        var access = db.Access.build(accessData);
        access.lastRequest = null;

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate null active', () => {
        var access = db.Access.build(accessData);
        access.active = null;

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'is_null');
    });

    it('Should validate future loginDate', () => {
        var access = db.Access.build(accessData);
        access.loginDate.setMinutes(access.loginDate.getMinutes() + 1); //Add a minute

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'futureDate');
    });

    it('Should validate future lasRequest', () => {
        var access = db.Access.build(accessData);
        access.lastRequest.setMinutes(access.lastRequest.getMinutes() + 1); //Add a minute

        return expect(access.validate()).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'futureDate');
    });

    it('Should validate duplicated accessUUID', () => {
        var access = db.Access.build(accessData);
        var accessUUID = access.accessUUID;
        
        return access.save().then(() => {
            var newAccess = db.Access.build(accessData);
            newAccess.accessUUID = accessUUID;

            var save = newAccess.save();
            return expect(save).to.be.rejected.and.eventually.have.nested.property('errors[0].validatorKey', 'not_unique');
        });
    });
});