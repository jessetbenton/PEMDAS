// public/js/services/PostfixService.js
angular.module('PostfixService', []).factory('postfix', ['Stack', 'util', function(Stack, util) {

  return {
    // convert infix expression to postfix expression
    solve : function(postfixExpr, infixExpr) {
      var stack = new Stack();
      var steps = [];
      for(var i = 0; i < postfixExpr.length; i++) {
        if(util.isNumeric(postfixExpr[i])) {
            stack.push(postfixExpr[i]);
        } else {
          var rhs = stack.pop();
          var lhs = stack.pop();
          var op = postfixExpr[i];
          var result;
        switch(step.op) {
          case '^':
            result = Math.pow(new Number(lhs), new Number(rhs));
          break;
          case '/':
            result = new Number(lhs) / new Number(rhs);
          break;
          case '*':
            result = new Number(lhs) * new Number(rhs);
          break;
          case '+':
            result = new Number(lhs) + new Number(rhs);
          break;
          case '-':
            result = new Number(lhs) - new Number(rhs);
          break;
        }

          var sanitizedExpr = util.sanitizeExpression(lhs + op + rhs);
          var regex = new RegExp("(\\(" + sanitizedExpr + "\\)|" + sanitizedExpr + ")");
          var match = infixExpr.match(regex, stack.peek());

          _step = {
            lhs: lhs,
            rhs: rhs,
            op: op,
            regex: regex,
          };

          if(match) {
            stack.push(match[0]);
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