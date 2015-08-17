angular.module("myApp")
    .service("topScorerService", topScorerService);

topScorerService.$inject = ["$q", "$http"];

function topScorerService($q, $http) {
    "use strict";

    this.getAll = function(country, limit) {
        var deffered = $q.defer();
        var config = {
            method: "GET",
            url: "lib/topScorers.php",
            params: {country: country},
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        };
        if(limit) {
            config.params.limit = limit;
        }
        $http(config).success(function(data, status) {
            data.mistake ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

    this.redact = function(player) {
        var deffered = $q.defer(),
            config = {
                method: "PUT",
                url: "lib/redactTopScorer.php",
                data: {player: player},
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

        $http(config).success(function(data, status){
            data.mistake ? deffered.reject(status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(status);
        });

        return deffered.promise;
    };

    this.delete = function(id) {
        var deffered = $q.defer(),
            config = {
                method: "DELETE",
                url: "lib/deletePlayer.php",
                data: {player: id},
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

}