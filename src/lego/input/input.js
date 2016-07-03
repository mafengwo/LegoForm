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
