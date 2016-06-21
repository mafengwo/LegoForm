describe("Unit test: FormService", function () {

    var _Mock_FormDef = [
        {
            id: 1,
            name: 'Basic Form',
            lego: [
                {
                    name: 'Passenger$$name$$1$$1',
                    required: 1,
                    label: 'Name',
                    type: 'Input',
                    tips: ''
                },
                {
                    name: 'Passenger$$gender$$1$$2',
                    required: 1,
                    label: 'Gender',
                    type: 'Radio',
                    options: [{label: 'Male', value: 0}, {label: 'Female', value: 1}],
                    tips: 'Select Passenger\'s gender'
                }
            ]
        }
    ];


    var formService, modelService;

    beforeEach(module('lf.service.model'));
    beforeEach(module('lf.service.form'));

    beforeEach(inject(function ($injector) {

        modelService = $injector.get('modelService');
        formService = $injector.get('formService');
    }));


    it('should be initialized', function () {

        var getSchemaByLegoNameFunc, form;
        sinon.stub(modelService, 'getModelById').returns({id: 1, relationship: 0});
        getSchemaByLegoNameFunc = sinon.stub(modelService, 'getSchemaByLegoName');
        getSchemaByLegoNameFunc.withArgs('Passenger$$name$$1$$1').returns({
            id: 1,
            model_id: 1,
            column: 'name',
            column_data_default_value: '',
            column_data_type: 0,
            column_key_type: 1
        });
        getSchemaByLegoNameFunc.withArgs('Passenger$$gender$$1$$2').returns({
            id: 2,
            model_id: 1,
            column: 'id',
            column_data_default_value: '',
            column_data_type: 1,
            column_key_type: 0
        });
        formService.initFormDef(_Mock_FormDef);

        form = formService.getForm();
        
        form.should.be.a('array');
        expect(form).to.have.lengthOf(1);
        expect(form[0]).to.have.property('Passenger$$name$$1$$1');
        expect(form[0]).to.have.property('Passenger$$gender$$1$$2');
        
        assert.propertyVal(form[0], 'Passenger$$name$$1$$1', '');
        assert.propertyVal(form[0], 'Passenger$$gender$$1$$2', 0);
    })

});