/*
 * Form Service 
 */
angular.module('lf.service.form', [])
    .service('formService', ['validationService', '$rootScope', function (validationService, $rootScope) {

        var formData = {}, legoDef = [];

        this.getLegoDef = function () {

            return this.legoDef;
        };

        this.getFormData = function () {

            return this.formData;
        };

        this.init = function (legoDef, formData) {

            this.legoDef = legoDef;

            angular.forEach(legoDef, function (lego) {
                if (!formData.hasOwnProperty(lego.name)) {
                    formData[lego.name] = generateDefault(lego);
                }
            });
            this.formData = formData;
        };

        this.validate = function () {
            validationService.validate(legoDef, formData);
        };

        this.submit = function () {
            $rootScope.$broadcast('lf.event.submit');
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