// public/js/controllers/PemdasCtrl.js
angular.module('PemdasCtrl', []).controller('PemdasController', function($scope, infix, postfix) {

  $scope.tagline = 'Please Excuse My Dear Aunt Sally';

  $scope.expression = {
    infix: '6/2*(1+2)',
    display: undefined,
    postfix: [],
    steps: [],
    solve: convertAndSolve,
    regMatch: matchRegex,
    highlightStep: highlightStep,
    resetDisplay: resetDisplay
  };

  function resetDisplay() {
    this.display.lhs = '';
    this.display.op = '';
    this.display.rhs = '';
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
    this.display = {};
    this.display.part = [];
    this.display.part[0] = {};
    this.display.part[1] = {};
    this.display.part[2] = {};
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
    } catch(e) {
      return "Error: " + e;
    }
  }
});