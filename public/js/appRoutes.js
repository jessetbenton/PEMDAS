// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

    // home page
    .when('/', {
        templateUrl: 'views/pemdas.html',
        controller: 'PemdasController'
    })

    $locationProvider.html5Mode(true);

}]);