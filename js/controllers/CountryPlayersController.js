angular.module("myApp")
    .controller("CountryPlayersController", CountryPlayersController);

CountryPlayersController.$inject = ["$scope", "$routeParams", "playerService", "fromUrlToStringFilter", "arrayHelperService"];

function CountryPlayersController($scope, $routeParams, playerService, fromUrlToStringFilter, arrayHelperService) {

    "use strict";

    var countPlayersOnPage = 24,
        playersInLine = 4;

    $scope.playersPrepare = {
        showLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
        isEmpty: false,
        emptyMessage: "There is no information about players of the country",
    };

    $scope.players = {
        values: [],
        page: 0,
        pages: 0,
        country: "",
    };

    init();

    function init() {
        var country = fromUrlToStringFilter($routeParams["country"]),
            page = +$routeParams["page"];
        if(!page || page <= 0) {
            if($routeParams["page"] === undefined) {
                page = 1;
            }
            else {
                $scope.playersPrepare.showLoading = false;
                $scope.playersPrepare.isMistake = true;
                $scope.playersPrepare.mistakeMessage = "You must enter a correct number of page";
                return;
            }
        }
        getPlayers(country, page);
        $scope.players.page = page;
        $scope.players.country = country;
    }

    function getPlayers(country, page) {
        var promise = playerService.getAllByPage(country, page, countPlayersOnPage);
        promise.then(getPlayersSuccess, getPlayersError);
    }

    function getPlayersSuccess(data) {
        $scope.players.values = arrayHelperService.createGroupsFromArray(data.values, playersInLine);
        $scope.players.page = data.page;
        $scope.players.pages = data.pages;
        $scope.playersPrepare.showLoading = false;
        $scope.playersPrepare.isResult = true;
    }

    function getPlayersError(data, status) {
        $scope.playersPrepare.showLoading = false;
        $scope.playersPrepare.isMistake = true;
        $scope.playersPrepare.mistakeMessage = data.mistake;
        console.log(data.mistake, data.status);
    }

}