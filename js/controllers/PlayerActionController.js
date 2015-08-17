angular.module("myApp")
    .controller("PlayerActionController", PlayerActionController);

PlayerActionController.$inject = ["$scope", "$routeParams", "playerService"];

function PlayerActionController($scope, $routeParams, playerService) {

    "use strict";

    $scope.addProcess = {
        isActionForm: false,
        actionType: "",
        actionResult: "",
        redacting: false,
        beforeSendMistake: false,
    };

    $scope.baseFormSettings = {
        minAge: 15,
        maxAge: 50,
        minGoals: 0,
        maxGoals: 99,
        minPasses: 0,
        maxPasses: 99,
        minRating: 1,
        maxRating: 10
    };

    $scope.chooseClubSettings = {
        priorityCountry: "",
        selectedData: false,
    };

    $scope.showClub = showClub;
    $scope.clearPlayerForm = clearPlayerForm;
    $scope.actionPlayer = actionPlayer;

    $scope.$on("redactPlayer", function(event, playerToRedact) {
        prepareRedactPlayer(playerToRedact);
    });

    init();

    function init() {
        setBasePlayerToAdd();
        $scope.chooseClubSettings.priorityCountry = $routeParams["country"];
    }

    function actionPlayer(form) {
        if(form.$valid) {
            $scope.playerToAdd.positionId = +$scope.playerToAdd.positionId;
            $scope.addProcess.isActionForm = true;
            $scope.addProcess.beforeSendMistake = false;
            $scope.addProcess.redacting ? redactPlayer(form) : addPlayer(form);
        }
        else {
            $scope.addProcess.beforeSendMistake = true;
        }
    }

    function addPlayer(form) {
        $scope.addProcess.actionType = "add";
        $scope.playerToAdd.clubId = $scope.$parent.club.id;
        var promise = playerService.add($scope.playerToAdd);
        promise.then(addPlayerSuccess, addPlayerError);
    }

    function addPlayerSuccess(data) {
        $scope.playerToAdd.id = data.id;
        $scope.$parent.endAddPlayer(angular.copy($scope.playerToAdd));
        setBasePlayerToAdd();
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "success";
    }

    function addPlayerError(data, status) {
        console.log(status);
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "error";
    }

    function prepareRedactPlayer(player) {
        $scope.chooseClubSettings.selectedData = true;
        $scope.addProcess.redacting = true;
        $scope.playerToAdd = player;
    }

    function redactPlayer(form) {
        $scope.addProcess.actionType = "redact";
        var promise = playerService.redact($scope.playerToAdd);
        promise.then(redactPlayerSuccess, redactPlayerError);
    }

    function redactPlayerSuccess(data) {
        $scope.$parent.endRedactPlayer(angular.copy($scope.playerToAdd));
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "success";
    }

    function redactPlayerError(data, status) {
        console.log(status);
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "error";
    }

    function clearPlayerForm() {
        if($scope.addProcess.redacting) {
            $scope.addProcess.redacting = false;
        }
        $scope.addProcess.beforeSendMistake = false;
        setBasePlayerToAdd();
        $scope.$parent.cancelAddRedPlayer();
    }

    function showClub(data) {
        $scope.playerToAdd.clubId = data.id;
        $scope.playerToAdd.clubValue = data.name;
        $scope.chooseClubSettings.priorityCountry = data.country;
        $scope.chooseClubSettings.selectedData = true;
    }

    //устанавливаем базовые значения, в том числе после добавления и закрытия формы
    function setBasePlayerToAdd() {
        $scope.playerToAdd = {
            id: -1,
            positionId: 1,
        };
    }

}