angular.module("myApp")
    .directive('dlcModal', dlcModalDirective);

//Используется для отображения модального окна
//закрывается в том число и при нажатии Esc
function dlcModalDirective() {

    "use strict";

    return {

        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: "templates/modal.html",
        scope: {
            isShown: "=show",
            header: "@modalTitle",
            close: "&",
        },

        link: function($scope, $element, $attrs) {

            $scope.$watch("isShown", createKeyNav);

            function createKeyNav() {
                $scope.isShown ? document.addEventListener("keyup", closeWindow, false) : document.removeEventListener("keyup", closeWindow, false);
            }

            function closeWindow(event) {
                if(+event.which === 27) {
                    //т.к. вносили изменения в scope, обязательно их подтверждаем через $apply()
                    $scope.close();
                    $scope.$apply();
                }
            }

        }

    };

}