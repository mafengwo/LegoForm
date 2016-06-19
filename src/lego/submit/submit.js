angular.module('lf.lego.submit', [])
    .controller('SubmitController', ['$scope', 'formService', function ($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

        $scope.submit = function () {
            
            var validationResult = formService.validate()
        }

    }])
    .directive('legoSubmit', function () {
        return {
            require: ['legoSubmit', 'ngModel'],
            restrict: 'A',
            scope: {},
            controller: 'FormController',
            link: function (scope, elem, attrs, ctrls) {

                var formCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                formCtrl.init(ngModelCtrl);
            }
        }
    });
