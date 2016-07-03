angular.module('lf.service.validation', [])
    .service('validationService', function () {

        this.validate = function (legoDef, formData) {

            var validationErrors = [], validationPassed;

            angular.forEach(legoDef, function (lego) {

                var data = formData[lego.name], dataType = lego.data_type.toLowerCase();
                angular.forEach(lego, function (v, k) {

                    if (validator.hasOwnProperty(k)) {

                        validationPassed = validator[k].method(data, v, dataType);

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

                method: function (data, dataType) {

                    var funcName;
                    dataType = dataType.toLowerCase();
                    if (-1 !== ['string', 'number', 'array', 'object'].indexOf(dataType)) {
                        funcName = ['is', dataType.charAt(0).toUpperCase(), dataType.slice(1)].join('');
                        return angular[funcName](data);
                    } else {
                        throw Error('Unrecognized data_type of' + param);
                    }
                },
                message: 'type should be {PARAM}'
            },

            required: {

                method: function (data, param, dataType) {

                    switch (dataType.toLowerCase()) {
                        case 'string':
                            return !!data.length;
                        case 'number':
                            return !isNaN(parseFloat(data)) && isFinite(data);
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

                method: function (data, minLength, dataType) {

                    if (-1 !== ['string', 'array'].indexOf(dataType)
                        && angular.isNumber(+minLength)) {
                        
                        return data.length >= minLength;
                    } else {
                        return true;
                    }
                },
                message: 'min length is {PARAM}'
            },

            max_length: {

                method: function (data, maxLength, dataType) {

                    if (-1 !== ['string', 'array'].indexOf(dataType)
                        && angular.isNumber(+maxLength)) {

                        return data.length <= maxLength;
                    } else {
                        return true;
                    }
                },
                message: 'max length is {PARAM}'
            },

            range: {

                method: function (data, range, dataType) {

                    if (dataType === 'number' && angular.isArray(range) && range.length === 2
                        && angular.isNumber(range[0]) && angular.isNumber(range[1]) && range[0] <= range[1]) {
                        return range[0] < data && data < range[1];
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