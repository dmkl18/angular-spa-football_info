angular.module("myApp")
    .service("teamService", teamService);

teamService.$inject = ["$http", "$q"];

function teamService($http, $q) {

    "use strict";

    this.getAll = function(country) {
        var deffered = $q.defer();
        var config = {
            method: "GET",
            url: "lib/clubs.php",
            params: {country: country},
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        };

        $http(config).success(function(data, status) {
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });

        return deffered.promise;
    };

    this.getOne = function(clubName, country, priorityChecking) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/club.php",
                params: {
                    club: clubName,
                    country: country,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };
        if(priorityChecking === true) {
            config.params.priorityChecking = 1;
        }

        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });

        return deffered.promise;
    };

    this.add = function(club) {
        var deffered = $q.defer(),
            config = {
                method: "POST",
                url: "lib/addClub.php",
                data: {
                    club: club,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };
        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });

        return deffered.promise;
    };

    this.delete = function(id) {
        var deffered = $q.defer(),
            config = {
                method: "DELETE",
                url: "lib/deleteClub.php",
                data: {
                    club: id
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

        $http(config).success(function(data, status) {
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });

        return deffered.promise;
    };

    this.redact = function(club) {
        var deffered = $q.defer(),
            config = {
                method: "PUT",
                url: "lib/redactClub.php",
                data: {
                    club: club,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });

        return deffered.promise;
    };

    this.isClubUnique = function(clubName, country) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/club.php",
                params: {
                    club: clubName,
                    country: country,
                    uniqueCheck: 1,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

        $http(config).success(function(data, status){
            if(data.mistake) {
                deffered.resolve();
            }
            else {
                deffered.reject();
            }
        }).error(function(data, status) {
            deffered.reject();
        });

        return deffered.promise;

    };

    this.searchClubByName = function(data) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/clubSearch.php",
                params: {
                    club: data.name,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

        $http(config).success(function(data, status){
            for(var i = 0, lh = data.values.length; i < lh; i++) {
                data.values[i].value = data.values[i].name;
            }
            data.mistake !== undefined ? deffered.reject(status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(status);
        });

        return deffered.promise;
    };

}