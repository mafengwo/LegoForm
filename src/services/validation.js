angular.module('lf.service.validation', [])
    .service('validationService', function () {

        this.validate = function (legoDef, formData) {

            var validationErrors = [], validationPassed;

            angular.forEach(legoDef, function (lego) {

                var data = formData[lego.name];
                angular.forEach(lego, function (v, k) {

                    if (validator.hasOwnProperty(k)) {

                        validationPassed = validator[k].method(data, v, lego);

                        if (!validationPassed) {
                            
                            validationErrors.push({
                                lego_name: lego.name,
                                message: errorMessage(validator[k].message, v, lego)
                            });
                        }
                    }
                });
            });
            return validationErrors;
        };


        var validator = {

            data_type: {

                method: function (data, param) {

                    var funcName;
                    param = param.toLowerCase();
                    if (-1 !== ['string', 'number', 'array', 'object'].indexOf(param)) {
                        funcName = ['is', param.charAt(0).toUpperCase(), param.slice(1)].join('');
                        return angular[funcName](data);
                    } else {
                        throw Error('Unrecognized data_type of' + param);
                    }
                },
                message: 'type is {PARAM}.'
            },

            required: {

                method: function (data, param, lego) {

                    switch (lego['data_type'].toLowerCase()) {
                        case 'string':
                            return !!data.length;
                        case 'number':
                            return !!data > 0;
                        case 'array':
                            return !!data.length;
                        case 'object':
                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    return true;
                                }
                            }
                            return false;
                    }
                },
                message: 'is required!'
            },

            min_length: {

                method: function (data, param, lego) {

                    switch (lego['data_type'].toLowerCase() && angular.isNumber(param)) {
                        case 'string':
                            return data.length > param;
                        case 'array':
                            return data.length > param;
                    }
                },
                message: 'min length is {PARAM}'
            },

            max_length: {

                method: function (data, param, lego) {

                    switch (lego['data_type'].toLowerCase() && angular.isNumber(param)) {
                        case 'string':
                            return data.length < param;
                        case 'array':
                            return data.length < param;
                    }
                },
                message: 'max length is {PARAM}'
            },

            range: {

                method: function (data, param, lego) {

                    if (lego.data_type.toLowerCase() === 'number' && angular.isArray(param) && param.length === 2
                        && angular.isNumber(param[0]) && angular.isNumber(param[1]) && param[0] <= param[1]) {
                        return param[0] < data && data < param[1];
                    }
                },
                message: 'value range is {PARAM[0]} - {PARAM[1]}'
            }
        };

        function errorMessage(message, param, lego) {
            var i;
            if (angular.isArray(param)) {
                for (i = 0; i < param.length; i++) {
                    message = message.replace('{PARAM[' + i + ']}', param[i]);
                }
            } else if (angular.isObject(param)) {
                for (i in param) {
                    if (param.hasOwnProperty(i)) {
                        message = message.replace('{PARAM.' + i + '}', param[i]);
                    }
                }
            } else {
                message = message.replace('{PARAM}', param);
            }

            return ['[LegoValidationError] Lego (', lego.name, ') ', message].join('');
        }
    });