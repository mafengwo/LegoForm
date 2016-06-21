angular.module('lf.lego.input', [])
    .controller('InputController', function () {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

    })
    .directive('legoInput', function () {
        return {
            require: ['legoInput', 'ngModel'],
            restrict: 'E',
            scope: {
                maxLength: '=?',
                ngModel: '=?'
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
