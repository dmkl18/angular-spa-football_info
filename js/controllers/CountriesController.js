angular.module("myApp")
    .controller("CountriesController", CountriesController);

CountriesController.$inject = ["$scope", "$routeParams", "countryService", "fromUrlToStringFilter"];

function CountriesController($scope, $routeParams, countryService, fromUrlToStringFilter) {
    "use strict";

    var currentCountry;

    $scope.countries = {
        values: [],
    };

    $scope.isCurrentCountry = isCurrentCountry;

    $scope.$on("$routeChangeSuccess", function(event, next, current) {
        setCurrentCountry(next.params.country);
    });

    init();

    function init() {
        setCurrentCountry(fromUrlToStringFilter($routeParams["country"]));
        getAllCountries();
    }

    function getAllCountries() {
        var promise = countryService.getAll();
        promise.then(getAllCountriesSuccess, getAllCountriesError);
    }

    function getAllCountriesSuccess(data) {
        $scope.countries.values = data.values;
    }

    function getAllCountriesError(data, status) {
        console.log(status, data.mistake);
    }

    function setCurrentCountry(country) {
        currentCountry = country ? country : "england";
    }

    function isCurrentCountry(country) {
        return currentCountry !== undefined && country === currentCountry;
    }

}