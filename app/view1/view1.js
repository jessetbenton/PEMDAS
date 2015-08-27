'use strict';

angular.module('pemdasApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/view1', {
    templateUrl: 'view3/pemdas.html',
    controller: 'PemdasController'
  })
}])

.controller('View1Ctrl', [function() {

}]);