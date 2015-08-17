angular.module("myApp")
    .controller("CountryController", CountryController);

CountryController.$inject = ["$scope", "$routeParams", "countryService", "fromUrlToStringFilter"];

function CountryController($scope, $routeParams, countryService, fromUrlToStringFilter) {
    "use strict";

    $scope.country = {
        isLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
        data: {}
    };

    init();

    function init() {
        var country = $routeParams["country"] ? fromUrlToStringFilter($routeParams["country"]) : "england";
        $scope.country.data.name = country;
        getCountryInfo(country);
    }

    function getCountryInfo(country) {
        var promise = countryService.getOne(country);
        promise.then(getCountryInfoSuccess, getCountryInfoError);
    }

    function getCountryInfoSuccess(data) {
        $scope.country.isLoading = false;
        $scope.country.isResult = true;
        $scope.country.data = data.value;
    }

    function getCountryInfoError(data, status) {
        $scope.country.isLoading = false;
        $scope.country.isMistake = true;
        $scope.country.mistakeMessage = data.mistake;
        console.log(data.status, data.mistake);
    }

}