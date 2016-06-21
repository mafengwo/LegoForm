angular.module('lf.lego.textarea', [])
    .controller('TextareaController', ['$scope', 'formService', function($scope, formService) {

        var ngModelCtrl;

        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
        };

    }])
    .directive('legoTextarea', function () {
        return {
            require: ['legoTextarea', 'ngModel'],
            restrict: 'E',
            scope: {
                maxLength: '=?',
                ngModel: '=?'
            },
            templateUrl: 'lf/textarea.html',
            controller: 'TextareaController',
            link: function (scope, elem, attrs, ctrls) {

                var textareaCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                textareaCtrl.init(ngModelCtrl, attrs);
            }
        }
    });
