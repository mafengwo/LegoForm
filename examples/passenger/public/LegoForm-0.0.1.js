/*
 * LegoForm
 * 
 *
 * Version: 0.0.1 - 2016-09-24
 * License: MIT
 */
angular.module("LegoForm", ["lf.tpls", "lf.service.event","lf.service.form","lf.service.validation","lf.lego.checkbox","lf.lego.form","lf.lego.input","lf.lego.radio","lf.lego.select","lf.lego.submit","lf.lego.textarea"]);
angular.module("lf.tpls", ["lf/checkbox.html","lf/form.html","lf/input.html","lf/radio.html","lf/select.html","lf/submit.html","lf/textarea.html"]);
angular.module('lf.service.event', []).service('eventService', function () {


    var eventStore = {};

    this.on = function (id, event, condition, handler) {

        eventStore[id][event].condition = condition;
        eventStore[id][event].handler = handler;
    };

    this.trigger = function (event) {
        if (angular.isFunction(eventStore[event])) {
            eventStore[event]();
        }
    };

    this.unbind = function (event) {
        delete eventStore[event];
    };

});
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
                                lego_type: lego.type,
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

            return [lego.label, ' ', message].join('');
        }
    });
angular.module('lf.lego.checkbox', [])
    .controller('CheckboxController', ['$scope', function ($scope) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {

            ngModelCtrl = _ngModelCtrl;
        };

        $scope.$on('lf.event.validation.checkbox', function(event, data) {

            $scope.validationError = data;
        });
        
        $scope.check = function (one, $event) {

            if ($event.target.tagName !== 'INPUT') {
                return false;
            }
            
            _checkNgModelDataType();
            
            var $modelValue = ngModelCtrl.$modelValue,
                index = $modelValue.indexOf(one.value);

            if (index === -1) {
                $modelValue.push(one.value);
            } else {
                $modelValue.splice(index, 1);
            }
            ngModelCtrl.$setViewValue($modelValue);
        };

        $scope.isChecked = function (one) {

            return angular.isDefined(ngModelCtrl.$modelValue) 
                && ngModelCtrl.$modelValue.indexOf(one.value) !== -1;
        };

        function _checkNgModelDataType() {
            
            if (!angular.isArray(ngModelCtrl.$modelValue)) {
                throw TypeError('The data type of lego-checkbox must be an array.');
            }
        }

    }])
    .directive('legoCheckbox', function () {
        return {
            require: ['legoCheckbox', 'ngModel'],
            restrict: 'E',
            scope: {
                lego: '='
            },
            templateUrl: 'lf/checkbox.html',
            controller: 'CheckboxController',
            link: function (scope, elem, attrs, ctrls) {

                var checkboxCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                checkboxCtrl.init(ngModelCtrl);

            }
        }
    });
angular.module('lf.lego.form', [])
    .controller('FormController', ['$scope', 'formService', function ($scope, formService) {

        var legoDef, ngModel;

        this.setLegoDef = function (_legoDef) {
            legoDef = _legoDef;
            this.init();
        };

        this.setNgModel = function (_ngModel) {
            ngModel = _ngModel;
            this.init();
        };

        this.init = function () {
            if (legoDef && ngModel) {
                formService.init(legoDef, ngModel);
            }
        };


    }])
    .directive('legoForm', function () {
        return {
            require: ['legoForm', 'ngModel'],
            restrict: 'E',
            scope: {
                legoDef: '=?',
                ngModel: '=?'
            },
            templateUrl: 'lf/form.html',
            controller: 'FormController',
            link: function (scope, elem, attrs, ctrls) {

                var formCtrl = ctrls[0];

                scope.$watch('legoDef', function (nv) {
                    if (nv && angular.isArray(nv) && nv.length > 0) {
                        formCtrl.setLegoDef(nv);
                    }
                });

                scope.$watch('ngModel', function (nv) {
                    if (nv) {
                        formCtrl.setNgModel(nv);
                    }
                });
            }
        }
    });

angular.module('lf.lego.input', [])
    .controller('InputController', ['$scope', function ($scope) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

        $scope.$on('lf.event.validation.input', function(event, data) {
            
            $scope.validationError = data;
        });
    }])
    .directive('legoInput', function () {
        return {
            require: ['legoInput', 'ngModel'],
            restrict: 'E',
            scope: {
                ngModel: '=',
                lego: '='
            },
            templateUrl: 'lf/input.html',
            controller: 'InputController',
            link: function (scope, elem, attrs, ctrls) {

                var inputCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                inputCtrl.init(ngModelCtrl);
            }
        }
    });

/**
 * Created by mafengwo on 16/6/13.
 */
angular.module('lf.lego.radio', [])
    .controller('RadioController', ['$scope', function ($scope) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {

            ngModelCtrl = _ngModelCtrl;
        };

        $scope.check = function (one, $event) {

            if ($event.target.tagName !== 'INPUT') {
                return false;
            }

            ngModelCtrl.$setViewValue(one.value);
        };

        $scope.isChecked = function (one) {
            return ngModelCtrl.$modelValue === one.value;
        }
    }])
    .directive('legoRadio', function () {
        return {
            require: ['legoRadio', 'ngModel'],
            restrict: 'E',
            scope: {
                lego: '=?'
            },
            templateUrl: 'lf/radio.html',
            controller: 'RadioController',
            link: function (scope, elem, attrs, ctrls) {

                var radioCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                radioCtrl.init(ngModelCtrl);

            }
        }
    });
