angular.module("myApp")
    .directive("backToTopBottom", backToTopBottomDirective);

backToTopBottomDirective.$inject = ["$window", "$document"];

/*
* Диретива используется для плавного перехода к верху или низу сайта
*
* Использование jQuery при применении атрибута selector-class обязательно
* */
function backToTopBottomDirective($window, $document) {

    "use strict";

    var defaultSpeed = 200,
        intervalSec = 17;

    return {

        restrict: "A",

        scope: {
            backToTopBottom: "@",
            selectorClass: "@",
            delay: "@",
            bottom: "@",
            isStopCond: "@",
            stop: "&"
        },

        link: function($scope, $element, $attrs) {

            var speed = parseInt($scope.backToTopBottom) || defaultSpeed,
                delay = parseInt($scope.delay) || 0,
                bottom = $scope.bottom === "true",
                currentPos,
                newPos,
                interval,
                h;

            $scope.selectorClass ? $element.on("click", "." + $scope.selectorClass, prepareMoving)
                : $element.on("click", prepareMoving);

            function prepareMoving(event) {
                if(!$scope.isStopCond || !$scope.stop()) {
                    delay ? setTimeout(makeMoving, delay) : makeMoving();
                }
            }

            function makeMoving() {
                clearTimeout(h);
                currentPos = window.pageYOffset;
                var diffPos;
                if(!bottom) {
                    diffPos = currentPos;
                    newPos = 0;
                }
                else {
                    var windowHeight = $window.innerHeight,
                        documentHeight = $document.height();
                    diffPos = documentHeight - windowHeight - currentPos;
                    newPos = documentHeight - windowHeight;
                }
                if(diffPos > 1) {
                    interval = diffPos / speed * intervalSec;
                    if(bottom) {
                        interval = -interval;
                    }
                    if(diffPos < 200) {
                        interval = interval * 2;
                    }
                    toNewPos();
                }
            }

            function toNewPos() {
                currentPos -= interval;
                window.scroll(0, currentPos);
                if(Math.abs(currentPos - newPos) > Math.abs(interval) + 2) {
                    h = setTimeout(toNewPos, intervalSec);
                }
                else {
                    window.scroll(0, newPos);
                }
            }

        }

    };

}