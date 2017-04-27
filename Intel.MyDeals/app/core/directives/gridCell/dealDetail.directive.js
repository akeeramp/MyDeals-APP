angular
    .module('app.core')
    .directive('dealDetail', dealDetail);

dealDetail.$inject = ['colorDictionary'];

function dealDetail(colorDictionary) {
    return {
        scope: {
            dataItem: '=ngModel'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/dealDetail.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.stStr = moment($scope.dataItem.START_DT).format('DD/MM/YYYY');
            $scope.enStr = moment($scope.dataItem.END_DT).format('DD/MM/YYYY');

            $scope.colorStyle = function () {
                return { "background-color": colorDictionary["type"][$scope.dataItem.OBJ_SET_TYPE_CD] };
            }
            $scope.stgStyle = function () {
                return { "background-color": colorDictionary["type"][$scope.dataItem.WF_STG_CD] };
            }
            
        }],
        link: function (scope, element, attr) {
        }
    };
}
