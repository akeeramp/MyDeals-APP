(function () {
    'use strict';

    angular
        .module('app.admin')
        .directive('pctQueryBuilder', pctQueryBuilder);

    pctQueryBuilder.$inject = ['$compile'];

    function pctQueryBuilder($compile) {
        return {
            restrict: 'E',
            scope: {
                group: '=',
                leftValues: '=',
                rightValue: '='
            },
            templateUrl: '/app/admin/iCostProducts/directive/pct.queryBuilder.directive.html',
            compile: function (element, attrs) {
                var content, directive;
                content = element.contents().remove();
                return function (scope, element, attrs) {
                    // These operators will never change keep them here hardcoded
                    scope.operators = [
                        { name: 'AND' },
                        { name: 'OR' }
                    ];

                    // TODO: move this to a constant
                    scope.conditions = [
                        { name: '=' },
                        { name: '<>' },
                        { name: 'LIKE' }
                    ];

                    scope.addCondition = function () {
                        scope.group.rules.push({
                            condition: '=',
                            criteria: '',
                            data: ''
                        });
                    };

                    scope.removeCondition = function (index) {
                        scope.group.rules.splice(index, 1);
                    };

                    scope.addGroup = function () {
                        scope.group.rules.push({
                            group: {
                                operator: 'AND',
                                rules: []
                            }
                        });
                    };

                    scope.removeGroup = function () {
                        "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                    };

                    scope.$watch('rule.criteria',
                        function (newValue, oldValue, el) {
                            if (oldValue === newValue) return;
                            rule.data = '';
                        }, true
                    );

                    scope.resetRightValues = function (rule) {
                        rule.data = '';
                    }

                    directive || (directive = $compile(content));

                    element.append(directive(scope, function ($compile) {
                        return $compile;
                    }));
                }
            }
        }
    }
})();