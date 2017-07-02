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

            $scope.dialogShow = function() {

            }
            
        }],
        link: function (scope, element, attr) {
        }
    };
}
