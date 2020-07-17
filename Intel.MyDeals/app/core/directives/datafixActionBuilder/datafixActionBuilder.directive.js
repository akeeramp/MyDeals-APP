angular
    .module('app.core')
    .directive('datafixActionBuilder', datafixActionBuilder);

datafixActionBuilder.$inject = ['$compile', '$timeout', '$filter', '$localStorage', '$window', 'logger', '$linq'];

function datafixActionBuilder($compile, $timeout, $filter, $localStorage, $window, logger, $linq) {    
    return {
        scope: {
            selectedDatafixActions: '=',
            opdataElements: '=',
            actions: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/datafixActionBuilder/datafixActionBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.root = $scope.$parent;
            $scope.ActionDataRows = $scope.selectedDatafixActions === undefined ? [] : $scope.selectedDatafixActions;

            $scope.OpDataElementDataSource = new kendo.data.DataSource({
                data: $scope.opdataElements
            });

            $scope.ActionsSource = new kendo.data.DataSource({
                data: $scope.actions,
                sort: { field: "title", dir: "asc" }
            });

            if ($scope.ActionDataRows.length === 0) {
                $scope.ActionDataRows = [{
                    DataElement: "",
                    Action: "",
                    TargetObjectIds: ""
                }];
            }            

            $scope.addRow = function (dataItem) {
                var index = $scope.ActionDataRows.indexOf(dataItem);
                if (index > -1) {
                    $scope.ActionDataRows.splice(index + 1, 0, {
                        DataElement: "",
                        Action: "",
                        TargetObjectIds: ""
                    });
                    setTimeout(function () {
                        if ($(".filterRow")[index + 1] !== undefined)
                            $(".filterRow")[index + 1].scrollIntoView();
                    }, 0);
                }
            }

            $scope.removeRow = function (dataItem) {
                if ($scope.ActionDataRows.length === 1) {
                    $scope.ActionDataRows = [{
                        DataElement: "",
                        Action: "",
                        TargetObjectIds: ""
                    }];
                    return;
                }
                var index = $scope.ActionDataRows.indexOf(dataItem);
                if (index > -1) {
                    $scope.ActionDataRows.splice(index, 1);
                }
            }

            $scope.$on('save-datafix-action', function (event) {
                $scope.selectedDatafixActions = $scope.ActionDataRows;
            });            
        }],
        link: function (scope, element, attr) {
        }
    };
}

