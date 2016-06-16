/**
 * Created by mafengwo on 16/5/31.
 */


describe("Unit test: ModelService", function () {

    var _Mock_Model = [{
        id: 1,
        kind: 'Passenger',
        name: 'Passenger Storage',
        relationship: 0,
        role: 1
    }];

    var _Mock_Schema = {
        1: [
            {
                id: 1,
                model_id: 1,
                column: 'id',
                column_data_default_value: '',
                column_data_type: 0,
                column_key_type: 1
            },
            {
                id: 2,
                model_id: 1,
                column: 'name',
                column_data_default_value: '',
                column_data_type: 0,
                column_key_type: 0
            },
            {
                id: 3,
                model_id: 1,
                column: 'gender',
                column_data_default_value: '',
                column_data_type: 1,
                column_key_type: 0
            },
            {
                id: 4,
                model_id: 1,
                column: 'job',
                column_data_default_value: '',
                column_data_type: 2,
                column_key_type: 0
            }
        ]
    };

    var modelService;
    beforeEach(module('lf.service.model'));

    beforeEach(inject(function ($injector) {

        modelService = $injector.get('modelService');
        modelService.should.not.to.equal(null);
        modelService.initModelDef(_Mock_Model, _Mock_Schema);
    }));

    it('should modelService be a object', function () {

        modelService.should.be.a('object');
    });

    it('should be initialized', function () {

        modelService.getModelById(1).kind.should.equal('Passenger');
    });

    it('should got correct primary model id', function () {

        modelService.getPrimaryModelId().should.equal(1);
    });

    it('should got correct primary column name', function () {

        modelService.getPrimaryColumnName().should.equal('id');
    });

    it('should got correct primary lego name', function () {

        modelService.getPrimaryLegoName().should.equal(['Passenger', 'id', 1, 1].join('$$'));
    });



});