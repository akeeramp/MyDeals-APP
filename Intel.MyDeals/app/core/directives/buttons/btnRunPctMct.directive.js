angular
    .module('app.core')
    .directive('btnRunPctMct', btnRunPctMct);

btnRunPctMct.$inject = ['logger', 'objsetService', '$timeout'];

function btnRunPctMct(logger, objsetService, $timeout) {
    return {
        scope: {
            root: '=ngModel',
            btnStyle: '=?btnStyle',
            btnClass: '=?btnClass',
            contractId: '=contractId',
            onComplete: '=?onComplete',
            lastRun: '=?lastRun',
            btnType: '=?btnType',
            runIfStaleByHours: '=?runIfStaleByHours'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/buttons/btnRunPctMct.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.iconClass = "";
            $scope.text = "";
            $scope.textMsg = "";
            $scope.needToRunPct = false;

            if ($scope.btnType === "mct") {
                $scope.text = "Meet Comp Test";
                $scope.textMsg = "Meet Comp Test";
            } else {
                $scope.text = "Price Cost Test";
                $scope.textMsg = "Price Cost Test";
            }

            if (!$scope.runIfStaleByHours) $scope.runIfStaleByHours = 0;

            $scope.lastRunDisplay = function () {
                if ($(".iconRunPct").hasClass("fa-spin grn")) {
                    return "Running " + $scope.text;
                }
                if (!!$scope.lastRun) {
                    moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
                    var localTime = moment.tz(new Date(), "America/Los_Angeles").format("MM/DD/YY HH:mm:ss");
                    var lastruntime = moment($scope.lastRun);

                    var serverMeetCompPSTTime = lastruntime.format("MM/DD/YY HH:mm:ss");

                    var timeDiff = moment.duration(moment(serverMeetCompPSTTime).diff(moment(localTime)));
                    var hh = Math.abs(timeDiff.asHours());
                    var mm = Math.abs(timeDiff.asMinutes());
                    var ss = Math.abs(timeDiff.asSeconds());

                    var dsplNum = hh;
                    var dsplMsg = " hours ago";
                    $scope.needToRunPct = ($scope.runIfStaleByHours > 0 && dsplNum >= $scope.runIfStaleByHours) ? true : false;

                    if (dsplNum < 1) {
                        dsplNum = mm;
                        dsplMsg = " mins ago";
                        $scope.needToRunPct = false;
                    }
                    if (dsplNum < 1) {
                        dsplNum = ss;
                        dsplMsg = " secs ago";
                        $scope.needToRunPct = false;
                    }

                    return "Last Run: " + Math.round(dsplNum) + dsplMsg;

                } else {
                    // never ran
                    $scope.needToRunPct = $scope.runIfStaleByHours > 0;
                    return "Last Run: Never";
                }
            }


            $timeout(function () {
                if ($scope.needToRunPct) {
                    $scope.$broadcast('runPctMct', {});
                }
            }, (3000));


            $scope.executePct = function () {
                $(".iconRunPct").addClass("fa-spin grn");

                objsetService.runPctContract($scope.contractId).then(
                    function (e) {
                        if (!!$scope.onComplete) $scope.onComplete(e);

                        $timeout(function () {
                            $scope.root.setBusy("", "");
                            $(".iconRunPct").removeClass("fa-spin grn");
                        }, 2000);
                    },
                    function (response) {
                        $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                        logger.error("Could not run Cost Test.", response, response.statusText);
                        $timeout(function () {
                            $scope.root.setBusy("", "");
                            $(".iconRunPct").removeClass("fa-spin grn");
                        }, 2000);
                    }
                );
            }

            $scope.$on('runPctMct', function (event, args) {
                $scope.executePct();
            });


        }],
        link: function (scope, element, attr) {
        }
    };
}
