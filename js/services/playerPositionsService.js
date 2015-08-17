angular.module("myApp")
    .service("playerPositionsService", playerPositionsService);

playerPositionsService.$inject = ["$q", "$http"];

function playerPositionsService($q, $http) {

    this.getAll = function(clubName, country) {
        var deffered = $q.defer(),
            config = {
                method: "GET",
                url: "lib/positions.php",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                cache: true
            };
        $http(config).success(function(data, status) {
            data.mistake !== undefined ||! data.values.length ? deffered.reject(data, status) : deffered.resolve(data);
        }).error(function(data, status) {
            deffered.reject(data, status);
        });
        return deffered.promise;
    };

}