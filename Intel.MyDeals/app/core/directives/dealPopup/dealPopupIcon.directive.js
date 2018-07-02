angular
    .module('app.core')
    .directive('dealPopupIcon', dealPopupIcon);

dealPopupIcon.$inject = ['quickDealConstants'];

function dealPopupIcon(quickDealConstants) {
    kendo.culture("en-US");
    return {
        scope: {
            dealId: '='
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/dealPopup/dealPopupIcon.directive.html',
        controller: ['$scope', function($scope) {

            $scope.iconEnabled = quickDealConstants.enabled;

            $scope.menuClick = function ($event) {
                var e = window.event;
                e.stopPropagation(); //so that it doesn't trigger click event on document

                var x = $event.clientX + 12;
                var y = $event.clientY + 2;
                $scope.$root.$broadcast('QuickDealToggleDeal', $scope.dealId, y, x);
            }
        }],
        link: function (scope, element, attrs) {
        }
    };
}