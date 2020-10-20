(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PushDealstoVistexcontroller', PushDealstoVistexcontroller)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    PushDealstoVistexcontroller.$inject = ['pushDealstoVistexService', '$scope', 'logger'];

    function PushDealstoVistexcontroller(pushDealstoVistexService, $scope, logger) {

        $scope.accessAllowed = true;
        if (!window.isDeveloper) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;
        vm.Results = [];
        $scope.DealstoSend = {};
        $scope.UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
        $scope.ShowResults = false;

        $scope.ValidateAndSendDeals = function () {
            var data = {};
            var reg = new RegExp(/^[0-9,]+$/);
            var isDealIdsValid = true;
            if (!$scope.DealstoSend._behaviors) $scope.DealstoSend._behaviors = {};
            if ($scope.DealstoSend.DEAL_IDS != undefined) {
                $scope.DealstoSend.DEAL_IDS = $scope.DealstoSend.DEAL_IDS.replace(/ /g, "");
                if ($scope.DealstoSend.DEAL_IDS.slice(-1) == ',') {
                    $scope.DealstoSend.DEAL_IDS = $scope.DealstoSend.DEAL_IDS.replace(/,+$/g, "");
                }
            }
            if ($scope.DealstoSend.DEAL_IDS == undefined || $scope.DealstoSend.DEAL_IDS == '' || !reg.test($scope.DealstoSend.DEAL_IDS)) {
                $scope.DealstoSend._behaviors.validMsg["DEAL_IDS"] = "Please enter valid Deal Ids";
                $scope.DealstoSend._behaviors.isError["DEAL_IDS"] = true;
                isDealIdsValid = false;
            }
            else {
                $scope.DealstoSend._behaviors.validMsg["DEAL_IDS"] = "";
                $scope.DealstoSend._behaviors.isError["DEAL_IDS"] = false;
            }

            if (isDealIdsValid) {
                data.DEAL_IDS = $scope.DealstoSend.DEAL_IDS;
                pushDealstoVistexService.PushDealstoVistex(data).then(function (response) {
                        vm.Results = response.data;
                        $scope.UpdCnt.all = vm.Results.length;
                        $scope.UpdCnt.error = vm.Results.filter(x => x.ERR_FLAG === 1).length;
                        $scope.UpdCnt.success = vm.Results.filter(x => x.ERR_FLAG === 0).length;
                        vm.dataSource.read();
                        $scope.ShowResults = true;
                        logger.success("Please Check The Results.");
                    }, function (response) {
                        logger.error("Unable to Send deal(s) to Vistex");
                        $scope.setBusy("", "");
                    });
            }
            else {
                $scope.ShowResults = false;
                logger.warning("Please fix validation errors");
            }
        }

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Results);
                }
            },
            schema: {
                model: {
                    id: "DEAL_ID",
                    fields: {
                        DEAL_ID: { editable: false, nullable: false },
                        UPD_MSG: { editable: false, nullable: false }
                    }
                }
            }
        })

        vm.gridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            scrollable: true,
            resizable: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            columns: [
                {
                    field: "DEAL_ID",
                    title: "Deal Id"
                },
                {
                    field: "UPD_MSG",
                    title: "Results"

                }
            ]
        }
    }
})();