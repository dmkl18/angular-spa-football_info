angular.module("myApp")
    .service("playerService", playerService);

playerService.$inject = ["$q", "$http"];

function playerService($q, $http) {

    this.getAll = function(clubName, country, options) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/players.php",
                params: {
                    club: clubName,
                    country: country,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            };
        if(options) {
            if (options.orderBy) {
                config.headers["X-OrderBy"] = options.orderBy;
                if (options.direction.toUpperCase() === "DESC") {
                    config.headers["X-OrderDirection"] = "DESC";
                }
            }
            if (options.limit) {
                config.headers["X-Limit"] = options.limit;
            }
        }
        $http(config).success(function(data, status){
            data.mistake !== undefined ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

    this.getAllByPage = function(country, page, countOnPage) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/playersByPage.php",
                params: {
                    country: country,
                    page: page,
                    countOnPage: countOnPage,
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

    this.add = function(player) {
        var deffered = $q.defer(),
            config = {
                method: "POST",
                url: "lib/addPlayer.php",
                data: {
                    player: player,
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

    this.redact = function(player) {
        var deffered = $q.defer(),
            config = {
                method: "PUT",
                url: "lib/redactPlayer.php",
                data: {
                    player: player,
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

    this.delete = function(player) {
        var deffered = $q.defer(),
            config = {
                method: "DELETE",
                url: "lib/deletePlayers.php",
                data: {
                    player: player.id
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

}
