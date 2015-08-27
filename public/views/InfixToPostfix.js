//INFIX TO POSTFIX

function Stack() {
  this.dataStore = [];
  this.top = 0;
  this.push = push;
  this.pop = pop;
  this.peek = peek;
  this.length = length;
}

function Expression(infix) {
  this.infix = infix.replace(/\s+/g, ''); // remove spaces, so infix[i]!=" ";
  this.postfix = [];
  this.steps = [];
  this.convertToPostfix = toPostfix;
  this.evaluatePostfix = solvePostfix;
  this.solve = convertAndSolve;
  this.solve();
}

function push(element) {
  this.dataStore[this.top++] = element;
}
 
function pop() {
  return this.dataStore[--this.top];
}
 
function peek() {
  return this.dataStore[this.top-1];
}
 
function length() {
  return this.top;
}

String.prototype.isNumeric = function() {
  return !isNaN(parseFloat(this)) && isFinite(this);
}

function sanitizeExpression(expr) {
  return ("" + expr).replace(/(\+|\*|\\|\^|\(|\)|\/)/g, "\\$1");
}

function matchedExpression(subExpr, expr) {
  var sanitizedExpr = sanitizeExpression(subExpr);
  var regex = new RegExp("(\\(" + sanitizedExpr + "\\)|" + sanitizedExpr + ")");
  var match = expr.match(regex);
  return match[0];
}

//postfix is an array
function solvePostfix() {
  var resultStack = new Stack();
  var currentState = this.infix;
  var uninterpretedStack = new Stack();
  for(var i = 0; i < this.postfix.length; i++) {
    if(this.postfix[i].isNumeric()) {
        resultStack.push(this.postfix[i]);
    } else {
      var a = resultStack.pop();
      var b = resultStack.pop();
      var lhs, rhs, op;
      lhs = b;
      rhs = a;
      op = this.postfix[i];

      var sanitizedExpr = sanitizeExpression(lhs + op + rhs);
      var regex = new RegExp("(\\(" + sanitizedExpr + "\\)|" + sanitizedExpr + ")");
      var match = currentState.match(regex, resultStack.peek());

      var steps = {
        lhs: lhs,
        rhs: rhs,
        op: op,
        regex: regex,
      };

      if(match) {
        resultStack.push(match[0]);
        steps['lhs_regex'] = new RegExp(sanitizeExpression(matchedExpression(lhs, match[0])));
        steps['rhs_regex'] = new RegExp(sanitizeExpression(matchedExpression(rhs, match[0])));
      }

      this.steps.push(steps);
    }
  }
}

function toPostfix() {
  var s = new Stack();
  var ops = "-+/*^";
  var precedence = {"-u": 5, "^":4, "*":3, "/":3, "+":2, "-":2};
  var associativity = {"-u": "Right", "^":"Right", "*":"Left", "/":"Left", "+":"Left", "-":"Left"};
  var prevToken, token, nextToken;
  var postfix = [];
  var o1, o2;

   
  for (var i = 0; i < this.infix.length; i++) {
    prevToken = i > 0 ? this.infix[i-1] : undefined;
    nextToken = i < this.infix.length ? this.infix[i+1] : undefined;
    token = this.infix[i];
    if (token > "0" && token < "9") { // if token is operand (here limited to 0 <= x <= 9)
      if(s.peek() === "-u") {
        s.pop();
        postfix.push("" + token * -1);
      } else if(nextToken === "(") {
        throw "Implicit multiplication";
      } else {
        postfix.push(token);
      }
    }
    else if (ops.indexOf(token) != -1) { // if token is an operator
      console.log("operator", token);
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
  this.postfix = postfix;
}

function convertAndSolve() {
  try {
    this.convertToPostfix();
    this.evaluatePostfix();
  } catch(e) {
    console.log("Error: " + e);
  }
}