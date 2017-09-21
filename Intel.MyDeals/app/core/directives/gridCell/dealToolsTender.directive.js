angular
    .module('app.core')
    .directive('dealToolsTender', dealToolsTender);

dealToolsTender.$inject = [];

function dealToolsTender() {
    return {
        scope: {
            dataItem: '=ngModel',
            isEditable: '@isEditable'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealToolsTender.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            if ($scope.isEditable === "false" || $scope.isEditable === false) {
                $scope.editable = (1 === 2);
            }
            else {
                $scope.editable = (1 === 1);;
            }

            if (!!$scope.isEditable) $scope.isEditable = false;

            var opGridScope = $scope.$parent;
            var rootScope = opGridScope;
            if (!rootScope.saveCell) {
                rootScope = $scope.$parent.$parent.$parent;
            }

            $scope.stgOneChar = function () {
                return $scope.dataItem.WF_STG_CD === undefined ? "&nbsp;" : $scope.dataItem.WF_STG_CD[0];
            }

            $scope.addDeal = function (dataItem, $event) {
                var row = angular.element($event.currentTarget).closest("tr");
                var newData = rootScope.addDeal(dataItem);

                // row not expanded and need to get datasource
                if (row.find("td .k-i-expand").length > 0) {
                    rootScope.$parent.newDataItemToAddOnExpand = newData;
                    opGridScope.grid.expandRow(row);

                } else {
                    var detailOpGridScope = row.siblings('.k-detail-row').find('.k-grid').scope();
                    if (newData !== null) opGridScope.addRow(detailOpGridScope, newData);
                }
            }

            $scope.copyDeal = function (dataItem) {
                var newData = rootScope.copyDeal(dataItem);
                opGridScope.addRow(opGridScope, newData);
            }

            $scope.notesActions = [
                {
                    text: 'OK',
                    action: function () {
                        if ($scope.dataItem._dirty) {
                            $scope._dirty = true;
                            rootScope.saveCell($scope.dataItem, "NOTES");
                        }
                    }
                }
            ];

            $scope.deleteActions = [
                {
                    text: 'Cancel',
                    action: function() {}
                },
                {
                    text: 'Yes, Delete',
                    primary: true,
                    action: function () {
                        rootScope.deletePricingTableRow($scope.dataItem);
                    }
                }
            ];

            $scope.dialogShow = function() {

            }
            
        }],
        link: function (scope, element, attr) {
        }
    };
}
