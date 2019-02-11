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
            $scope.pingCycle = 60000;
            $scope.pingValues = [];
            $scope.pingTime = null;
            $scope.batchInProgress = false;

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
                        $scope.pingValues.push($scope.pingTime);
                        if ($scope.pingValues.length > 10) $scope.pingValues.shift();
                        $timeout(function () {
                            $scope.pingHost();
                        }, $scope.pingCycle);
                    }
                });
            }

            $scope.getBatchStatus = function() {
                $scope.ping = new Date;
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

            $scope.getBatchStatus();
        }],
        link: function (scope, element, attrs) {
        }
    };
}