angular.module('lf.lego.form', [])
    .controller('FormController', ['$scope', 'formService', function($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };
        
    }])
    .directive('legoForm', function () {
        return {
            require: ['legoForm', 'ngModel'],
            restrict: 'E',
            scope: {
                legoDef: '=?',
                ngModel: '=?'
            },
            templateUrl: 'lf/form.html',
            controller: 'FormController',
            link: function (scope, elem, attrs, ctrls) {

                var formCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                formCtrl.init(ngModelCtrl);
            }
        }
    });
