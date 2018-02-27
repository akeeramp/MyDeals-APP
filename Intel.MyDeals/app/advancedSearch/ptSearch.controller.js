(function () {
    'use strict';
    angular
        .module('app.advancedSearch')
        .controller('PtSearchController', PtSearchController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    PtSearchController.$inject = ['dataService', '$scope', '$stateParams', '$timeout', 'logger'];

    function PtSearchController(dataService, $scope, $stateParams, $timeout, logger) {

        // get the dcid
        $scope.dcid = $stateParams.dcid;
        $scope.isBusy = false;
        $scope.isBusyMsgTitle = "";
        $scope.isBusyMsgDetail = "";
        $scope.isBusyType = "";
        $scope.isBusyShowFunFact = false;
        $scope.status = "Currently looking for your Pricing Table.";

        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            $timeout(function () {
            	var newState = msg != undefined && msg !== "";
            	if (isShowFunFact == null) { isShowFunFact = false; }

                // if no change in state, simple update the text
                if ($scope.isBusy === newState) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                    return;
                }

                $scope.isBusy = newState;
                if ($scope.isBusy) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                } else {
                    $timeout(function () {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                        $scope.isBusyShowFunFact = isShowFunFact;
                    }, 500);
                }
            });
        }

        $scope.setBusy("Searching...", "Searching for Pricing Table " + $scope.dcid);

        //perform search operation
        dataService.get("api/Search/GotoPt/" + $scope.dcid).then(function (response) {

            // Didn't find it?
            if (response.data.ContractId <= 0) {
                $scope.status = response.data.Message === "" ? "Unable to locate the Pricing Table." : response.data.Message;
                $scope.setBusy("", "");
                return;
            }

            // Found it... redirect
            var url = "/Contract#/manager/" + response.data.ContractId + "/" + response.data.PricingStrategyId + "/" + response.data.PricingTableId;
            if (window.usrRole === "DA") url += "/Contract#/manager/" + response.data.ContractId + "/summary";

            document.location.href = url;

        }, function (response) {
            logger.error("No Results Found", response, response.statusText);
        });

    }
})();