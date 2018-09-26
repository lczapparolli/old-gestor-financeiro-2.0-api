const chai = require('chai');
const expect = chai.expect;
const crypt = require('../../app/helpers/crypt');

var testString = 'testing encryption';
var testInt = 10;
var testObject = {test: 'Object'};

describe('Crypt helper', () => {
    describe('Encrypt', () => {
        it('Should declare a `encrypt` function', () => {
            expect(crypt).to.respondsTo('encrypt');
        });

        it('Should expect a string', () => {
            expect(() => crypt.encrypt(testString)).to.not.throw();
            expect(() => crypt.encrypt(testInt)).to.throw();
            expect(() => crypt.encrypt(testObject)).to.throw();
        });
    
        it('Should return a string different from previous', () => {
            expect(crypt.encrypt(testString)).to.be.a('string').not.equal(testString);
        });
    });

    describe('Compare', () => {
        it('Should declare a `compare` function', () => {
            expect(crypt).to.respondsTo('compare');
        });

        it('Should expect two strings', () => {
            expect(() => crypt.compare(testString, testString)).to.not.throw();
            expect(() => crypt.compare(testString, testInt)).to.throw();
            expect(() => crypt.compare(testString, testObject)).to.throw();
            expect(() => crypt.compare(testInt, testString)).to.throw();
            expect(() => crypt.compare(testObject, testString)).to.throw();
            expect(() => crypt.compare(testObject)).to.throw();
        });

        it('Should return true when the plain value matches encrypted value', () => {
            var encrypted = crypt.encrypt(testString);
            expect(crypt.compare(testString, encrypted)).to.be.a('boolean').and.equal(true);
            expect(crypt.compare(encrypted, testString)).to.be.a('boolean').and.equal(false);
        });
    });
});