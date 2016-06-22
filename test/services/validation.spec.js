/**
 * Created by mafengwo on 16/5/31.
 */


describe("Unit test: ValidationService", function () {

    var validationService, validateResult, formData, legoDef;

    formData = {
        right_0: [1, 2],
        right_1: 3,
        wrong_0_string: '',
        wrong_0_number: 0,
        wrong_0_array: [],
        wrong_0_object: {},
        wrong_1_string: [],
        wrong_1_number: 'foo',
        wrong_1_array: 'foo',
        wrong_1_object: 'foo',
        wrong_2_array: [1],
        wrong_2_string: '1',
        wrong_3_array: [1, 2, 3],
        wrong_3_string: '123',
        wrong_4: 8
    };

    legoDef = [
        {name: 'right_0', data_type: 'array', required: true, max_length: 2, min_length: 1},
        {name: 'right_1', data_type: 'number', required: true, range: [2, 4]},
        {name: 'wrong_0_string', data_type: 'string', required: true},
        {name: 'wrong_0_number', data_type: 'number', required: true},
        {name: 'wrong_0_array', data_type: 'array', required: true},
        {name: 'wrong_0_object', data_type: 'object', required: true},
        {name: 'wrong_1_string', data_type: 'string'},
        {name: 'wrong_1_number', data_type: 'number'},
        {name: 'wrong_1_array', data_type: 'array'},
        {name: 'wrong_1_object', data_type: 'object'},
        {name: 'wrong_2_array', data_type: 'array', min_length: 2},
        {name: 'wrong_2_string', data_type: 'string', min_length: 2},
        {name: 'wrong_3_array', data_type: 'array', max_length: 2},
        {name: 'wrong_3_string', data_type: 'string', max_length: 2},
        {name: 'wrong_4', data_type: 'number', range: [1, 5]}
    ];


    beforeEach(module('lf.service.validation'));
    beforeEach(inject(function ($injector) {

        validationService = $injector.get('validationService');
        validateResult = validationService.validate(legoDef, formData);
    }));

    it('validation should return array with specified length', function () {
        
        console.log(validateResult);
        validateResult.should.be.a('array');
        validateResult.should.have.lengthOf(13);
    });


    it('validation of required should works', function () {

        validateResult[0].lego_name.should.equal('wrong_0_string');
        validateResult[1].lego_name.should.equal('wrong_0_number');
        validateResult[2].lego_name.should.equal('wrong_0_array');
        validateResult[3].lego_name.should.equal('wrong_0_object');
        validateResult[0].message.should.equal('[LegoValidationError] Lego (wrong_0_string) is required!');
        validateResult[1].message.should.equal('[LegoValidationError] Lego (wrong_0_number) is required!');
        validateResult[2].message.should.equal('[LegoValidationError] Lego (wrong_0_array) is required!');
        validateResult[3].message.should.equal('[LegoValidationError] Lego (wrong_0_object) is required!');
    });

    it('validation of type should works', function () {

        validateResult[4].lego_name.should.equal('wrong_1_string');
        validateResult[5].lego_name.should.equal('wrong_1_number');
        validateResult[6].lego_name.should.equal('wrong_1_array');
        validateResult[7].lego_name.should.equal('wrong_1_object');
        validateResult[4].message.should.equal('[LegoValidationError] Lego (wrong_1_string) type should be string');
        validateResult[5].message.should.equal('[LegoValidationError] Lego (wrong_1_number) type should be number');
        validateResult[6].message.should.equal('[LegoValidationError] Lego (wrong_1_array) type should be array');
        validateResult[7].message.should.equal('[LegoValidationError] Lego (wrong_1_object) type should be object');
    });

    it('validation of min_length should works', function () {
    
        validateResult[8].lego_name.should.equal('wrong_2_array');
        validateResult[9].lego_name.should.equal('wrong_2_string');
        validateResult[8].message.should.equal('[LegoValidationError] Lego (wrong_2_array) min length is 2');
        validateResult[9].message.should.equal('[LegoValidationError] Lego (wrong_2_string) min length is 2');
    });

    it('validation of max_length should works', function () {

        validateResult[10].lego_name.should.equal('wrong_3_array');
        validateResult[11].lego_name.should.equal('wrong_3_string');
        validateResult[10].message.should.equal('[LegoValidationError] Lego (wrong_3_array) max length is 2');
        validateResult[11].message.should.equal('[LegoValidationError] Lego (wrong_3_string) max length is 2');
    });

    it('validation of range should works', function () {

        validateResult[12].lego_name.should.equal('wrong_4');
        validateResult[12].message.should.equal('[LegoValidationError] Lego (wrong_4) value range is 1 - 5');
    });
    
    

});