angular
    .module('app.core')
    .directive('percentBar', percentBar);

percentBar.$inject = ['$compile'];

function percentBar() {
    return {
        scope: {
            perc: '@'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridCell/percentBar.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.onChange = function (el) {
                if ($scope.perc < 25) {
                    this.progressWrapper.css("background-color", "#FC4C02");
                    this.progressWrapper.css("border-color", "#FC4C02");
                } else if ($scope.perc >= 100) {
                    this.progressWrapper.css("background-color", "#C4D600");
                    this.progressWrapper.css("border-color", "#C4D600");
                } else {
                    this.progressWrapper.css("background-color", "#00AEEF");
                    this.progressWrapper.css("border-color", "#00AEEF");
                }
                
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}
