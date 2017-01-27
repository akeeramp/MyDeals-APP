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
                operators: '=',
                conditions: '=',
                lefttypes: '=',
                leftvalues: '=',
                righttypes: '=',
                rightvalues: '=',
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

                    scope.lefttypes = [
                        { name: 'Attribute', editor: 'dropdown' },
                        { name: 'Product', editor: 'textbox' },
                        { name: 'Defined', editor: 'dropdown' },
                        { name: 'User Defined', editor: 'textbox' }
                    ];

                    scope.leftvalues = [
                        { name: 'Brand' },
                        { name: 'Family' },
                        { name: 'EPMProductFamily' },
                        { name: 'BrandGroup' },
                        { name: 'TradeMark' },
                        { name: 'Deal Type' },
                        { name: 'Start Date' },
                        { name: 'End Date' },
                        { name: 'Stage' },
                        { name: 'Level4' }
                    ];

                    scope.righttypes = [
                        { name: 'Attribute', editor: 'dropdown' },
                        { name: 'Product', editor: 'textbox' },
                        { name: 'Defined', editor: 'dropdown' },
                        { name: 'User Defined', editor: 'textbox' }
                    ];

                    scope.rightvalues = [
                        { name: 'ECAP' },
                        { name: 'PROGRAM' },
                        { name: 'VOLTIER' },
                        { name: 'True' },
                        { name: 'False' },
                        { name: 'Submitted' },
                        { name: 'Active' },
                        { name: 'Hold Waiting' },
                        { name: 'Previous QTR Start Date' }
                    ];

                    scope.conditions = [
                        { name: '=' },
                        { name: '<>' },
                        { name: '<' },
                        { name: '<=' },
                        { name: '>' },
                        { name: '>=' },
                        { name: 'LIKE' }
                    ];

                    scope.addCondition = function () {
                        scope.group.rules.push({
                            condition: '=',
                            leftvalue: '',
                            rightvalue: '',
                            lefttype: '',
                            righttype: '',
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

                    scope.getEditorType = function (selectedType, side) {
                        var types
                        if (side == 'left') {
                            types = scope.lefttypes;
                        } else {
                            types = scope.righttypes;
                        }

                        if (typeof selectedType == "undefined" || selectedType == "") {
                            return "disabled";
                        } else {
                            for (var i = 0; i <= types.length; i++) {
                                if (types[i].name == selectedType) {
                                    return types[i].editor;
                                }
                            }
                        }
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