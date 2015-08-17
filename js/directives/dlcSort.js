angular.module("myApp")
    .directive("dlcSort", dlcSortDirective);

//Директива используется для визуализации сортировки
function dlcSortDirective() {
    "use strict";

    var baseSettings = {
        sortClass: "dlc-sort-item",
        sortAttr: "data-sort-value",
        sortHideClass: "dlc-sort-hidden",
    };

    var sortType,
        sortTemplate = '&nbsp;<i class="fa fa-chevron-down ' + baseSettings.sortHideClass + '"></i><i class="fa fa-chevron-up ' + baseSettings.sortHideClass + '"></i>';


    return {

        restrict: "A",

        scope: {
            sort: "=dlcSort"
        },

        link: function($scope, $element, $attrs) {

            var sortElements = $element.find("." + baseSettings.sortClass);
            sortElements.append(sortTemplate);

            sortType = $scope.sort[0] === '-' ? "down" : "up";
            var currentSort = sortType === 'down' ? $scope.sort.substring(1) : $scope.sort,
                currentSortElement = $element.find("." + baseSettings.sortClass + "[data-sort-value=" + currentSort + "]");
            currentSortElement.find(".fa-chevron-" + sortType).removeClass(baseSettings.sortHideClass);

            sortElements.on("click", changeSort);
            $scope.$watch("sort", changeWatchSort);

            function changeSort(event) {
                var sort = this.getAttribute(baseSettings.sortAttr),
                    index = $scope.sort.indexOf(sort);
                if(index === -1 || index === 1) {
                    sortType = "up";
                }
                else if(index === 0) {
                    sortType = "down";
                    sort = "-" + sort;
                }
                $scope.sort = sort;
                showCurrentSort(this);
                $scope.$apply();
            }

            function changeWatchSort(newValue, oldValue) {
                sortType = newValue[0] === '-' ? "down" : "up";
                var currentSortElement,
                    currentSort = sortType === "down" ? newValue.substring(1) : newValue;
                for(var i = 0; i < sortElements.length; i++) {
                    if(sortElements.eq(i).attr(baseSettings.sortAttr) === currentSort) {
                        currentSortElement = sortElements.get(i);
                        break;
                    }
                }
                showCurrentSort(currentSortElement);
            }

            function showCurrentSort(currentSortElem) {
                sortElements.find("i").each(function() {
                    if(this.getAttribute("class").indexOf(baseSettings.sortHideClass) === -1) {
                        this.setAttribute("class", this.getAttribute("class") + " " + baseSettings.sortHideClass);
                    }
                });
                currentSortElem.getElementsByClassName("fa-chevron-" + sortType)[0].setAttribute("class", "fa fa-chevron-" + sortType);
            }

        }

    };

}