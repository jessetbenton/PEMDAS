// public/js/app.js
angular.module('pemdasApp', [
  'ngRoute',
  'PemdasCtrl',
  'StackService',
  'InfixService',
  'PostfixService',
  'UtilService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'pemdas.html',
    controller: 'PemdasController'
  })
  .otherwise({redirectTo: '/'});
}]);