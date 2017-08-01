angular
    .module('app.core')
    .directive('dealTools', dealTools);

dealTools.$inject = [];

function dealTools() {
    return {
        scope: {
            dataItem: '=ngModel',
            isEditable: '@isEditable'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealTools.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            if (!!$scope.isEditable) $scope.isEditable = false;

            $scope.stgOneChar = function () {
                return $scope.dataItem.WF_STG_CD === undefined ? "&nbsp;" : $scope.dataItem.WF_STG_CD[0];
            }

            $scope.notesActions = [
                {
                    text: 'OK',
                    action: function () {
                        if ($scope.dataItem._dirty) $scope.$parent.$parent.saveCell($scope.dataItem, "NOTES");
                    }
                }
            ];

            $scope.groupActions = [
                {
                    text: 'Cancel',
                    action: function () {}
                },
                {
                    text: 'Yes, Split',
                    primary: true,
                    action: function () {}
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
                        $scope.$parent.$parent.deletePricingTableRow($scope.dataItem);
                    }
                }
            ];

            $scope.holdActions = [
                {
                    text: 'Cancel',
                    action: function() {}
                },
                {
                    text: 'Yes, Hold',
                    primary: true,
                    action: function () {
                        $scope.$parent.$parent.holdPricingTableRow($scope.dataItem);
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
