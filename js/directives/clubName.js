angular.module("myApp")
    .directive('clubName', clubNameDirective);

clubNameDirective.$inject = ["$timeout", "$q", "teamService"];

//данная директива используется в виде атрибута поля, для которого необходимо выполнить асинхронную валидацию
/*
        !!!!
            Тут проверить данное поле можно было просто проверив массив текущих клубов
            Ajax-проверку тут делал для обучения
        !!!!
* В данном случае проверяется, есть ли уже для данной страны клуб с таким именем
* country - содержит имя страны, для которой проверяется название клуба
* redactClub - если выполняется не добавление клуба, а редактирование,
*           то атрибут содержит имя редактируемого клуба для того, чтобы не выдавалось сообщение,
*           что такой клуб уже есть
* */
function clubNameDirective($timeout, $q, teamService) {

    "use strict";

    return {

        restrict: 'A',

        require: 'ngModel',

        scope: {
            country: '=country',
            redactClub: '=redactClub',
        },

        link: function($scope, $element, $attrs, ctrl) {

            ctrl.$asyncValidators.clubName = function(modelValue, viewValue) {
                if(ctrl.$isEmpty(modelValue) || ($scope.redactClub !== "" && modelValue === $scope.redactClub)) {
                    return $q.when();
                }
                var promise;
                promise = teamService.isClubUnique(modelValue, $scope.country);
                promise.then(changeElementView, changeElementView);
                return promise;
            };

            function changeElementView() {
                //поскольку событие 'checkTouchedFieldView' не настоящее, его необходимо поставить в очередь
                $timeout(function() { $element.trigger('checkTouchedFieldView'); }, 0);
            }

        }
    };

}