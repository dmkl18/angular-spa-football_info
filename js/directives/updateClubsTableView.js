angular.module("myApp")
    .directive('updateClubsTableView', updateClubsTableViewDirective);

/*
 * используется для изменения внешнего вида таблицы после добавления или редактирования, или удаления записи
 * при необходимости изменяется визуальное представление клубов в зоне Лиги Чемпионов, Лиги Европы, зоне вылета
 *
 * Использую setTimeout для постановки в очередь, также не использую $timeout, потому что в основной функции не вносятся изменения в модель и лишний цикл не надо
 * */
function updateClubsTableViewDirective() {

    "use strict";

    var baseClasses = {
        chL: "bg-success",
        euL: "bg-info",
        clubRemove: "bg-danger-dlc"
    };

    return {

        restrict: 'A',

        scope: {
            championsLeague: '@chl',
            leagueEurope: '@el',
            clubRemove: "@",
            tableResult: "="
        },

        link: function($scope, $element, $attrs) {

            var selector = $attrs["updateClubsTableView"];

            $scope.$on("updateTableView", function(event) {
                updateTableView();
            });

            $scope.$watch("championsLeague", prepareTable);

            $scope.$watch("tableResult", prepareDataWhenResult);

            function prepareTable(value) {
                updateTableView();
            }

            function prepareDataWhenResult(value) {
                setTimeout(updateTableView, 0);
            }

            function updateTableView()
            {
                var clubs = $element.find(selector);
                clubs.each(function(index) {
                    var that = angular.element(this);

                    if(index < $scope.championsLeague && !that.hasClass(baseClasses.chL)) {
                        that.addClass(baseClasses.chL);
                    }
                    else if(index >= $scope.championsLeague && that.hasClass(baseClasses.chL)) {
                        that.removeClass(baseClasses.chL);
                    }

                    if(index >= $scope.championsLeague && index < $scope.leagueEurope && !that.hasClass(baseClasses.euL)) {
                        that.addClass(baseClasses.euL);
                    }
                    else if((index >= $scope.leagueEurope || index < $scope.championsLeague) && that.hasClass(baseClasses.euL)) {
                        that.removeClass(baseClasses.euL);
                    }

                    if(+$scope.clubRemove !== 0 && index >= $scope.clubRemove && !that.hasClass(baseClasses.clubRemove)) {
                        that.addClass(baseClasses.clubRemove);
                    }
                    else if(index < $scope.clubRemove && that.hasClass(baseClasses.clubRemove)) {
                        that.removeClass(baseClasses.clubRemove);
                    }

                });
            }

        }
    };

}