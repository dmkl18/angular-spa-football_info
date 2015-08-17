angular.module("myApp")
    .service("countryService", countryService);

countryService.$inject = ["$http", "$q"];

function countryService($http, $q) {

    "use strict";

    this.getOne = function(country) {
        var deffered = $q.defer();
        var config = {
            method: "GET",
            url: "lib/country.php",
            params: {country: country},
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        };
        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

    this.getOneBaseInfo = function(country) {
        var deffered = $q.defer();
        var config = {
            method: "GET",
            url: "lib/country1.php",
            params: {country: country},
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        };
        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

    this.getAll = function() {
        var deffered = $q.defer();
        var config = {
            method: "GET",
            url: "lib/countries.php",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            cache: true
        };
        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

}