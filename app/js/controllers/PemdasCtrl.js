// public/js/controllers/PemdasCtrl.js
angular.module('PemdasCtrl', [])
.controller('PemdasController', function($scope, infix, postfix, $routeParams) {
  $scope.tagline = 'Please Excuse My Dear Aunt Sally';

  $scope.expression = {
    infix: $routeParams.eq ? $routeParams.eq : '',
    display: undefined,
    postfix: [],
    steps: [],
    solve: convertAndSolve,
    regMatch: matchRegex,
    highlightStep: highlightStep,
    resetDisplay: resetDisplay
  };

  //solve requests with query strings
  if($scope.expression.infix !== '') {
    $scope.expression.solve();
  }

  function resetDisplay() {
    this.display = {};
    this.display.part = [];
    this.display.part[0] = {};
    this.display.part[1] = {};
    this.display.part[2] = {};
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
})
.directive('infixExpressionBreakdown', [function() {

  function link(scope, element, attrs) {
    var format,
        timeoutId;

    function updateTime() {
      element.text(dateFilter(new Date(), format));
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    timeoutId = $interval(function() {
      updateTime(); // update DOM
    }, 1000);
  }

  return {
    link: link
  };
}]);