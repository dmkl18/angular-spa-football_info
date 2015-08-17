angular.module("myApp")
    .controller("TopScorerActionController", TopScorerActionController);

TopScorerActionController.$inject = ["$scope", "topScorerService", "arrayHelperService"];

function TopScorerActionController($scope, topScorerService, arrayHelperService) {

    $scope.addProcess = {
        isActionForm: false,
        actionType: "",
        actionResult: "",
        redacting: false,
        beforeSendMistake: false,
    };

    $scope.baseFormSettings = {
        minGoals: 1,
        maxGoals: 99,
    };

    $scope.actionPlayer = actionPlayer;
    $scope.clearPlayerForm = clearPlayerForm;

    $scope.$on("redactPlayer", function(event, playerToRedact) {
        prepareRedactPlayer(playerToRedact);
    });

    init();

    function init() {
        setBasePlayerToAdd();
    }

    //тут реализована возможность только редактирования, но оставлена возможность
    //для простого добавления возможности добавлять клуб
    function actionPlayer(form) {
        if(form.$valid) {
            $scope.addProcess.isActionForm = true;
            $scope.addProcess.beforeSendMistake = false;
            $scope.playerToAdd.clubId = $scope.$parent.country.clubs[$scope.playerToAdd.clubValue].id;
            $scope.playerToAdd.clubName = $scope.$parent.country.clubs[$scope.playerToAdd.clubValue].name;
            redactPlayer(form);
        }
        else {
            $scope.addProcess.beforeSendMistake = true;
        }
    }

    function prepareRedactPlayer(player) {
        $scope.addProcess.redacting = true;
        angular.copy(player, $scope.playerToAdd);
        $scope.playerToAdd.clubValue = setClubValue(player.clubName);
    }

    function redactPlayer(form) {
        $scope.addProcess.actionType = "redact";
        var promise = topScorerService.redact($scope.playerToAdd);
        promise.then(redactPlayerSuccess, redactPlayerError);
    }

    function redactPlayerSuccess(data) {
        var playerToAdd = angular.copy($scope.playerToAdd);
        delete playerToAdd.clubValue;
        arrayHelperService.changeOneByPropertyAndSort($scope.$parent.topScorers.values, playerToAdd, "id", "goals");
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "success";
    }

    function redactPlayerError(data, status) {
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "error";
        console.log(status, data.mistake);
    }

    function clearPlayerForm() {
        if($scope.addProcess.redacting) {
            $scope.addProcess.redacting = false;
        }
        $scope.addProcess.beforeSendMistake = false;
        setBasePlayerToAdd();
        $scope.$parent.cancelAddRedPlayer();
    }

    //устанавливаем базовые значения, в том числе после добавления и закрытия формы
    function setBasePlayerToAdd() {
        $scope.playerToAdd = {
            id: -1,
            clubValue: 0,
        };
    }

    //устанавливает в форме значение клуба при редактировании (в соответствии с его текущим клубом)
    function setClubValue(clubName) {
        for(var i = 0, lh = $scope.$parent.country.clubs.length; i < lh; i++) {
            if($scope.$parent.country.clubs[i].name === clubName) {
                return i;
            }
        }
    }

}