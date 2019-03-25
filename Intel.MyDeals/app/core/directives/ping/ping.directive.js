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

            $scope.pingTime = null;
            $scope.batchInProgress = false;

            var pingCycle = 60000;
            var pingValues = [];

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

            $scope.pingHost = function () {
                $scope.ping = new Date;
                $.ajax({
                    url: "/Ping",
                    cache: false,
                    success: function (output) {
                        $scope.pingTime = new Date - $scope.ping;
                        pingValues.push($scope.pingTime);
                        if (pingValues.length > 10) pingValues.shift();
                        $timeout(function () {
                            $scope.pingHost();
                        }, pingCycle);
                    }
                });
            }

            var getBatchStatus = function () {
                $.ajax({
                    url: "/api/AdminConstants/v1/GetConstantsByNameNonCached/BATCH_STATUS",
                    cache: false,
                    success: function (output) {
                        $scope.batchInProgress = false;
                        if (output.CNST_VAL_TXT !== undefined && output.CNST_VAL_TXT.toUpperCase() !== "COMPLETED") {
                            $scope.batchInProgress = true;
                        }
                    }
                });
            }

            $scope.pingHost();

            getBatchStatus();
        }],
        link: function (scope, element, attrs) {
        }
    };
}