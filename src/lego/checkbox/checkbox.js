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