/*
 * Form Service 
 */
angular.module('lf.service.form', [])
    .service('formService', ['modelService', 'validationService', '$rootScope', function (modelService, validationService, $rootScope) {

        var _TYPE_DEF = {
            STRING: 0,
            NUMBER: 1,
            ARRAY: 2,
            OBJECT: 3
        };

        var _form = [];
        /**
         *
         * @type {Object}
         * @private
         */
        var _formDef = [];

        var _legoDef = [];

        var _helperMapping = {};

        var _isSaved = false;

        this.initFormDef = function (formDef) {


            _formDef.length = 0;
            _legoDef.length = 0;

            Array.prototype.push.apply(_formDef, formDef);

            _.each(_formDef, function (form, k) {

                _legoDef = _legoDef.concat(form['lego']);

                _.each(form['lego'], function (lego, kk) {
                    _helperMapping[lego.name] = [k, kk];
                });
            });

            if (!_isSaved) {
                _fillFormWithDefaultValue();
            }
        };

        this.isSaved = function () {
            return _isSaved;
        };

        this.setSaved = function (bool) {
            _isSaved = bool;
        };

        this.getForm = function () {
            return _form;
        };

        this.validate = function () {
            validationService.validate();
        };

        this.submit = function (data) {
            $rootScope.$broadcast('lf.event.submit', data);
        };

        var _fillFormWithDefaultValue = function () {

            _.each(_formDef, function (f, k) {

                if (k >= _form.length) {
                    _form.push({});
                }

                _.each(f.lego, function (lego) {

                    var modelId = lego.name.split('$$')[2];

                    if (modelService.getModelById(modelId).relationship === 1) {

                        var formIndex = _helperMapping[lego.name][0];
                        _form[formIndex][lego.name] = [];

                    } else {

                        if (!_.has(_form[k], lego.name)) {

                            var schema = modelService.getSchemaByLegoName(lego.name), defaultValue;

                            switch (schema['column_data_type']) {

                                case _TYPE_DEF.STRING:
                                    defaultValue = schema['column_default_value'] || '';
                                    break;

                                case _TYPE_DEF.NUMBER:
                                    defaultValue = schema['column_default_value']
                                        ? schema['column_default_value'] * 1 : 0;
                                    break;

                                case _TYPE_DEF.ARRAY:
                                    defaultValue = schema['column_default_value']
                                        ? JSON.parse(schema['column_default_value']) : [];
                                    break;

                                case _TYPE_DEF.OBJECT:
                                    defaultValue = schema['column_default_value']
                                        ? JSON.parse(schema['column_default_value']) : {};
                                    break;

                                default:
                                    defaultValue = ''
                            }

                            _form[k][lego.name] = defaultValue;
                        }
                    }
                });
            });
        }

    }]);