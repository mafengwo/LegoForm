/*
 * Form Service 
 */
angular.module('lf.service.form', [])
    .service('formService', ['validationService', '$rootScope', function (validationService, $rootScope) {

        var formData = {}, legoDef = [];

        this.getLegoDef = function () {

            return legoDef;
        };

        this.getFormData = function () {

            return formData;
        };

        this.init = function (_legoDef, _formData) {

            legoDef = _legoDef;

            angular.forEach(_legoDef, function (lego) {
                if (!_formData.hasOwnProperty(lego.name)) {
                    _formData[lego.name] = generateDefault(lego);
                }
            });
            formData = _formData;
        };

        this.validate = function () {
            return validationService.validate(legoDef, formData);
        };

        this.submit = function () {
            var errors = this.validate();
            if (!errors.length) {
                $rootScope.$broadcast('lf.event.submit', formData);
            } else {
                broadcastValidationErrors(errors);
            }
        };

        function broadcastValidationErrors(errors) {
            
            var group = {};
            
            angular.forEach(errors, function (error) {
                if (!angular.isDefined(group[error.lego_type])) {
                    group[error.lego_type] = {};
                }

                if (!angular.isDefined(group[error.lego_type][error.lego_name])) {
                    group[error.lego_type][error.lego_name] = [];
                }
                
                group[error.lego_type][error.lego_name] = error.message;
            });
            
            angular.forEach(group, function (errors, groupName) {
                $rootScope.$broadcast('lf.event.validation.' + groupName, errors);
            })
        }

        function generateDefault(lego) {

            var dataType = lego.data_type.toLowerCase(),
                defaultValue = lego.default_value;

            if (defaultValue) {
                return defaultValue;
            } else {
                switch (dataType) {
                    case 'string':
                        return '';
                    case 'number':
                        return 0;
                    case 'array':
                        return [];
                    case 'object':
                        return {};
                }
            }


        }

    }]);