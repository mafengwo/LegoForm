angular.module('lf.lego.checkbox', [])
    .controller('CheckboxController', ['$scope', function ($scope) {

        var ngModelCtrl;

        if (!$scope.checkboxOptions) {
            $scope.checkboxOptions = {};
        }

        this.init = function (_ngModelCtrl) {

            ngModelCtrl = _ngModelCtrl;
        };


        $scope.check = function (one, $event) {

            if ($event.target.tagName !== 'INPUT') {
                return false;
            }
            
            if (!angular.isArray(ngModelCtrl.$modelValue)) {
                throw TypeError('The data type of lego-checkbox must be an array.');
            }
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

            if (!angular.isArray(ngModelCtrl.$modelValue)) {
                throw TypeError('The data type of lego-checkbox must be an array.');
            }

            return ngModelCtrl.$modelValue.indexOf(one.value) !== -1;
        }

    }])
    .directive('legoCheckbox', function () {
        return {
            require: ['legoCheckbox', 'ngModel'],
            restrict: 'E',
            scope: {
                checkboxOptions: '=?'
            },
            templateUrl: 'lf/checkbox.html',
            controller: 'CheckboxController',
            link: function (scope, elem, attrs, ctrls) {

                var radioCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                radioCtrl.init(ngModelCtrl);

            }
        }
    });