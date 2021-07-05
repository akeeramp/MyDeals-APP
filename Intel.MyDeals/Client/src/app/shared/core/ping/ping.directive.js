angular
    .module('app')
    .directive('ping', ping);

ping.$inject = ['$timeout'];

function ping($timeout) {
    kendo.culture("en-US");

    return {
        scope: {},
        restrict: 'AE',
        transclude: true,
        teamplate:`<i class="fa fa-signal ping-net" role="button" ng-class="getClassName()" ng-click="pingHost()" title="Network Ping: {{pingTime}} ms" aria-hidden="true"></i>
        <i class="batch-running" ng-if="batchInProgress" title="There is a database batch job currently in progress&#013;This will effect performance a little" style="padding-left: 10px;"><b>BATCH IN PROGRESS</b></i> <!--intelicon-database-solid  Removed and replaced with text-->
        
        <style>
            .ping-net.high {
                color: #FC4C02;
            }
        
            .ping-net.med {
                color: #ffda24;
            }
        
            .ping-net.low {
                color: #76d600;
            }
        
            .ping-net.none {
                color: #cccccc;
            }
        
            .batch-running {
                color: #f3d54e;
                margin-right: 20px;
            }
        </style>`,
        controller: ['$scope', 'dataService', function ($scope, dataService) {

            $scope.pingTime = null;
            $scope.batchInProgress = false;

            var pingCycle = 60000;
            var pingValues = [];

            $scope.getClassName = function () {
                if ($scope.pingTime === undefined || $scope.pingTime === null) {
                    return "none";
                } else if ($scope.pingTime < 150) {
                    return "low";
                } else if ($scope.pingTime < 400) {
                    return "med";
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