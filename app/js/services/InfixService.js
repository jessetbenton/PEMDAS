// public/js/services/InfixService.js
angular.module('InfixService', []).factory('infix', ['Stack', function(Stack) {

  return {
    // convert infix expression to postfix expression
    toPostfix : function(infixExpr) {
      var s = new Stack();
      var ops = "-+/*^";
      var precedence = {"-u": 5, "^":4, "*":3, "/":3, "+":2, "-":2};
      var associativity = {"-u": "Right", "^":"Right", "*":"Left", "/":"Left", "+":"Left", "-":"Left"};
      var validTokensRegex = /([0-9]*\.?[0-9]+|\+|-|\/|\*|\^|\(|\))/;
      var numberRegex = /[0-9]*\.?[0-9]+/;
      var tokenizedInfix = infixExpr.split(validTokensRegex);
      var prevToken, token, nextToken;
      var postfix = [];
      var o1, o2;

      var count = 0;
      while( count < tokenizedInfix.length) {
        if(tokenizedInfix[count] === "") {
          tokenizedInfix.splice(count, 1);
        } else {
          count++;
        }
      }

      for (var i = 0; i < tokenizedInfix.length; i++) {
        prevToken = i > 0 ? tokenizedInfix[i-1] : undefined;
        nextToken = i < tokenizedInfix.length ? tokenizedInfix[i+1] : undefined;
        token = tokenizedInfix[i];
        if(!!numberRegex.exec(token) && numberRegex.exec(token)[0] !== "") {
          if(s.peek() === "-u") {
            s.pop();
            postfix.push("" + token * -1);
          } else if(nextToken === "(") {
            throw "Implicit multiplication";
          } else {
            postfix.push(token);
          }
        } else if (ops.indexOf(token) != -1) { // if token is an operator
          o1 = token;
          o2 = s.peek();

          //determine if unary operator
          if(o1 === '-') {
            if(
                i === 0 || // occurs at beginning of input
                !!prevToken && ops.indexOf(prevToken) != -1 || // immediately follows operator
                prevToken === "(" ) { // immediately follows left paren
              o1 = "-u";
            }
          }
          while (ops.indexOf(o2)!=-1 && ( // while operator token, o2, on top of the stack
              // and o1 is left-associative and its precedence is less than or equal to that of o2
              (associativity[o1] == "Left" && (precedence[o1] <= precedence[o2]) ) || 
              // the algorithm on wikipedia says: or o1 precedence < o2 precedence, but I think it should be
              // or o1 is right-associative and its precedence is less than that of o2
              (associativity[o1] == "Right" && (precedence[o1] < precedence[o2]))
              )){
            postfix.push(o2); // add o2 to output queue
            if(o1 != "-u") {
              s.pop(); // pop o2 of the stack(only if not unary minus)
            }
            o2 = s.peek(); // next round
          }
          s.push(o1); // push o1 onto the stack
        } else if (token == "(") { // if token is left parenthesis
          s.push(token); // then push it onto the stack
        } else if (token == ")") { // if token is right parenthesis 
          if(nextToken > "0" && nextToken < "9" || nextToken === "(") {
            throw "Implicit multiplication";
          }
          while (s.peek() != "("){ // until token at top is (
            postfix.push(s.pop());
          }
          s.pop(); // pop (, but not onto the output queue
        } else {
          throw "Invalid token: '" + token + "'";
        }
      }
      while (s.length()>0){
        if(s.peek() === "(") {
          throw "Mismatch parenthesis";
        }
        postfix.push(s.pop());
      }
      return postfix;
    }
  }
}]);