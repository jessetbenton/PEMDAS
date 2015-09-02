// public/js/controllers/PemdasCtrl.js
angular.module('PemdasCtrl', [])
.controller('PemdasController', function($scope, infix, postfix, $routeParams) {
  $scope.tagline = 'Please Excuse My Dear Aunt Sally';
  console.dir($routeParams);
  console.dir($routeParams.eq);
  console.dir($routeParams['eq']);
  var steps = [];
  var answers = [];
  $scope.expression = {
    infix: $routeParams.eq ? treatQueryString($routeParams.eq) : '',
    display: undefined,
    postfix: [],
    steps: [],
    convert: convertAndSolve,
    regMatch: matchRegex,
    highlightStep: highlightStep,
    resetDisplay: resetDisplay,
    showArrow: showArrow
  };

  function treatQueryString(qs) {
    console.log("treating query string", qs)
    $scope.expression.infix = decodeURIComponent(qs).replace(/\s/g, "+");
    console.dir(parseNode(math.parse($scope.expression.infix)));
  }

  //solve requests with query strings
  // if($scope.expression.infix !== '') {
    // $scope.expression.convert();
    // console.dir($routeParams)
    // var test0 = $routeParams.eq;
    // console.dir($routeParams['eq']);
    // var test = math.parse($routeParams.eq);
    // console.dir(test);
  // }
  
  function parseNode(node, intermediateStep) {
    var expr = '';
    var solution = '';
    switch (node.type) {
      case 'ConstantNode':
        return node.value;
      case 'ParenthesisNode':
        steps.push('(' + node.content + ')');
        expr = '(' + parseNode(node.content, true) + ')';
        break;
      case 'OperatorNode':
        var lhs,
        rhs = '';
        if(node.args.length > 1) {
          rhs = parseNode(node.args[1]);
        }
        lhs = parseNode(node.args[0]);
        expr = lhs + node.op + rhs;
        steps.push(expr);
        break;
      case 'FunctionNode':
        expr = node.name + '(' + parseNode(node.args[0]) + ')';
        steps.push(node.name + '(' + node.args[0] + ')');
        break;
    }
    solution = math.eval(expr);
    if(intermediateStep) {
      answers.push(solution);
    }
    return solution;
  }

  while(steps.length > 0) {
    var out = steps.shift();
    if(out[0] !== "(") {
      out += " " + answers.shift();
    }
    console.log(out);
  }

  function resetDisplay() {
    this.display = {};
    this.display.part = [];
    this.display.part[0] = {};
    this.display.part[1] = {};
    this.display.part[2] = {};
    this.display.step = undefined;
  }

  function showArrow(step) {
    return this.display && this.display.step === step ? true : false; 
  }

  function matchRegex(pattern) {
    var match = this.infix.match(pattern);
    return match ? match[0] : '';
  }

  function highlightStep(step) {
    var expr = this.regMatch(step.regex);
    var lhs = expr.match(step.lhs_regex)[0];
    var rhs = expr.match(step.rhs_regex)[0];
    var segments = this.infix.split(expr);
    var location = 0;
    this.resetDisplay();

    if(segments[0] !== "" && segments[1] !== "") {
      //current step is in the middle
      this.display.part[0] = { value: segments[0] };
      location = 1;
      this.display.part[1] = { value: segments[1] };
    } else if(segments[0] === "" && segments[1] !== "") {
      //current step is at the beginning
      location = 0;
      this.display.part[1] = { value: segments[1] };
    }
    else if(segments[0] !== "" && segments[1] === "") {
      //current step is at the end
      this.display.part[0] = { value: segments[0] };
      location = 1;
    }
    this.display.step = step;
    this.display.part[location] = {
      lhs: lhs,
      op: step.op,
      rhs: rhs,
      parens: expr[0] === "(" ? true : false
    }
  }

  function convertAndSolve() {
    try {
      var pf = infix.toPostfix($scope.expression.infix);
      $scope.expression.postfix = pf;
      $scope.expression.steps = postfix.solve(pf, $scope.expression.infix);
      $scope.expression.display = undefined;
      // $scope.expression.highlightStep($scope.expression.steps[0]);
    } catch(e) {
      return "Error: " + e;
    }
  }

  function postfixToPemdas() {
    for(var i = 0; i < this.steps.length; i++) {
      var step = this.steps[i];
      var lhs = step.lhs;
      var rhs = step.rhs;
      switch(step.op) {
        case '^':
          step.solution = Math.pow(new Number(lhs), new Number(rhs));
        break;
        case '/':
          step.solution = new Number(lhs) / new Number(rhs);
        break;
        case '*':
          step.solution = new Number(lhs) * new Number(rhs);
        break;
        case '+':
          step.solution = new Number(lhs) + new Number(rhs);
        break;
        case '-':
          step.solution = new Number(lhs) - new Number(rhs);
        break;
      }
    }
  }
});