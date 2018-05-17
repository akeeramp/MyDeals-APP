angular
    .module('app.core')
    .directive('ping', ping);

ping.$inject = ['$timeout'];

function ping($timeout) {
    kendo.culture("en-US");

    return {
        scope: {},
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/ping/ping.directive.html',
        controller: ['$scope', 'dataService', function ($scope, dataService) {
            $scope.pingCycle = 15000;
            $scope.pingValues = [];
            $scope.pingTime = null;

            $scope.getClassName = function () {
                if ($scope.pingTime === undefined || $scope.pingTime === null) {
                    return "none";
                } else if ($scope.pingTime > 200) {
                    return "low";
                } else if ($scope.pingTime > 100) {
                    return "low";
                }
                return "high";
            }

            $scope.pingHost = function() {
                $scope.ping = new Date;
                $.ajax({
                    url: "/Ping",
                    cache: false,
                    success: function (output) {
                        $scope.pingTime = new Date - $scope.ping;
                        $scope.pingValues.push($scope.pingTime);
                        if ($scope.pingValues.length > 10) $scope.pingValues.shift();
                        $timeout(function () {
                            $scope.pingHost();
                        }, $scope.pingCycle);
                    }
                });
            }

            $scope.pingHost();
        }],
        link: function (scope, element, attrs) {
        }
    };
}