/**
 * Created by mafengwo on 16/6/13.
 */
angular.module('lf.lego.radio', [])
    .controller('RadioController', ['$scope', function ($scope) {

        var ngModelCtrl;

        if (!$scope.radioOptions) {
            $scope.radioOptions = {};
        }

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
                radioOptions: '=?'
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