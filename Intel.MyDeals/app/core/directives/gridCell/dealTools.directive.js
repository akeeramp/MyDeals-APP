angular
    .module('app.core')
    .directive('dealTools', dealTools);

dealTools.$inject = [];

function dealTools() {
    return {
        scope: {
            dataItem: '=ngModel'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealTools.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.stgOneChar = function () {
                return $scope.dataItem.WF_STG_CD === undefined ? "&nbsp;" : $scope.dataItem.WF_STG_CD[0];
            }

            $scope.notesActions = [
                {
                    text: 'OK',
                    action: function () {
                        $scope.$apply(function () {
                            var dataItem = $scope.dataItem;
                            if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
                            dataItem._behaviors.isDirty['NOTES'] = true;
                            dataItem._dirty = true;
                        });
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
