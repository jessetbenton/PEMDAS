// public/js/app.js
angular.module('pemdasApp', [
  'ngRoute',
  'appRoutes',
  'PemdasCtrl',
  'StackService',
  'InfixService',
  'PostfixService',
  'UtilService'
]);