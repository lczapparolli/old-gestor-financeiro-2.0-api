const chai = require('chai');
const expect = chai.expect;
const transformValidation = require('../../app/helpers/transformValidation');

var testMessage = [{'message':'Name must be 3 characters length','type':'Validation error','path':'name','value':'','origin':'FUNCTION','instance':{'id':null,'name':'','email':'','password_digest':'$2b$10$V5U35c8IL3IcKVNQwCMvQ.0g0PTcbE/1m3aiGHL2awhCExot0qf3G','password':'','active':true},'validatorKey':'len','validatorName':'len','validatorArgs':[3],'__raw':{'validatorName':'len','validatorArgs':[3]}},{'message':'Is not a valid email','type':'Validation error','path':'email','value':'','origin':'FUNCTION','instance':{'id':null,'name':'','email':'','password_digest':'$2b$10$V5U35c8IL3IcKVNQwCMvQ.0g0PTcbE/1m3aiGHL2awhCExot0qf3G','password':'','active':true},'validatorKey':'isEmail','validatorName':'isEmail','validatorArgs':[{'msg':'Is not a valid email','allow_display_name':false,'require_display_name':false,'allow_utf8_local_part':true,'require_tld':true}],'__raw':{'validatorName':'isEmail','validatorArgs':[{'msg':'Is not a valid email','allow_display_name':false,'require_display_name':false,'allow_utf8_local_part':true,'require_tld':true}]}},{'message':'Password should be at least 6 characters long','type':'Validation error','path':'password','value':'','origin':'FUNCTION','instance':{'id':null,'name':'','email':'','password_digest':'$2b$10$V5U35c8IL3IcKVNQwCMvQ.0g0PTcbE/1m3aiGHL2awhCExot0qf3G','password':'','active':true},'validatorKey':'len','validatorName':'len','validatorArgs':[6],'__raw':{'validatorName':'len','validatorArgs':[6]}}];

describe('Transform validation helper', () => {
    it('Should declare a `transformValidation` function and receive one parameter', () => {
        expect(transformValidation).to.be.a('function');
    });

    it('Should expect an array', () => {
        expect(() => transformValidation({})).to.throw();
        expect(() => transformValidation([])).to.not.throw();
    });

    it('Should return an array with the same size of the input', () => {
        expect(transformValidation([])).to.be.a('array').with.property('length').equal(0);
        expect(transformValidation(testMessage)).to.be.a('array').with.property('length').equal(testMessage.length);
    });

    it('Items should have only `field` and `message` properties', () => {
        expect(transformValidation(testMessage)).to.have.nested.property('[0]').and.have.all.keys('field', 'message');
    });
});