/**
 * Created by mafengwo on 16/5/31.
 */


describe("Unit test: ValidationService", function () {

    var validationService, formData, legoDef;

    beforeEach(module('lf.service.validation'));
    beforeEach(inject(function ($injector) {

        validationService = $injector.get('validationService');
    }));

    it('should required validation be a object', function () {

        legoDef = [{
            name: 'foo',
            data_type: 'string',
            required: true
        }];
        formData = {foo:''};
        
        var validateResult = validationService.validate(legoDef, formData);
        
        validateResult.should.be.a('array');
        validateResult.should.have.lengthOf(1);
        validateResult[0].lego_name.should.equal('foo');
        validateResult[0].message.should.equal('[LegoValidationError] Lego (foo) is required!');
    });
    
    it


});