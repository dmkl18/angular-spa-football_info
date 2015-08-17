angular.module("myApp")
    .directive('actionsClubView', actionsClubViewDirective);
/*
* Директива используется для того, чтобы во время одного из действий (добавление, редактирование, удаление)
* были недоступны другие
* Данная директива может работать как через настройку атрибута process,
* так и просто через события
*
* Для того, чтобы данная директива работала, обязательно требуется подключение jQuery
* */
function actionsClubViewDirective() {

    "use strict";

    var classTypes = [
        "delete",
        "redact"
    ];

    return {

        restrict: 'A',

        scope: {
            process: "=",
            type: "=",
            index: "="
        },

        link: function($scope, $element, $attrs) {

            var selector = $attrs["actionsClubView"],
                children = $attrs["children"],
                classPart = $attrs["baseClassPart"];

            $scope.$watch("process", checkClubAction);

            $scope.$on("beginClubAction", function(event, index, type) {
                beginClubAction(index, type);
            });

            $scope.$on("endClubAction", function(event) {
                endClubAction();
            });

            $scope.$on("endAddProcessClubAction", endAddProcessClubAction);

            function checkClubAction() {
                if($scope.process === true) {
                    beginClubAction($scope.index, $scope.type);
                }
                else {
                    endClubAction();
                }
            }
            /*
            * При возникновении данного события делаем кнопки редактирования и удаления недоступными
            *   - при добавлении недоступны все данные кнопки
            *   - при редактировании или удалении кнопки для клуба, который в данный момент редактируется или удаляется, скрываются,
            *       а вместо них появляются сообщение о том, что происходит редактирование или удаление
            * */
            function beginClubAction(indexElement, type) {

                var index = indexElement === undefined ? -1 : +indexElement,
                    elements = angular.element(document.querySelectorAll(selector));

                if(elements.length) {
                    if (index === -1 || isNaN(index)) {
                        elements.find(children).prop("disabled", true);
                    }
                    else if (index >= 0) {
                        var otherElements = elements.filter(function(i) {
                            if(i !== index) {
                                return true;
                            }
                            else {
                                var cl = "." + classPart + "-" + classTypes[type];
                                jQuery(this).addClass("active").css("display", "none").nextAll(cl).css("display", "block");
                                return false;
                            }
                        });
                        otherElements.find(children).prop("disabled", true);
                    }
                }
            }

            /*
            * Данное событие вызывается при завершении действия
            *   - при этом кнопки делаются доступными
            *   - также скрывается сообщение, которое было при редактировании или удалении
            * */
            function endClubAction() {
                var elements = angular.element(document.querySelectorAll(selector + " " + children + ":disabled")),
                    activeElements = angular.element(document.querySelectorAll(selector + ".active"));
                if(elements.length) {
                    elements.prop("disabled", false);
                }
                if(activeElements.length) {
                    activeElements.css("display", "block").removeClass("active").nextAll().css("display", "none");
                }
            }

            /*
            * Данное событие возникает при добавлении нового клуба
            * Оно необходимо для того, чтобы сделать кнопки редактирования и удаления недоступными в то время, пока
            *   не закрыта форма
            *   (это для кнопок вновь добавляемого клуба, т.к. сразу после добавления они видимы)
            * */
            function endAddProcessClubAction(event) {
                var elements = angular.element(document.querySelectorAll(selector + ":not(.active) " + children + ":not(:disabled)"));
                if(elements.length) {
                    elements.prop("disabled", true);
                }
            }

        }
    };

}