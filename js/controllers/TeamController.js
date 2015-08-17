angular.module("myApp")
    .controller("TeamController", TeamController);

TeamController.$inject = ["$scope", "$routeParams", "teamService", "playerService", "fromUrlToStringFilter"];

function TeamController($scope, $routeParams, teamService, playerService, fromUrlToStringFilter) {

    "use strict";

    var topPlayersOrderBy = "rating";

    $scope.clubPrepare = {
        showLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
    };

    $scope.club = {};

    $scope.players = {
        showLoading: true,
        isResult: false,
        isEmpty: false,
        topCount: 5,
        values: [],
    };

    init();

    function init() {
        var clubName = fromUrlToStringFilter($routeParams["club"]),
            country = fromUrlToStringFilter($routeParams["country"]);
        getClub(clubName, country);
        getTopPlayers(clubName, country);
    }

    function getClub(clubName, country) {
        var promise = teamService.getOne(clubName, country);
        promise.then(getClubSuccess, getClubError);
    }

    function getClubSuccess(data) {
        $scope.club = data.values;
        $scope.clubPrepare.showLoading = false;
        $scope.clubPrepare.isResult = true;
    }

    function getClubError(data, status) {
        $scope.clubPrepare.showLoading = false;
        $scope.clubPrepare.isMistake = true;
        $scope.clubPrepare.mistakeMessage = data.mistake;
        console.log(data.status, data.mistake);
    }

    function getTopPlayers(clubName, country) {
        var options = {
            orderBy: topPlayersOrderBy,
            direction: "DESC",
            limit: $scope.players.topCount
        };
        var promise = playerService.getAll(clubName, country, options);
        promise.then(getTopPlayersSuccess, getTopPlayersError);
    }

    function getTopPlayersSuccess(data) {
        $scope.players.showLoading = false;
        if(!data.values.length) {
             $scope.players.isEmpty = true;
        }
        else {
            $scope.players.values = data.values;
            $scope.players.isResult = true;
        }
    }

    function getTopPlayersError(data, status) {
        $scope.players.showLoading = false;
        console.log(data.status, data.mistake);
    }

}