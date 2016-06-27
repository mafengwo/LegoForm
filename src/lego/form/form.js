angular.module('lf.lego.form', [])
    .controller('FormController', ['$scope', 'formService', function ($scope, formService) {

        var legoDef, ngModel;

        this.setLegoDef = function (_legoDef) {
            legoDef = _legoDef;
            this.init();
        };

        this.setNgModel = function (_ngModel) {
            ngModel = _ngModel;
            this.init();
        };

        this.init = function () {
            if (legoDef && ngModel) {
                formService.init(legoDef, ngModel);
            }
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

                var formCtrl = ctrls[0];

                scope.$watch('legoDef', function (nv) {
                    if (nv && angular.isArray(nv) && nv.length > 0) {
                        formCtrl.setLegoDef(nv);
                    }
                });

                scope.$watch('ngModel', function (nv) {
                    if (nv) {
                        formCtrl.setNgModel(nv);
                    }
                });
            }
        }
    });
