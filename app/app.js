'use strict';

// Declare app level module which depends on views, and components
angular.module('pemdasApp', [
  'ngRoute',
  'PemdasCtrl',
  'StackService',
  'InfixService',
  'PostfixService',
  'UtilService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'views/pemdas.html',
    controller: 'PemdasController'
  }).
  otherwise({redirectTo: '/'});
}]);
