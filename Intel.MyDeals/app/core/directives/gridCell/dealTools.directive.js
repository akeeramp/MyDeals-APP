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
            
            $scope.clkAllItems = function(e) {
                debugger;
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}
