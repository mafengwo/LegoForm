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