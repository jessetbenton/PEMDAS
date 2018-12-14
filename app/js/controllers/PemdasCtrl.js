// public/js/controllers/PemdasCtrl.js
angular.module('PemdasCtrl', [])
.controller('PemdasController', function($scope, $routeParams, util, Stack) {
  //configure mathjs for big number
  math.config({number: 'fraction'});
  math.typed.conversions.unshift({
    from: 'Fraction',
    to: 'BigNumber',
    convert: function (value) {
      return new math.type.BigNumber(value);
    }
  });

  $scope.tagline = 'Please Excuse My Dear Aunt Sally';
  $scope.expression = {
    infix: $routeParams.eq ? treatQueryString($routeParams.eq) : '',
    display: undefined,
    steps: new Stack(),
    solve: solve,
    highlightStep: highlightStep,
    parseNode: parseNode,
    treatQueryString: treatQueryString
  };

  function treatQueryString(qs) {
    var mathExpr = math.parse(decodeURIComponent(qs).replace(/\s/g, "+"));
    $scope.expression.infix = mathExpr.toString();
  }

  //solve requests with query strings
  if($scope.expression.infix !== '') {
    treatQueryString($routeParams.eq);
    $scope.expression.solve();
  }

  function parseNode(node, intermediateStep) {
    var expr = '';
    var rawExpr = '';
    var solution = '';
    switch (node.type) {
      case 'ConstantNode':
        return node.value;
      case 'ParenthesisNode':
        rawExpr = '(' + node.content + ')';
        expr = '(' + this.parseNode(node.content, true) + ')';
        break;
      case 'OperatorNode':
        var lhs,
        rhs = '';
        if(node.args.length > 1) {
          rhs = this.parseNode(node.args[1]);
        }
        lhs = this.parseNode(node.args[0]);
        expr = lhs + node.op + rhs;
        rawExpr = expr;
        break;
      case 'FunctionNode':
        expr = node.name + '(' + this.parseNode(node.args[0]) + ')';
        rawExpr = node.name + '(' + node.args[0] + ')';
        break;
    }
    solution = math.eval(expr);
    if(!intermediateStep) {
      var parsed, temp, re;

      if(this.steps.length() > 0) {
        parsed = this.steps.peek().infix;
      } else {
        parsed = math.parse(this.infix).toString();
      }
      temp = math.parse(rawExpr).toString();

      re = util.getRegex(temp);
      this.steps.push({
        infix: parsed.replace(re, solution),
        expr: parsed,
        solution: solution,
        regex: re
      });
    }
    return solution;
  }

  //need to highlight steps without clicking...
  function highlightStep(step) {
    var expr = step.parsed.match(step.re);
    var segments = step.parsed.split(step.re);
    var location = 0;

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
      highlight: expr[0]
    }
  }

  function solve() {
    this.steps = new Stack();
    var mathExpr = math.parse(this.infix);
    this.infix = mathExpr.toString();
    this.answer = this.parseNode(mathExpr);
  }
})
.directive('highlightExpression', [ function() {
  function link(scope, element, attrs) {
    var re = new RegExp(attrs.regex.substr(1, attrs.regex.length -2));
    var segments = attrs.expr.split(re);
    var display = [];
    var location = 0;

    if(segments[0] !== "" && segments[1] !== "") {
      //current step is in the middle
      display[0] = { value: segments[0] };
      location = 1;
      display[1] = { value: segments[1] };
    } else if(segments[0] === "" && segments[1] !== "") {
      //current step is at the beginning
      location = 0;
      display[1] = { value: segments[1] };
    }
    else if(segments[0] !== "" && segments[1] === "") {
      //current step is at the end
      display[0] = { value: segments[0] };
      location = 1;
    }
    display[location] = {
      highlight: attrs.expr.match(re)[0]
    }

    for(var i = 0; i < display.length; i++) {
      var el = document.createElement('span');
      el.classList.add("step");
      if(display[i].value) {
        el.innerHTML = display[i].value.replace('*', '×');
      } else if(display[i].highlight) {
        el.classList.add("highlight");
        el.innerHTML = display[i].highlight.replace('*', '×');
      }
      element[0].appendChild(el);;
    }
  }

  return {
    link: link
  };
}]);