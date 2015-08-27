'use strict';

// Declare app level module which depends on views, and components
angular.module('pemdasApp', [
  'ngRoute',
  'pemdasApp.view1',
  'pemdasApp.view2',
  'pemdasApp.version',
  'PemdasCtrl',
  'StackService',
  'InfixService',
  'PostfixService',
  'UtilService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
