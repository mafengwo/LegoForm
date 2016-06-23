describe("Unit test: FormService", function () {

    var formService, validationService,
        formData = {},
        legoDef = [
            {name: 'lego_string', data_type: 'string'},
            {name: 'lego_number', data_type: 'number'},
            {name: 'lego_array', data_type: 'array'},
            {name: 'lego_object', data_type: 'object'},
            {name: 'lego_default_value', data_type:'object', default_value: {foo: 1}}
        ];

    beforeEach(module('lf.service.validation'));
    beforeEach(module('lf.service.form'));

    beforeEach(inject(function ($injector) {

        validationService = $injector.get('validationService');
        formService = $injector.get('formService');
        formService.init(legoDef, formData);
    }));


    it('should form data be initialized', function () {
        
        var generatedData = formService.getFormData();
        generatedData.should.be.an('object');
    });
    
    it('should be initialized with correct value', function() {
        var generatedData = formService.getFormData();
        generatedData['lego_string'].should.equal('');
        generatedData['lego_number'].should.equal(0);
        assert.deepEqual(generatedData['lego_array'], []);
        assert.deepEqual(generatedData['lego_object'], {});
        assert.deepEqual(generatedData['lego_default_value'], {foo: 1});
    });

});