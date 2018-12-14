angular.module('StackService', []).service('Stack', [function() {
  var Stack = function() {
    this.dataStore = [];
    this.top = 0;
  };

  Stack.prototype.push = function(element) {
    this.dataStore[this.top++] = element;
  }

  Stack.prototype.pop = function() {
    return this.dataStore[--this.top];
  }

  Stack.prototype.peek = function() {
    return this.dataStore[this.top-1];
  }
   
  Stack.prototype.length = function() {
    return this.top;
  }
  
  return Stack;
}]);