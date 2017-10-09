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
            btnType: '=?btnType'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/buttons/btnRunPctMct.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.iconClass = "";
            $scope.text = "Run Cost Test</br>& Meet Comp";
            $scope.textMsg = "Cost Test & Meet Comp";
            if ($scope.btnType === "pct") {
                $scope.text = "Run</br>Cost Test";
                $scope.textMsg = "Cost Test";
            }
            if ($scope.btnType === "mct") {
                $scope.text = "Run</br>Meet Comp";
                $scope.textMsg = "Meet Comp";
            }

            $scope.executePct = function() {
                $scope.root.setBusy($scope.textMsg, "Running " + $scope.textMsg + ".");
                $(".iconRunPct").addClass("fa-spin grn");

                objsetService.runPctContract($scope.contractId).then(
                    function (e) {
                        if (!!$scope.onComplete) $scope.onComplete(e);

                        $scope.root.setBusy($scope.textMsg + " Done", $scope.textMsg + " Ran Successfully.");
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
