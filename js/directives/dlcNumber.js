angular.module("myApp")
    .directive("dlcNumber", dlcNumberDirective);

/*
* используется для проверки поля на число, в зависимости от выбранного варианта - на целое или с плавающей точкой
* */
function dlcNumberDirective() {

    "use strict";

    var INTEGER_REGEX = /^-?[1-9]\d*$/,
        FLOAT_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;

    return {

        restrict: 'A',

        require: "ngModel",

        scope: {
            dlcNumber: '@',
        },

        link: function($scope, $element, $attrs, ctrl) {

            var minMaxChecking = $attrs["minMax"] === "true";

            ctrl.$validators.dlcNumber = function(newValue, oldValue) {

                if(ctrl.$isEmpty(newValue)) {
                    return true;
                }
                if(minMaxChecking && !minMaxCheck(+newValue)) {
                    return false;
                }
                return $scope.dlcNumber === "integer" ? integer(newValue) : float(newValue);

            };

            function integer(value) {
                if(value === 0 || INTEGER_REGEX.test(value)) {
                    return true;
                }
                return false;
            }

            function float(value) {
                if(FLOAT_REGEX.test(value)) {
                    return true;
                }
                return false;
            }

            function minMaxCheck(value) {
                var min = +$attrs["min"],
                    max = +$attrs["max"];
                if(value < min || value > max) {
                    return false;
                }
                return true;
            }

        }

    };

}