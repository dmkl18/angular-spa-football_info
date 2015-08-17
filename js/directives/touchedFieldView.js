angular.module('myApp')
    .directive('touchedFieldView', touchedFieldView);

/*
 *   данная директива применяется к полям формы, для которых необходимо визуально отображать ошибки,
 *   которые возникли при заполнении данного поля
 *   Данная директива присваивается не конкретно элементу формы, а всему блоку, содержащему данный элемент
 */
function touchedFieldView() {

    'use strict';

    var baseClasses = {
        success: "has-success",
        error: "has-error",
    };

    return {

        restrict: 'A',
        require: '^form',
        scope: {
            param: '@touchedFieldView', //атрибут name связанного поля формы
        },
        link: function(scope, element, attrs, ctrl) {
            /*
            * chElem - элемент формы, с которым связана данная директива
            * needCheckAjax - если данный атрибут есть и равен строке "true", то необходима
            *                   для данного поля ajax-проверка
            * createView - функция, которая используется для присваивания класса всему блоку в зависимости от успешности проверки,
            *           а также для отображения блока ошибок
            * */
            var chElem = element.find('[name=' + scope.param + ']'),
                needCheckAjax = attrs['checkAjaxView'],
                helpBlockClass = attrs['errBlockClass'];

            if(chElem.length) {
                chElem.on('blur', createView);
                if(needCheckAjax === "true") {
                    chElem.on('checkTouchedFieldView', createView);
                }
            }

            function createView(event) {
                var messageBlock;
                if(ctrl[scope.param].$invalid && ctrl[scope.param].$touched) {
                    element.addClass(baseClasses.error);
                    messageBlock = element.find("." + helpBlockClass);
                    if(messageBlock.length) {
                        messageBlock.css('display', 'block');
                    }
                }
                else if(element.hasClass(baseClasses.error)) {
                    element.removeClass(baseClasses.error);
                    messageBlock = element.find("." + helpBlockClass);
                    if(messageBlock.length) {
                        messageBlock.css('display', 'none');
                    }
                }

                if(ctrl[scope.param].$valid && ctrl[scope.param].$touched) {
                    element.addClass(baseClasses.success);
                }

            }

        },

    };

}