angular.module("myApp")
    .controller("TopScorersController", TopScorersController);

TopScorersController.$inject = ["$scope", "$routeParams", "topScorerService", "teamService", "$timeout", "arrayHelperService", "fromUrlToStringFilter"];

function TopScorersController($scope, $routeParams, topScorerService, teamService, $timeout, arrayHelperService, fromUrlToStringFilter) {

    "use strict";

    var maxScorersCount = 25,
        isCountryClubList = false,
        prepareRedactPlayer = null,
        playerToDelete = {};

    //начальные данные по бомбардирам, в том числе и начальная сортировка
    $scope.topScorers = {
        showLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
        isEmpty: false,
        currentSort: "-goals",
        values: []
    };

    //данные по стране, в том числе список клубов,
    //который добавляется в случае, если пытаются добавить клуб
    $scope.country = {
        showLoading: false,
        isMistake: false,
        name: "",
        clubs: []
    };

    $scope.actions = {};

    $scope.redactPlayer = redactPlayer;
    $scope.deletePlayer = deletePlayer;
    $scope.cancelAddRedPlayer = cancelAddRedPlayer;
    $scope.confirmingDeletionPlayer = confirmingDeletionPlayer;
    $scope.cancelDeletingPlayer = cancelDeletingPlayer;

    /*
     * Дополнительные настройки - модальное окно для подтверждения удаления данных о команде
     * */
    $scope.confirmingDeleteWindow = {
        isShown: false,
        close: closeDeleteWindow,
        show: showDeleteWindow,
    };

    init();

    function init() {
        var country = $routeParams["country"] ? fromUrlToStringFilter($routeParams["country"]) : "england";
        $scope.country.name = country;
        setBaseActions();
        getAllTopScorers(country);
    }

    function setBaseActions() {
        $scope.actions.isNeedToShowForm = false;
        $scope.actions.isActionProcess = false;
        $scope.actions.isDeletingProcess = false;
        $scope.actions.indexAction = -1;
        $scope.actions.typeAction = -1;
    }

    //***************** получение исходных данных с сервера *******************************
    function getAllTopScorers(country) {
        var promise = topScorerService.getAll(country, maxScorersCount);
        promise.then(getAllScorersSuccess, getAllScorersError);
    }

    function getAllScorersSuccess(data) {
        $scope.topScorers.showLoading = false;
        if(!data.values.length) {
            $scope.topScorers.isEmpty = true;
        }
        else {
            $scope.topScorers.values = data.values;
            $scope.topScorers.isResult = true;
        }
    }

    function getAllScorersError(data, status) {
        $scope.topScorers.showLoading = false;
        $scope.topScorers.isMistake = true;
        $scope.topScorers.mistakeMessage = data.mistake;
        console.log(data.status, data.mistake);
    }

    function getCountryClubs(country) {
        $scope.country.showLoading = true;
        $scope.country.isMistake = false;
        var promise = teamService.getAll(country);
        promise.then(getCountryClubsSuccess, getCountryClubsError);
    }

    function getCountryClubsSuccess(data) {
        isCountryClubList = true;
        $scope.country.clubs = data.values;
        $scope.country.showLoading = false;
        $timeout(
            function(){
                redactPlayer(prepareRedactPlayer, $scope.actions.indexAction);
                prepareRedactPlayer = null;
            }, 0);
    }

    function getCountryClubsError(data, status) {
        $scope.country.showLoading = false;
        $scope.country.isMistake = true;
        console.log(data.status, data.mistake);
    }
    //*****************************************************************************************************

    //**************************** Редактирование бомбардира **************************************************

    //если кнопка нажимается впервые, то дополнительно подгружается список клубов для рассматриваемой страны
    function redactPlayer(player, index) {
        $scope.actions.isActionProcess = true;
        $scope.actions.typeAction = 1;
        $scope.actions.indexAction = index;
        if(!isCountryClubList) {
            prepareRedactPlayer = player;
            getCountryClubs($scope.country.name);
        }
        else {
            $scope.$broadcast("redactPlayer", player);
            $scope.actions.isNeedToShowForm = true;
        }
    }

    //вызывается при закрытии формы
    function cancelAddRedPlayer() {
        setBaseActions();
    }

    //****************************************** Удаление бомбардира **************************************

    function confirmingDeletionPlayer(player, index) {
        playerToDelete = player;
        $scope.actions.typeAction = 0;
        $scope.actions.indexAction = index;
        $scope.actions.isActionProcess = true;
        $scope.confirmingDeleteWindow.show();
    }

    function deletePlayer() {
        $scope.actions.isDeletingProcess = true;
        var promise = topScorerService.delete(playerToDelete.id);
        promise.then(deletePlayerSuccess, deletePlayerError);
    }

    function cancelDeletingPlayer() {
        playerToDelete = {};
        setBaseActions();
        $scope.confirmingDeleteWindow.close();
    }

    function deletePlayerSuccess(data) {
        arrayHelperService.deleteOneByProperty($scope.topScorers.values, "id", playerToDelete.id);
        cancelDeletingPlayer();
    }

    function deletePlayerError(data, status) {
        cancelDeletingPlayer();
        console.log(status, data.mistake);
    }

    /* для модального окна */
    function closeDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = false;
    }

    function showDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = true;
    }

}