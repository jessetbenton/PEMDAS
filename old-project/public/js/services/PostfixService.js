// public/js/services/PostfixService.js
angular.module('PostfixService', []).factory('postfix', ['Stack', 'util', function(Stack, util) {

  return {
    // convert infix expression to postfix expression
    solve : function(postfixExpr, infixExpr) {
      var resultStack = new Stack();
      var currentState = infixExpr;
      var steps = [];
      var uninterpretedStack = new Stack();
      for(var i = 0; i < postfixExpr.length; i++) {
        if(util.isNumeric(postfixExpr[i])) {
            resultStack.push(postfixExpr[i]);
        } else {
          var rhs = resultStack.pop();
          var lhs = resultStack.pop();
          var op = postfixExpr[i];

          var sanitizedExpr = util.sanitizeExpression(lhs + op + rhs);
          var regex = new RegExp("(\\(" + sanitizedExpr + "\\)|" + sanitizedExpr + ")");
          var match = currentState.match(regex, resultStack.peek());

          _step = {
            lhs: lhs,
            rhs: rhs,
            op: op,
            regex: regex,
          };

          if(match) {
            resultStack.push(match[0]);
            
            _step['lhs_regex'] = new RegExp(util.sanitizeExpression(util.matchedExpression(lhs, match[0])));
            _step['rhs_regex'] = new RegExp(util.sanitizeExpression(util.matchedExpression(rhs, match[0])));
          }

          steps.push(_step);
        }
      }
      return steps;
    }
  }
}]);