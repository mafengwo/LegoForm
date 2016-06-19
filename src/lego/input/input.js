angular.module('lf.lego.input', [])
    .controller('InputController', ['$scope', 'formService', function($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

    }])
    .directive('legoInput', function () {
        return {
            require: ['legoInput', 'ngModel'],
            restrict: 'E',
            scope: {
                maxLength: '=?'
            },
            templateUrl: 'lf/input.html',
            controller: 'InputController',
            link: function (scope, elem, attrs, ctrls) {

                var inputCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                inputCtrl.init(ngModelCtrl, attrs);
            }
        }
    });
