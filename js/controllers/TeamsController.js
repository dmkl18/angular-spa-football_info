angular.module("myApp").controller('TeamsController', TeamsController);

TeamsController.$inject = ['$scope', '$routeParams', '$timeout', 'teamService', 'countryService', 'arrayHelperService', 'fromUrlToStringFilter'];

function TeamsController($scope, $routeParams, $timeout, teamService, countryService, arrayHelperService, fromUrlToStringFilter) {

    "use strict";

    var clubToDelete = {};

    //основная информация (данные о клубах)
    $scope.clubs = {
        showLoading: true,
        isResult: false,
        isMistake: false,
        mistakeMessage: "",
        isEmpty: false,
        values: []
    };

    /*
     Информация о стране, для которой на данный момент отображается список клубов. Это данные:
        - Информация о максимальном количестве игр в чемпионате
        - Информация о количестве участников Лиги чемпионов и Лиги европы для данной страны
     */
    $scope.country = {
        id: 0,
        name: "",
        maxGames: 0,
        maxCountClubs: 0,
        chL: 0,
        euL: 0,
        clubsToRemove: 0,
        isMistake: false
    };

    /*
    * isActionProcess - true в течение любого процесса (удаление, добавление, редактирование)
    *                   необходимо для того, чтобы при данных процессах кнопка добавления была не видна
    * isNeedToShowForm - true при добавлении и редактировании для того, чтобы видна была форма
    * isDeletingProcess - true идет удаление
    * indexAction - при удалении или редактировании index удаляемого/редактируемого клуба
    * typeAction - тип события (-1 - добавление, 0 - удаление, 1 - редактирование)
    * */
    $scope.clubActions = {};

    $scope.showAddClub = showAddClub;
    $scope.cancelAddRedClub = cancelAddRedClub;
    $scope.redactClub = redactClub;
    $scope.deleteClub = deleteClub;
    $scope.confirmingDeletionClub = confirmingDeletionClub;
    $scope.cancelDeletingClub = cancelDeletingClub;
    $scope.checkIfIsEmpty = checkIfIsEmpty;
    $scope.checkMaxClubsCount = checkMaxClubsCount;

    /*
    * Дополнительные настройки - модальное окно для подтверждения удаления данных о команде
    * */
    $scope.confirmingDeleteWindow = {
        isShown: false,
        close: closeDeleteWindow,
        show: showDeleteWindow,
    };

    /*
    * модальное окно, указывающее на то, что нельзя добавлять более максимально возможного количества клубов для данного чемпионата
    * */
    $scope.okMaxClubMessage = {
        isShown: false,
        show: showMaxClubMessage,
        close: closeMaxClubMessage,
    };

    init();

    //из URL получаем текущую страну и для нее получаем список клубов и базовую информацию о стране
    function init() {
        setBaseActions();
        var country = $routeParams["country"] ? fromUrlToStringFilter($routeParams["country"]) : "england";
        $scope.country.name = country;
        getAllClubs(country);
        getCurrentCountryInfo(country);
    }

    function setBaseActions() {
        $scope.clubActions.isNeedToShowForm = false;
        $scope.clubActions.isActionProcess = false;
        $scope.clubActions.isDeletingProcess = false;
        $scope.clubActions.indexAction = -1;
        $scope.clubActions.typeAction = -1;
    }

    //************************* получение начальной информации о клубах указанной страны и самой стране ***************

    function getAllClubs(country) {
        var promise = teamService.getAll(country);
        promise.then(getAllClubsSuccess, getAllClubsError);
    }

    function getAllClubsSuccess(data) {
        $scope.clubs.showLoading = false;
        if(!data.values.length) {
            $scope.clubs.isEmpty = true;
        }
        else {
            $scope.clubs.values = data.values;
            $scope.clubs.isResult = true;
        }
    }

    function getAllClubsError(data, status) {
        $scope.clubs.showLoading = false;
        $scope.clubs.isMistake = true;
        $scope.clubs.mistakeMessage = data.mistake;
        console.log(data.status, data.mistake);
    }

    function getCurrentCountryInfo(country) {
        var promise = countryService.getOneBaseInfo(country);
        promise.then(getCurrentCountryInfoSuccess, getCurrentCountryInfoError);
    }

    function getCurrentCountryInfoSuccess(data) {
        $scope.country.maxGames = +data.value.maxGames;
        $scope.country.chL = +data.value.chL;
        $scope.country.euL = +data.value.euL;
        $scope.country.id = +data.value.id;
        $scope.country.clubsToRemove = +data.value.clubsToRemove;
        $scope.country.maxCountClubs = +data.value.maxCountClubs;
    }

    function getCurrentCountryInfoError(data, status) {
        $scope.country.isMistake = true;
        console.log(data.status, data.mistake);
    }

    //****************************************************************************************************************
    //***************************** добавление и редактирование клуба ************************************************
    /*
    * $scope.$broadcast("beginClubAction") - вызываем данное событие для того, чтобы в ходе выполнения одного из действий
    *       (добавление, удаление, редактирование) нельзя было одновременно выполнять другие действия
    *       (для этого используется директива actionsClubView - присваивает кнопкам на время выполнения одного из действий атрибут disabled)
    *       (данное событие будет перехвачено директива actionsClubView потому, что она расположена внутри данного контроллера)
    *       (директива actionsClubView присвоена в виде атрибута таблице с клубами)
    * $scope.$broadcast("endClubAction") - делает дейсвия снова доступными
    * */
    function showAddClub() {
        if(checkMaxClubsCount()) {
            $scope.okMaxClubMessage.show();
        }
        else {
            $scope.clubActions.isActionProcess = true;
            $scope.clubActions.isNeedToShowForm = true;
        }
    }

    /*
     * $scope.$broadcast("beginClubAction", index, 1); - в данном случае третий параметр необходим для редактирования или удаления
     *   при редактировании - 1, при удалении - 0
     * */
    function redactClub(club, index) {
        $scope.clubActions.isActionProcess = true;
        $scope.clubActions.isNeedToShowForm = true;
        $scope.clubActions.indexAction = index;
        $scope.clubActions.typeAction = 1;
        $scope.$broadcast("redactClub", club);
    }

    function cancelAddRedClub() {
        setBaseActions();
    }

    //****************************************************************************************************************
    //******************************** удаление клуба ****************************************************************

    function confirmingDeletionClub(club, index) {
        clubToDelete = club;
        $scope.clubActions.isActionProcess = true;
        $scope.clubActions.indexAction = index;
        $scope.clubActions.typeAction = 0;
        $scope.confirmingDeleteWindow.show();
    }

    function deleteClub() {
        $scope.clubActions.isDeletingProcess = true;
        var promise = teamService.delete(clubToDelete.id);
        promise.then(deleteClubSuccess, deleteClubError);
    }

    function cancelDeletingClub() {
        clubToDelete = {};
        setBaseActions();
        $scope.confirmingDeleteWindow.close();
    }

    function deleteClubSuccess(data) {
        arrayHelperService.deleteOneByProperty($scope.clubs.values, "id", clubToDelete.id);
        if(!$scope.clubs.values) {
            $scope.clubs.isEmpty = true;
            $scope.clubs.isResult = false;
        }
        cancelDeletingClub();
        $timeout(function() {
            //поскольку "updateTableView" - это не настоящее событие, мы должны обернуть его в timeout
            //для того, чтобы поставить его в очередь событий
            $scope.$broadcast("updateTableView");
        }, 0);
    }

    function deleteClubError(data, status) {
        cancelDeletingClub();
        console.log(status, data.mistake);
    }

    /* проверка на то, есть ли на данный момент результат */
    function checkIfIsEmpty() {
        if($scope.clubs.isEmpty) {
            $scope.clubs.isEmpty = false;
            $scope.clubs.isResult = true;
        }
    }

    /* проверка на максимально возможное количество клубов */
    function checkMaxClubsCount() {
        return $scope.clubs.values.length === $scope.country.maxCountClubs;
    }

    /* для модальных окон */
    function closeDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = false;
    }

    function showDeleteWindow() {
        $scope.confirmingDeleteWindow.isShown = true;
    }

    function closeMaxClubMessage() {
        $scope.okMaxClubMessage.isShown = false;
    }

    function showMaxClubMessage() {
        $scope.okMaxClubMessage.isShown = true;
    }

}