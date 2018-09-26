const chai = require('chai');
const expect = chai.expect;
const validation = require('../../app/helpers/validation');

describe('Validation helper', () => {
    it('Should declare a `transformValidation` function and receive one parameter', () => {
        expect(validation).to.respondsTo('isEmail');
    });

    it('Should return true when a valid email is provided', () => {
        expect(validation.isEmail('valid@email.com')).to.be.equal(true);
        expect(validation.isEmail('valid@email.com.br')).to.be.equal(true);
        expect(validation.isEmail('valid@email.co.br')).to.be.equal(true);
    });

    it('Should return false when a invalid email is provided', () => {
        expect(validation.isEmail('')).to.be.equal(false); //empty string
        expect(validation.isEmail(0)).to.be.equal(false); //non string
        expect(validation.isEmail()).to.be.equal(false); //undefined
        expect(validation.isEmail('abcd')).to.be.equal(false); //simple string
        expect(validation.isEmail('valid@email')).to.be.equal(false); //without .com
        expect(validation.isEmail('valid@')).to.be.equal(false); //without domain
        expect(validation.isEmail('@email.com')).to.be.equal(false); //without address
        expect(validation.isEmail('valid@email..com')).to.be.equal(false); //with two dots
        expect(validation.isEmail('valid@email.c')).to.be.equal(false); //single letter top level domain
    });

});