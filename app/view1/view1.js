'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  when('/view1', {
    templateUrl: 'view3/pemdas.html',
    controller: 'PemdasController'
  })
}])

.controller('View1Ctrl', [function() {

}]);