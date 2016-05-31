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

    var model;

    beforeEach(module('LegoForm'));

    beforeEach(inject(function (_modelService_) {

        _modelService_.should.not.to.equal(null);
        model = new _modelService_.Model();
        model.initModelDef(_Mock_Model, _Mock_Schema);
    }));

    it('should modelService be a object', function () {

        model.should.be.a('object');
    });

    it('should be initialized', function () {
        
        model._modelDef.should.be.a('object');
    });

    it('should got correct primary model id', function () {
        console.log(model.getPrimaryModelId());
        model.getPrimaryModelId().should.equal(1);
    });

    it('should got correct primary column name', function () {
        model.getPrimaryColumnName().should.equal('id');
    });

    it('should got correct primary lego name', function () {
        model.getPrimaryLegoName().should.equal(['Passenger', 'id', 1, 1].join('$$'));
    });



});