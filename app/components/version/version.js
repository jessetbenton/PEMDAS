'use strict';

angular.module('pemdasApp.version', [
  'pemdasApp.version.interpolate-filter',
  'pemdasApp.version.version-directive'
])

.value('version', '0.1');
