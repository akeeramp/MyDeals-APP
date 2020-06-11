(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('DealMassUpdateController', DealMassUpdateController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    DealMassUpdateController.$inject = ['dealMassUpdateService', '$scope', 'gridConstants', 'logger', '$timeout'];

    function DealMassUpdateController(dealMassUpdateService, $scope, gridConstants, logger, $timeout) {

        $scope.accessAllowed = true;
        if (!(window.usrRole === 'SA' || window.isDeveloper)) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }
        var vm = this;
        vm.UpdatedResults = [];
        $scope.MassUpdateData = {};
        $scope.UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
        $scope.ShowResults = false;


        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
                var newState = msg != undefined && msg !== "";
                isShowFunFact = true; // Always show fun fact
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
                    }, 100);
                }
            
        }

        $scope.ValidateAndUpdateValues = function () {
            $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);
            var data = {};
            var reg = new RegExp(/^[0-9,]+$/);
            var isvalidAtrb = true;
            var isDealIdsValid = true;
            if (!$scope.MassUpdateData._behaviors) $scope.MassUpdateData._behaviors = {};
            if ($scope.MassUpdateData.DEAL_IDS != undefined) {
                $scope.MassUpdateData.DEAL_IDS = $scope.MassUpdateData.DEAL_IDS.replace(/ /g, "");
                if ($scope.MassUpdateData.DEAL_IDS.slice(-1) == ',') {
                    $scope.MassUpdateData.DEAL_IDS = $scope.MassUpdateData.DEAL_IDS.replace(/,+$/g, "");
                }
            }
            if ($scope.MassUpdateData.DEAL_IDS == undefined || $scope.MassUpdateData.DEAL_IDS == '' || !reg.test($scope.MassUpdateData.DEAL_IDS)) {
                $scope.MassUpdateData._behaviors.validMsg["DEAL_IDS"] = "Please enter valid Deal Ids";
                $scope.MassUpdateData._behaviors.isError["DEAL_IDS"] = true;
                isDealIdsValid = false;
            }
            else {
                $scope.MassUpdateData._behaviors.validMsg["DEAL_IDS"] = "";
                $scope.MassUpdateData._behaviors.isError["DEAL_IDS"] = false;
            }
            if (!$scope.MassUpdateData.ATRB_SID) {
                $scope.MassUpdateData._behaviors.validMsg["ATRB_SID"] = "Please Select Valid Attribute";
                $scope.MassUpdateData._behaviors.isError["ATRB_SID"] = true;
                isvalidAtrb = false;
            }
            else {
                $scope.MassUpdateData._behaviors.validMsg["ATRB_SID"] = "";
                $scope.MassUpdateData._behaviors.isError["ATRB_SID"] = false;
            }
            if (isDealIdsValid && isvalidAtrb) {
                data.DEAL_IDS = $scope.MassUpdateData.DEAL_IDS;
                data.ATRB_SID = $scope.MassUpdateData.ATRB_SID;
                data.UPD_VAL = $scope.MassUpdateData.UPD_VAL;
                dealMassUpdateService.UpdateDealsAttrbValue(data)
                    .then(function (response) {
                        vm.UpdatedResults = response.data;
                        $scope.UpdCnt.all = vm.UpdatedResults.length;
                        $scope.UpdCnt.error = vm.UpdatedResults.filter(x => x.ERR_FLAG === 1).length;
                        $scope.UpdCnt.success = vm.UpdatedResults.filter(x => x.ERR_FLAG === 0).length;
                        vm.dataSource.read();
                        $scope.ShowResults = true;
                        $scope.setBusy("", "");
                        logger.success("Please Check The Results.");
                    }, function (response) {
                            logger.error("Unable to Update deal(s)");
                            $scope.setBusy("", "");
                    });
            }
            else {
                $scope.ShowResults = false;
                logger.warning("Please fix validation errors");
                $scope.setBusy("", "");
            }
        }



        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.UpdatedResults);
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