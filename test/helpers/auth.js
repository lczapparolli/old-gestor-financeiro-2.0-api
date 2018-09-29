const chai = require('chai');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
const auth = require('../../app/helpers/auth');

describe('JsonWebToken helper', () => {
    describe('signToken', () => {
        it('Should declare a `signToken` function', () => {
            expect(auth).to.respondTo('signToken');
        });

        it('Should receive an object and return a string', () => {
            expect(() => { auth.signToken(); }).to.throw();
            expect(() => { auth.signToken(10); }).to.not.throw();
            expect(() => { auth.signToken('string'); }).to.not.throw();
            expect(() => { auth.signToken({}); }).to.not.throw();
            expect(auth.signToken({})).to.be.a('string');
        });

        it('Should return a valid JWT', () => {
            var token = auth.signToken({});
            expect(() => { jwt.verify(token, process.env.TOKEN_SECRET); }).to.not.throw();
            expect(() => { jwt.verify(token, 'invalid secret'); }).to.throw();
        });
    });

    describe('getMiddleware', () => {
        it('Should declare a `getMiddleware` function', () => {
            expect(auth).to.respondTo('getMiddleware');
        });

        it('Should return a express middleware', () => {
            expect(auth.getMiddleware()).to.be.a('function');
        });
    });
});