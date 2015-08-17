angular.module("myApp")
    .directive('bsTooltip', bsTooltipDirective);

//Bootstrap tooltip
function bsTooltipDirective() {

    "use strict";

    return {

        restrict: 'A',

        link: function($scope, $element, $attrs) {
            $element.attr("data-toggle", "tooltip");
            $element.tooltip();
        }
    };

}