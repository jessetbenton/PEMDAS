// public/js/services/UtilService.js
angular.module('UtilService', []).factory('util', [function() {
  return {
    sanitizeExpression: function(expr) {
      console.log("sanitizeExpression", expr);
      return ("" + expr).replace(/(\+|\*|\\|\^|\(|\)|\/)/g, "\\$1");
    },
    getRegex: function(expr) {
      return new RegExp(("" + expr).replace(/(\+|\*|\\|\^|\(|\)|\/)/g, "\\$1"));
    },
    matchedExpression: function(subExpr, expr) {
      var sanitizedExpr = this.sanitizeExpression(subExpr);
      var regex = new RegExp("(\\(" + sanitizedExpr + "\\)|" + sanitizedExpr + ")");
      var match = expr.match(regex);
      return match[0];
    },
    isNumeric: function(factor) {
      return !isNaN(parseFloat(factor)) && isFinite(factor);
    }
  }
}]);