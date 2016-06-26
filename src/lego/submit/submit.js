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
