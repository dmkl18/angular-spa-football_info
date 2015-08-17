angular.module("myApp")
    .controller("PlayersController", PlayersController);

PlayersController.$inject = ["$scope", "$routeParams", "playerService", "playerPositionsService", "arrayHelperService", "fromUrlToStringFilter"];

function PlayersController($scope, $routeParams, playerService, playerPositionsService, arrayHelperService, fromUrlToStringFilter) {

    "use strict";

    var baseRowCount = 4,
        playerToDelete = {};

    $scope.preparePlayers = {
        showLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
        isEmpty: false,
        emptyMessage: "There is no players",
    };

    $scope.club = {
        country: "",
        name: "",
        id: -1,
    };

    $scope.players = [];

    $scope.positions = {
        isMistake: false,
        values: [],
    };

    $scope.actions = {
        isActionProcess: false,
        isDeletingProcess: false,
        isNeedToShowForm: false
    };

    $scope.confirmingDeleteWindow = {
        isShown: false,
        close: closeDeleteWindow,
        show: showDeleteWindow,
    };

    $scope.addPlayer = addPlayer;
    $scope.endAddPlayer = endAddPlayer;
    $scope.redactPlayer = redactPlayer;
    $scope.endRedactPlayer = endRedactPlayer;
    $scope.cancelAddRedPlayer = cancelAddRedPlayer;
    $scope.deletePlayer = deletePlayer;
    $scope.confirmingDeletionPlayer = confirmingDeletionPlayer;
    $scope.cancelDeletingPlayer = cancelDeletingPlayer;
    $scope.isClub = isClub;

    init();

    //выбираем все позиции для игроков getPositions() и всех игроков команды getPlayers()
    function init() {
        var clubName = fromUrlToStringFilter($routeParams["club"]) || "free",
            country = fromUrlToStringFilter($routeParams["country"]) || "no country";
        $scope.club.name = clubName;
        $scope.club.country = country;
        getPositions();
        getPlayers(clubName, country);
    }

    function getPlayers(clubName, country) {
        var promise = playerService.getAll(clubName, country);
        promise.then(getPlayersSuccess, getPlayersError);
    }

    function getPlayersSuccess(data) {
        if(!data.values.length) {
            $scope.preparePlayers.isEmpty = true;
            $scope.preparePlayers.emptyMessage = data.message;
        }
        else {
            //объединяем игроков команды в зависимости от позиции playersByPosition
            var playersByPosition = prepareValues(data.values);
            //формируем массив игроков таким образом, чтобы они для каждой позиции формировали колонки по baseRowCount игрока
            for (var i = 0, lh = playersByPosition.length; i < lh; i++) {
                createPlayerGroup(playersByPosition[i].data[0].positionId, playersByPosition[i].data[0].position, playersByPosition[i].data);
            }
            $scope.preparePlayers.isResult = true;
        }
        $scope.club.id = data.clubId;
        $scope.club.name = data.clubName;
        $scope.preparePlayers.showLoading = false;
    }

    function getPlayersError(data, status) {
        $scope.preparePlayers.showLoading = false;
        $scope.preparePlayers.isMistake = true;
        $scope.preparePlayers.mistakeMessage = data.mistake;
        console.log(data.status, data.mistake);
    }

    function getPositions() {
        var promise = playerPositionsService.getAll();
        promise.then(getPositionsSuccess, getPositionsError);
    }

    function getPositionsSuccess(data) {
        $scope.positions.values = data.values;
    }

    function getPositionsError(data, status) {
        $scope.positions.isMistake = true;
        console.log(data.status, data.mistake);
    }

    function prepareValues(players) {
        return arrayHelperService.groupByProperty(players, "positionId");
    }

    function prepareDataToShow(items, groupedBy) {
        return arrayHelperService.createGroupsFromArray(items, groupedBy);
    }

    //********************** добавление игрока и удаление игрока ****************************************

    function addPlayer() {
        $scope.actions.isActionProcess = true;
        $scope.actions.isNeedToShowForm = true;
    }

    /*
    * После завершения добавления игрока в данный клуб, его необходиом отобразить в сетке,
    * учитывая сеточное же отображение игроков
    * */
    function endAddPlayer(player) {
        var playerGroup,
            lastGroup,
            i, lh;
        delete player.clubValue;
        for(i = 0, lh = $scope.players.length; i < lh; i++) {
            if(player.positionId === $scope.players[i].positionId) {
                player.position = $scope.players[i].positionName;
                playerGroup = $scope.players[i].data;
                break;
            }
        }
        if(playerGroup) {
            lastGroup = playerGroup[playerGroup.length-1];
            if(lastGroup.length < baseRowCount) {
                lastGroup.push(player);
            }
            else {
                playerGroup.push([player]);
            }
        }
        else {
            for(i = 0, lh = $scope.positions.values.length; i < lh; i++) {
                if(player.positionId === $scope.positions.values[i].id) {
                    player.position = $scope.positions.values[i].name;
                    break;
                }
            }
            createPlayerGroup(player.positionId, player.position, [ player ]);
            $scope.players.sort(function(a, b) {
                return a.positionId - b.positionId;
            });
        }
        if($scope.preparePlayers.isEmpty) {
            $scope.preparePlayers.isEmpty = false;
            $scope.preparePlayers.isResult = true;
        }
    }

    function createPlayerGroup(posId, posName, data) {
        $scope.players.push({
            positionId: posId,
            positionName: posName + "s",
            data: prepareDataToShow(data, baseRowCount),
        });
    }

    function redactPlayer(club, index) {
        $scope.actions.isActionProcess = true;
        $scope.actions.isNeedToShowForm = true;
        var clubToRedact = angular.copy(club);
        clubToRedact.clubValue = $scope.club.name;
        $scope.$broadcast("redactPlayer", clubToRedact);
    }

    function endRedactPlayer(player) {
        delete player.clubValue;
        endRedactPlayers(player, 1);
    }

    function cancelAddRedPlayer() {
        $scope.actions.isActionProcess = false;
        $scope.actions.isNeedToShowForm = false;
    }

    //************************** удаление игрока ***********************************************
    function confirmingDeletionPlayer(player, index) {
        playerToDelete.player = player;
        playerToDelete.index = index;
        $scope.actions.isActionProcess = true;
        $scope.confirmingDeleteWindow.show();
    }

    function deletePlayer() {
        $scope.actions.isDeletingProcess = true;
        var promise = playerService.delete(playerToDelete.player);
        promise.then(deletePlayerSuccess, deletePlayerError);
    }

    function cancelDeletingPlayer() {
        playerToDelete.player = {};
        playerToDelete.index = -1;
        $scope.actions.isDeletingProcess = false;
        $scope.actions.isActionProcess = false;
        $scope.confirmingDeleteWindow.close();
    }

    function deletePlayerSuccess(data) {
        endRedactPlayers(playerToDelete.player, 0);
        cancelDeletingPlayer();
    }

    function deletePlayerError(data, status) {
        cancelDeletingPlayer();
        console.log(status, data.mistake);
    }

    function endRedactPlayers(player, type) {
        var playerFound = false;
        for(var i = 0, lh = $scope.players.length; i < lh; i++) {
            for(var j = 0, lh2 = $scope.players[i].data.length; j < lh2; j++) {
                for(var k = 0, lh3 = $scope.players[i].data[j].length; k < lh3; k++) {
                    if ($scope.players[i].data[j][k].id === player.id) {
                        if (player.clubId === $scope.club.id && player.positionId === $scope.players[i].data[j][k].positionId && type !== 0) {
                            $scope.players[i].data[j][k] = player;
                        }
                        else {
                            if ($scope.players[i].data.length === 1 && $scope.players[i].data[j].length === 1) {
                                $scope.players.splice(i, 1);
                                if(!$scope.players.length) {
                                    $scope.preparePlayers.isEmpty = true;
                                    $scope.preparePlayers.isResult = false;
                                }
                            }
                            else if($scope.players[i].data[j].length === 1) {
                                $scope.players[i].data.splice(j, 1);
                            }
                            else {
                                $scope.players[i].data[j].splice(k, 1);
                            }
                            if (player.clubId === $scope.club.id && type === 1) {
                                endAddPlayer(player);
                            }
                        }
                        playerFound = true;
                        break;
                    }
                }
                if(playerFound) {
                    break;
                }
            }
            if(playerFound) {
                break;
            }
        }
        //необходимо для учета случая, когда мы изменили клуб игрока, зафиксировали изменения, а затем
        //не закрывая форму вернули данного игрока обратно в этот клуб
        if(!playerFound && player.clubId === $scope.club.id) {
            endAddPlayer(player);
        }
    }

    function isClub() {
        return $scope.club.id !== -1;
    }

    /* модальное окно */
    function closeDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = false;
    }

    function showDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = true;
    }

}

/*
* playersByPosition имеет вид:
*   - это массив массивов объектов вида [[a1, a2], [a3, a4]], где a1, a2... имеют вид
*       {
            positionId: Id,
            data: playerData,
         };

*   $scope.players представляет собой следующий вид:
*       - это массив объектов вида [a1, a2, a3], где a1, a2... имеют вид
*       {
             positionId: Id, //ид позиции
             positionName: positionName, //наименование позиции
             data: data
         }
        - data представляет собой массив массивов [[a1, a2, a3, a4], [a1, a2]], где каждый массив длиной не более baseRowCount для того, чтобы их отображать в сетке
* */