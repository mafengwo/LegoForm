/**
 * Created by mafengwo on 16/6/13.
 */
angular.module('LegoForm')
    .controller('RadioController', ['$scope', function ($scope) {

        var ngModelCtrl;

        if (!$scope.radioOptions) {
            $scope.radioOptions = {};
        }

        this.init = function (_ngModelCtrl) {

            ngModelCtrl = _ngModelCtrl;
        };

        $scope.select = function (one) {

            $scope.selected = one;
            ngModelCtrl.$setViewValue(one.value);
        }
    }])
    .directive('legoRadio', function () {
        return {
            require: ['legoRadio', 'ngModel'],
            restrict: 'E',
            scope: {
                radioOptions: '=?'
            },
            templateUrl: 'radio.html',
            controller: 'RadioController',
            link: function (scope, elem, attrs, ctrls) {

                var radioCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                radioCtrl.init(ngModelCtrl);

            }
        }
    });