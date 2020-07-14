angular
    .module('app.core')
    .directive('datafixActionBuilder', datafixActionBuilder);

datafixActionBuilder.$inject = ['$compile', '$timeout', '$filter', '$localStorage', '$window', 'logger', '$linq', 'dropdownsService'];

function datafixActionBuilder($compile, $timeout, $filter, $localStorage, $window, logger, $linq, dropdownsService) {
    var vm = this;
    vm.OpDataElements = null;
    vm.Actions = [{ Text: "Action 1", Value: "A1" }, { Text: "Action 2", Value: "A2" }, { Text: "Action 3", Value: "A3" }];

    dropdownsService.getOpDataElements().then(function (response) {
        vm.OpDataElements = response.data;
    }, function (response) {
        logger.error("Unable to get op data elements.", response, response.statusText);
    });    

    return {
        scope: {
            selectedDatafixActions: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/datafixActionBuilder/datafixActionBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.root = $scope.$parent;
            $scope.ActionDataRows = $scope.selectedDatafixActions === undefined ? [] : $scope.selectedDatafixActions;
                        
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

            $scope.OpDataElementDataSource = new kendo.data.DataSource({
                data: vm.OpDataElements
            });            

            $scope.ActionsSource = new kendo.data.DataSource({
                data: vm.Actions
            });
        }],
        link: function (scope, element, attr) {
        }
    };
}

