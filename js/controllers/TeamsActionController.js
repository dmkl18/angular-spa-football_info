angular.module("myApp").controller('TeamsActionController', TeamsActionController);

TeamsActionController.$inject = ['$scope', '$timeout', 'teamService', 'arrayHelperService'];

function TeamsActionController($scope, $timeout, teamService, arrayHelperService) {

    "use strict";

    $scope.clubToAdd = {};

    /*
    * isActionForm - true - пока форма отсылается и обрабатывается на сервере (при добавлении/редактировании)
    * beforeSendMistake - true - если была попытка отправить форму при том, что не все поля правильно заполнены
    * redacting - указывает, что идет редактирование (а не добавление)
    * redactClubName - название редактируемого клуба
    *                   (необходимо при отслеживании, существует ли уже клуб с таким именем для того
    *                   чтобы не происходило сравнение с самим собой)
    * */
    $scope.addProcess = {
        isActionForm: false,
        actionType: "",
        actionResult: "",
        redacting: false,
        redactClubName: "",
        beforeSendMistake: false,
    };

    $scope.createDefeatsAndPointsIfNeed = createDefeatsAndPointsIfNeed;

    $scope.actionClub = actionClub;

    $scope.clearClubForm = clearClubForm;

    $scope.$on("redactClub", function(event, clubToRedact) {
        prepareRedactClub(clubToRedact);
    });

    /*
     * отслеживает возможность автоматического подсчета кол-ва поражений и очков
     * */
    function createDefeatsAndPointsIfNeed() {
        var clubToAdd = $scope.clubToAdd;
        if(clubToAdd.games !== undefined && clubToAdd.wins !== undefined && clubToAdd.draws !== undefined) {
            var defeats = +clubToAdd.games - clubToAdd.wins - clubToAdd.draws;
            if(defeats >= 0) {
                clubToAdd.defeats = defeats;
            }
            else {
                clubToAdd.defeats = 0;
                clubToAdd.draws = clubToAdd.games - clubToAdd.wins;
            }
            clubToAdd.points = clubToAdd.wins * 3 + clubToAdd.draws;
        }
    }

    //в зависимости от того, добавляется или редактируется клуб, выбираем соответствующую функцию
    function actionClub(form) {
        if(form.$valid) {
            $scope.addProcess.isActionForm = true;
            $scope.addProcess.beforeSendMistake = false;
            $scope.addProcess.redacting ? redactClub(form) : addClub(form);
        }
        else {
            $scope.addProcess.beforeSendMistake = true;
        }
    }

    //******************************* добавление клуба ********************************

    function addClub(form) {
        $scope.addProcess.actionType = "add";
        $scope.clubToAdd.countryId = $scope.$parent.country.id;
        var promise = teamService.add($scope.clubToAdd);
        promise.then(addClubSuccess, addClubError);
    }

    /*
    * "updateTableView" - обновление формы (директива updateClubsTableView)
    * "endAddProcessClubAction" - делаем кнопки редактирования и удаления у добавленного клубы недоступными на момент
    *   пока открыта форма (директива actionsClubViewDirective)
    * */
    function addClubSuccess(data) {
        $scope.clubToAdd.id = data.value;
        arrayHelperService.addByProperty($scope.$parent.clubs.values, $scope.clubToAdd, "points");
        $scope.$parent.checkIfIsEmpty();
        $scope.clubToAdd = {};
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "success";
        $timeout(function() {
            $scope.$parent.$broadcast("updateTableView");
            $scope.$parent.$broadcast("endAddProcessClubAction");
        }, 0);
    }

    function addClubError(data, status) {
        console.log(status, data.mistake);
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "error";
    }

    //****************************************************************************************
    //**************************** редактирование клуба **************************************

    /*
    * В форме отображаем текущее состояние клуба
    * */
    function prepareRedactClub(club) {
        $scope.addProcess.redacting = true;
        $scope.addProcess.redactClubName = club.name;
        angular.copy(club, $scope.clubToAdd);
    }

    function redactClub(form) {
        $scope.addProcess.actionType = "redact";
        var promise = teamService.redact($scope.clubToAdd);
        promise.then(redactClubSuccess, redactClubError);
    }

    function redactClubSuccess(data) {
        arrayHelperService.changeOneByPropertyAndSort($scope.$parent.clubs.values, $scope.clubToAdd, "id", "points");
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "success";
        $timeout(function() {
            $scope.$parent.$broadcast("updateTableView");
        }, 0);
    }

    function redactClubError(data, status) {
        console.log(status, data.mistake);
        $scope.addProcess.isActionForm = false;
        $scope.addProcess.actionResult = "error";
    }

    //****************************************************************************************

    /*
     * Вызывается при закрытии формы
     * "clearClubForm" - возникает для того, чтобы полностью очистить форму
     * */
    function clearClubForm() {
        if($scope.addProcess.redacting) {
            $scope.addProcess.redacting = false;
            $scope.addProcess.redactClubName = "";
        }
        $scope.addProcess.beforeSendMistake = false;
        $scope.clubToAdd = {};
        $scope.$parent.cancelAddRedClub();
    }

}