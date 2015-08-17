angular.module("myApp")
    .directive("clubOfPlayerAutocomplete", clubOfPlayerAutocompleteDirective);

clubOfPlayerAutocompleteDirective.$inject = ["$q", "$timeout", "teamService"];

/*
*   Используется для нахождения клубов при редактировании информации об игроке
*   Если пользователь не выберет клуб из списка, то в этом случае дополнительон будет проведена асинхронная
*   валидация, которая будет проверять, есть ли такой клуб в базе данных
* необходимо использовать jQuery-ui-autocomplete
* */
function clubOfPlayerAutocompleteDirective($q, $timeout, teamService) {

    "use strict";

    return {

        restrict: "A",
        require: 'ngModel',
        scope: {
            checkClub: "=clubOfPlayerAutocomplete",
            country: "=",
            selectData: "&onSelect",
        },
        link: function($scope, $element, $attrs, ctrl) {

            $element.autocomplete({
                source: function(request, response){
                    var data = {
                        name: request.term,
                    };
                    var promise = teamService.searchClubByName(data);
                    promise.then(function(data) {
                        response(data.values);
                    }, function() { response(); });
                },
                minLength: 2,
                delay: 600,
                select: function( event, ui ) {
                    $scope.selectData({data: ui.item});
                    $scope.$apply();
                }
            });

            $element.on("keydown", function(event) {
                $scope.checkClub = false;
                $scope.$apply();
            });
			
			$element.on("blur", function(event) {
                ctrl.$viewValue = $element.val();
				$scope.$apply();
            });

            ctrl.$asyncValidators.clubOfPlayerAutocomplete = function(modelValue, viewValue) {
                if ($scope.checkClub || ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }
                var promise,
					forCheck = modelValue === $element.val() ? modelValue : $element.val();
				promise = teamService.getOne(forCheck, $scope.country, !$scope.checkClub);
                promise.then(changeElementView, changeElementView);
                return promise;
            };

            function changeElementView(data) {
                if(data.message) {
                    $scope.selectData({data: data.values});
                }
                $timeout(function() { $element.trigger('checkTouchedFieldView'); }, 0);
            }

        }

    };

}