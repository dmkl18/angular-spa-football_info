angular.module('myApp')
    .directive('reactiveForm', reactiveForm);

reactiveForm.$inject = ["$timeout"];

/*
 *   Данная директива предназначена для присваивания форме в целом в виде атрибута
 *   Сообщение об успешности или неудачи добавления или редактирования отображается в течение showTime
 */
function reactiveForm($timeout) {

    'use strict';

    var promise = null,
        showTime = 5000;

    var baseClasses = {
        successForm: "has-success",
        errorForm: "has-error",
        success: "alert alert-success",
        error: "alert alert-danger",
        notRedacting: "dlc-not-redacting" //данный класс присваивается элементу формы, который не предназначен для редактирования
    };

    var messages = {
        isDisplayed: false,
        addSuccess: "Record added successfully",
        addError: "When you try to add an entry error occurred",
        redactSuccess: "Editing was successful",
        redactError: "When editing error occurred",
    };

    return {

        restrict: 'A',
        require: 'form',
        scope: {
            actionType: "=",    //тип события ("add" - добавление, "redact" - редактирование)
            actionResult: "=",  //результат события ("success", "error")
            clearForm: "=",     //если true - очищаем форму
            actionRedact: "="   //если true - делаем редактируемые поля readonly, false - убираем readonly
        },
        link: function(scope, element, attrs, ctrl) {
            /*
            * messageBox - элемент, в который помещается сообщение об успешной или неуспешной отправке формы
            * errorBlocksClass - класс блока с ошибками для каждого элемента формы
            * */
            var messageBox = angular.element(document.querySelectorAll(attrs['messageBox'])),
                errorBlocksClass = attrs["errBlockClass"];

            scope.$watch("actionResult", createClubMessage);
            scope.$watch("clearForm", clearForm);
            scope.$watch("actionRedact", hideNotRedacting);

            //есть также возможность изменять вид формы через события
            scope.$on("actionClubError", function(event, type) {
                actionClubError(type);
            });
            scope.$on("actionClubSuccess", function(event, type) {
                actionClubSuccess(type);
            });
            scope.$on("clearClubForm", function(event) {
                clearClubForm();
            });

            function createClubMessage(value, oldValue) {
                if(value !== "") {
                    if (value === "success") {
                        actionClubSuccess(scope.actionType);
                    }
                    else if (value === "error") {
                        actionClubError(scope.actionType);
                    }
                    scope.actionResult = "";
                    scope.actionType = "";
                }
            }

            function clearForm(value, oldValue) {
                if(value) {
                    clearClubForm();
                }
            }

            /*
            * Делает поля, которые предназначены только для чтения (не для редактирования) readonly
            * Такие поля должны иметь класс baseClasses.notRedacting
            * */
            function hideNotRedacting(value, oldValue) {
                if(value) {
                    element.find("." + baseClasses.notRedacting).prop("readonly", true);
                }
                else {
                    element.find("." + baseClasses.notRedacting).prop("readonly", false);
                }
            }

            /*
            * Отображение сообщения об успешности (или неудаче) добавления/редактирования
            * */
            function actionClubSuccess(type) {
                if(type === "add") {
                    clearClubForm();
                    showMessage(messages.addSuccess, baseClasses.success);
                }
                else {
                    showMessage(messages.redactSuccess, baseClasses.success);
                }
            }

            function actionClubError(type) {
                var message = type === "add" ? messages.addError : messages.redactError;
                showMessage(message, baseClasses.error);
            }

            function clearClubForm() {
                var fieldsSuccess = element.find("." + baseClasses.successForm),
                    fieldsError = element.find("." + baseClasses.errorForm),
                    errorBlocks = element.find("." + errorBlocksClass);
                if(fieldsSuccess.length) {
                    fieldsSuccess.removeClass(baseClasses.successForm);
                }
                if(fieldsError.length) {
                    fieldsError.removeClass(baseClasses.errorForm);
                }
                if(errorBlocks.length) {
                    errorBlocks.css("display", "none");
                }
                ctrl.$setPristine();
                ctrl.$setUntouched();
            }

            function showMessage(message, messageClass) {
                if(messages.isDisplayed) {
                    clearMessage();
                    promise = null;
                }
                messageBox.addClass(messageClass).text(message);
                messages.isDisplayed = true;
                promise = $timeout(clearMessage, showTime);
            }

            function clearMessage() {
                messageBox.text("").removeClass();
                messages.isDisplayed = false;
            }

        },

    };

}