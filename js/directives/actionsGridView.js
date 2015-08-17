angular.module("myApp")
    .directive("actionsGridView", actionsGridViewDirective);

/*
* Директива используется для выделения элемента в сетке путем задания ему класса active
* Сразу после внесения изменений выделение элемента пропадает
*
* Для данной диретивы обязательным является использование jQuery
* */
function actionsGridViewDirective() {

    "use strict";

    var currentElement,
        baseClasses = {
            active: "active",
        };

    return {

        restrict: "A",

        scope: {
            subElementSelector: "@actionsGridView",
            actionElementsSelector: "@clickSelector",
            endAction: "=",
        },

        link: function($scope, $element, $attrs) {

            $scope.$watch("endAction", removeActiveClass);

            $element.on("click", $scope.actionElementsSelector, createActionStyle);

            function createActionStyle(event) {
                currentElement = angular.element(event.target).parents($scope.subElementSelector);
                if(currentElement) {
                    currentElement.addClass(baseClasses.active);
                }
            }

            function removeActiveClass(value) {
                if(value === false && currentElement) {
                    currentElement.removeClass(baseClasses.active);
                    currentElement = null;
                }
            }

        },

    };

}