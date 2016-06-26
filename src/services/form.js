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
            validationService.validate(legoDef, formData);
        };

        this.submit = function () {
            $rootScope.$broadcast('lf.event.submit', formData);
        };

        function generateDefault(lego) {
            var dataType = lego.data_type.toLowerCase(),
                defaultValue = lego.default_value;
            
            if(defaultValue) {
                return defaultValue;
            } else {
                switch (dataType) {
                    case 'string': return '';
                    case 'number': return 0;
                    case 'array': return [];
                    case 'object': return {};
                }
            }
                
            
        }

    }]);