angular.module('lf.lego.select', [])
    .controller('SelectController', ['$scope', function ($scope) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {

            ngModelCtrl = _ngModelCtrl;
        };
    }])
    .directive('legoSelect', function () {
        return {
            require: ['legoSelect', 'ngModel'],
            restrict: 'E',
            scope: {
                lego: '=',
                ngModel: '='
            },
            templateUrl: 'lf/select.html',
            controller: 'SelectController',
            link: function (scope, elem, attrs, ctrls) {

                var selectCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                selectCtrl.init(ngModelCtrl);

            }
        }
    });
angular.module('lf.lego.submit', [])
    .controller('SubmitController', ['$scope', 'formService', function ($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

        $scope.submit = function () {

            formService.submit();
        };

    }])
    .directive('legoSubmit', function () {
        return {
            require: ['legoSubmit', 'ngModel'],
            restrict: 'E',
            controller: 'SubmitController',
            templateUrl: 'lf/submit.html',
            link: function (scope, elem, attrs, ctrls) {

                var submitCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                submitCtrl.init(ngModelCtrl);
            }
        }
    });

angular.module('lf.lego.textarea', [])
    .controller('TextareaController', ['$scope', 'formService', function($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

    }])
    .directive('legoTextarea', function () {
        return {
            require: ['legoTextarea', 'ngModel'],
            restrict: 'E',
            scope: {
                maxLength: '=?',
                ngModel: '=?'
            },
            templateUrl: 'lf/textarea.html',
            controller: 'TextareaController',
            link: function (scope, elem, attrs, ctrls) {

                var textareaCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                textareaCtrl.init(ngModelCtrl, attrs);
            }
        }
    });

angular.module("lf/checkbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/checkbox.html",
    "<label ng-bind=\"lego.label\"></label><span style=\"color:red\" ng-bind=\"validationError[lego.name]\"></span>\n" +
    "<div class=\"lf-lego-checkbox\">\n" +
    "    <label class=\"item\" ng-repeat=\"one in lego.options\" ng-click=\"check(one, $event)\">\n" +
    "        <input type=\"checkbox\" ng-checked=\"isChecked(one)\" ng-disabled=\"lego.states.disabled\">\n" +
    "        <span class=\"label-text\" ng-bind=\"one.label\"></span>\n" +
    "    </label>\n" +
    "</div>");
}]);

angular.module("lf/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/form.html",
    "<form class=\"form\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-repeat=\"lego in legoDef\" ng-switch=\"lego.type\" class=\"col-md-{{lego.style.width}}\">\n" +
    "            <div class=\"form-group\">\n" +
    "\n" +
    "                <!-- input -->\n" +
    "                <lego-input\n" +
    "                        ng-switch-when=\"input\"\n" +
    "                        lego=\"lego\"\n" +
    "                        ng-model=\"ngModel[lego.name]\"\n" +
    "                ></lego-input>\n" +
    "\n" +
    "                <!-- radio -->\n" +
    "                <lego-radio\n" +
    "                        ng-switch-when=\"radio\"\n" +
    "                        lego=\"lego\"\n" +
    "                        ng-model=\"ngModel[lego.name]\"\n" +
    "                ></lego-radio>\n" +
    "\n" +
    "                <!-- checkbox -->\n" +
    "                <lego-checkbox\n" +
    "                        ng-switch-when=\"checkbox\"\n" +
    "                        lego=\"lego\"\n" +
    "                        ng-model=\"ngModel[lego.name]\"\n" +
    "                ></lego-checkbox>\n" +
    "\n" +
    "                <!-- select -->\n" +
    "                <lego-select\n" +
    "                        ng-switch-when=\"select\"\n" +
    "                        lego=\"lego\"\n" +
    "                        ng-model=\"ngModel[lego.name]\"\n" +
    "                ></lego-select>\n" +
    "\n" +
    "                <!-- textarea -->\n" +
    "                <lego-textarea\n" +
    "                        ng-switch-when=\"textarea\"\n" +
    "                        lego=\"lego\"\n" +
    "                        ng-model=\"ngModel[lego.name]\"\n" +
    "                ></lego-textarea>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <lego-submit ng-model=\"ngModel\"></lego-submit>\n" +
    "</form>");
}]);

angular.module("lf/input.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/input.html",
    "<label ng-bind=\"lego.label\"></label><span style=\"color:red\" ng-bind=\"validationError[lego.name]\"></span>\n" +
    "<input type=\"text\" ng-model=\"ngModel\" ng-change=\"change()\" ng-disabled=\"lego.states.disabled\"\n" +
    "       maxlength=\"{{maxLength}}\" class=\"form-control\">");
}]);

angular.module("lf/radio.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/radio.html",
    "<label ng-bind=\"lego.label\"></label>\n" +
    "<div class=\"lf-lego-radio\">\n" +
    "    <label class=\"item\" ng-repeat=\"one in lego.options\" ng-click=\"check(one, $event)\">\n" +
    "        <input type=\"radio\" ng-checked=\"isChecked(one)\" ng-disabled=\"lego.states.disabled\">\n" +
    "        <span class=\"label-text\" ng-bind=\"one.label\"></span>\n" +
    "    </label>\n" +
    "</div>");
}]);

angular.module("lf/select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/select.html",
    "<label ng-bind=\"lego.label\"></label>\n" +
    "<select class=\"form-control\" ng-options=\"o.value as o.label for o in lego.options\" \n" +
    "        ng-model=\"ngModel\" ng-disabled=\"lego.states.disabled\"></select>");
}]);

angular.module("lf/submit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/submit.html",
    "<button class=\"btn btn-default\" ng-click=\"submit()\">\n" +
    "    Submit\n" +
    "</button>");
}]);

angular.module("lf/textarea.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lf/textarea.html",
    "<textarea ng-model=\"ngModel\" ng-disabled=\"lego.states.disabled\" maxlength=\"{{maxLength}}\" class=\"form-control\"></textarea>");
}]);
