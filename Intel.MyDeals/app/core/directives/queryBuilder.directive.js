(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('queryBuilder', queryBuilder);

    queryBuilder.$inject = ['$compile'];

    function queryBuilder($compile) {
        return {
            restrict: 'E',
            scope: {
                group: '=',
            },
            templateUrl: '/app/core/directives/queryBuilder.directive.html',
            compile: function (element, attrs) {
                var content, directive;
                content = element.contents().remove();
                return function (scope, element, attrs) {
                    scope.operators = [
                        { name: 'AND' },
                        { name: 'OR' }
                    ];

                    scope.criterias = [
                        { name: 'Brand' },
                        { name: 'Family' },
                        { name: 'EPMProductFamily' },
                        { name: 'BrandGroup' },
                        { name: 'TardeMark' },
                        { name: 'Level4' }
                    ];

                    scope.conditions = [
                        { name: '=' },
                        { name: '<>' },
                        { name: '<' },
                        { name: '<=' },
                        { name: '>' },
                        { name: '>=' }
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

                    directive || (directive = $compile(content));

                    element.append(directive(scope, function ($compile) {
                        return $compile;
                    }));
                }
            }
        }
    }
})();