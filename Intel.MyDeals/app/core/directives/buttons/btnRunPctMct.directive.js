angular
    .module('app.core')
    .directive('btnRunPctMct', btnRunPctMct);

btnRunPctMct.$inject = ['logger', 'objsetService', '$timeout', '$state'];

function btnRunPctMct(logger, objsetService, $timeout, $state) {
    return {
        scope: {
            root: '=ngModel',
            btnStyle: '=?btnStyle',
            btnClass: '=?btnClass',
            contractId: '=contractId',
            lastRun: '=?lastRun',
            btnType: '=?btnType',
            enabled: '=?enabled',
            runIfStaleByHours: '=?runIfStaleByHours',
            forceRun: "=?forceRun"
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/buttons/btnRunPctMct.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.iconClass = "";
            $scope.text = "";
            $scope.textMsg = "";
            $scope.needToRunPct = false;
            $scope.runViaButton = false;

            if ($scope.btnType === "mct") {
                $scope.text = "Meet Comp Test";
                $scope.textMsg = "Meet Comp Test";
            } else {
                $scope.text = "Price Cost Test";
                $scope.textMsg = "Price Cost Test";
            }

            if (!$scope.runIfStaleByHours) $scope.runIfStaleByHours = 0;
            if ($scope.forceRun === undefined || $scope.forceRun === null) $scope.forceRun = false;
            if ($scope.enabled === undefined || $scope.enabled === null) $scope.enabled = true;

            $scope.lastRunDisplay = function () {
                if ($(".iconRunPct").hasClass("fa-spin grn")) {
                    return "Running " + $scope.text;
                }

                if ($scope.enabled === false) {
                    return $scope.text + " is saved";
                }

                if (!!$scope.lastRun) {

                    // Get local time in UTC
                    var localTime = gridUtils.convertLocalToPST(new Date());

                    // Get server time from a PST time string... manually convert it to UTC
                    var lastruntime = moment($scope.lastRun);

                    var serverPstTime = lastruntime.format("MM/DD/YY HH:mm:ss");
                    //var serverPstTime = moment($scope.lastRun).add(moment.duration("08:00:00")).format('YYYY-MM-DD HH:mm:ss');

                    var timeDiff = moment.duration(moment(serverPstTime).diff(moment(localTime)));
                    var hh = Math.abs(timeDiff.asHours());
                    var mm = Math.abs(timeDiff.asMinutes());
                    var ss = Math.abs(timeDiff.asSeconds());

                    var dsplNum = hh;
                    var dsplMsg = " hours ago";
                    $scope.needToRunPct = $scope.forceRun || ($scope.runIfStaleByHours > 0 && dsplNum >= $scope.runIfStaleByHours) ? true : false;
                    
                    if (dsplNum < 1) {
                        dsplNum = mm;
                        dsplMsg = " mins ago";
                        if (!$scope.forceRun) $scope.needToRunPct = false;
                    }
                    if (dsplNum < 1) {
                        dsplNum = ss;
                        dsplMsg = " secs ago";
                        if (!$scope.forceRun) $scope.needToRunPct = false;
                    }

                    return "Last Run: " + Math.round(dsplNum) + dsplMsg;

                } else {
                    // never ran
                    $scope.needToRunPct = $scope.runIfStaleByHours > 0;
                    return "Last Run: Never";
                }
            }

            $timeout(function () {
                if ($scope.needToRunPct && $scope.enabled) {
                    $scope.$broadcast('runPctMct', {});
                }
            }, (3000));

            $scope.executePctViaBtn = function () {
                $scope.runViaButton = true;
                $scope.executePct();
            }

            $scope.executePct = function () {
                if (!$scope.enabled) return;

                $(".iconRunPct").addClass("fa-spin grn");
                if ($scope.runViaButton && $scope.curState === $state.current.name) $scope.root.$broadcast('btnPctMctRunning', {});

                objsetService.runPctContract($scope.contractId).then(
                    function (e) {
                        if ($scope.runViaButton) $scope.root.$broadcast('btnPctMctComplete', {});
                        $scope.root.$broadcast('ExecutionPctMctComplete', $scope.runViaButton);
                        
                        $timeout(function () {
                            if (typeof $scope.root.setBusy != 'undefined' && typeof $scope.root.setBusy === 'function') {
                                $scope.root.setBusy("", "");
                            }
                            $(".iconRunPct").removeClass("fa-spin grn");
                            }, 2000);
                       
                        $scope.runViaButton = false;
                    },
                    function (response) {
                        if ($scope.runViaButton) $scope.root.$broadcast('btnPctMctComplete', {});                        

                        if (typeof $scope.root.setBusy != 'undefined' && typeof $scope.root.setBusy === 'function') {
                            $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                        }
                        logger.error("Could not run Cost Test for contract " + $scope.contractId, response, response.statusText);
                        $timeout(function () {
                            if (typeof $scope.root.setBusy != 'undefined' && typeof $scope.root.setBusy === 'function') {
                                $scope.root.setBusy("", "");
                            }
                            $(".iconRunPct").removeClass("fa-spin grn");
                        }, 2000);
                        
                        $scope.runViaButton = false;
                    }
                );
            }

            $scope.$on('runPctMct', function (event, args) {
                if (!$scope.enabled) return;
                $scope.executePct();
            });

            $scope.$on('runForcedPctMct', function (event, args) {
                if (!$scope.enabled) return;
                $scope.executePctViaBtn();
            });

        }],
        link: function (scope, element, attr) {
        }
    };
}
