angular.module("myApp", ["ngRoute", "ngAnimate"])
    .config(["$routeProvider", function($routeProvider) {

        $routeProvider.when("/country/:country/teams", {
            templateUrl: "views/teams.html",
            controller: "TeamsController",
        }).when("/country/:country/top-scorers", {
            templateUrl: "views/top-scorers.html",
            controller: "TopScorersController",
        }).when("/country/:country/teams/:club", {
            templateUrl: "views/team.html",
            controller: "TeamController",
        }).when("/country/:country/teams/:club/players", {
            templateUrl: "views/players.html",
            controller: "PlayersController",
        }).when("/country/:country", {
            templateUrl: "views/country.html",
            controller: "CountryController",
        }).when("/home", {
            templateUrl: "views/home.html",
            controller: "CountriesController",
        }).when("/players/free", {
            templateUrl: "views/players.html",
            controller: "PlayersController",
        }).otherwise({
            redirectTo: "/home",
        });

    }]);