(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('DealMassUpdateController', DealMassUpdateController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    DealMassUpdateController.$inject = ['dealMassUpdateService', '$scope', 'gridConstants', 'logger', '$timeout','dataService'];

    function DealMassUpdateController(dealMassUpdateService, $scope, gridConstants, logger, $timeout, dataService) {
        const NumericAtrbIds = [3352, 3355, 3461, 3708];
        const TextBoxAtrbIds = [3349, 3350, 3351, 3453, 3464, 3568];
        const NumericIdTo1 = [3352, 3355, 3708];
        const NumericIdTo24 = [3461];
        const SingleValueDropdownAtrbIds = [57, 3009, 3717, 3719, 3465];

        $scope.accessAllowed = true;
        if (!window.isDeveloper) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }
        var vm = this;
        vm.UpdatedResults = [];
        vm.Send_Vstx_Flg = {};
        $scope.MassUpdateData = {};
        $scope.MassUpdateData.MaxNumericValue = 24;
        $scope.UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
        $scope.ShowResults = false;
        $scope.ShowNumeric = false;
        $scope.MassUpdateData.SEND_VSTX_FLG = false;


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

        //It is used for set the SEND_VSTX_FLG as true/false value as per toggle ON/OFF
        //If Toggle is ON then changes will be added to the vistex staging table
        //If Toggle is OFF then changes will not be added to the vistex staging table
        vm.toggleType = function (currentState) {
           
            $scope.MassUpdateData.SEND_VSTX_FLG = currentState;
          
        }

        $scope.$watch('MassUpdateData', function (newValue, oldValue, el) {
            if (newValue.ATRB_SID === undefined || newValue.ATRB_SID === null || oldValue.ATRB_SID === newValue.ATRB_SID ) {
                if (newValue.ATRB_SID === undefined) {
                    if (!$scope.MassUpdateData._behaviors) $scope.MassUpdateData._behaviors = {};
                    if (!$scope.MassUpdateData._behaviors.isHidden) $scope.MassUpdateData._behaviors.isHidden = {};
                    $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_MULTISELECT"] = true;
                    $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_DROPDOWN"] = true;
                    $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_TEXT"] = true;
                }
                return
            };
            if ($scope.MassUpdateData._behaviors.validMsg) $scope.MassUpdateData._behaviors.validMsg = {};
            if ($scope.MassUpdateData._behaviors.isError) $scope.MassUpdateData._behaviors.isError = {};
            if ($scope.MassUpdateData.UPD_VAL) delete $scope.MassUpdateData.UPD_VAL;
            if ($scope.MassUpdateData.UPD_VAL_MULTISELECT) delete $scope.MassUpdateData.UPD_VAL_MULTISELECT;
            if ($scope.MassUpdateData.UPD_VAL_DROPDOWN) delete $scope.MassUpdateData.UPD_VAL_DROPDOWN;
            if ($scope.MassUpdateData.UPD_VAL_TEXT) delete $scope.MassUpdateData.UPD_VAL_TEXT;
            // Numeric Value Controller
            if (NumericAtrbIds.includes(newValue.ATRB_SID)) { 
                $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_DROPDOWN"] = true;
                $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_MULTISELECT"] = true;
                $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_TEXT"] = true;
                if (NumericIdTo1.includes(newValue.ATRB_SID)) {
                    $scope.MassUpdateData.MaxNumericValue = 1;
                }
                else if (NumericIdTo24.includes(newValue.ATRB_SID)) {
                    $scope.MassUpdateData.MaxNumericValue = 24;
                }
                else {
                    $scope.MassUpdateData.MaxNumericValue = 999999999;
                }
                $scope.ShowNumeric = true;
            }
            else {
                dataService.get("/api/DealMassUpdate/GetUpdateAttributes/" + newValue.ATRB_SID).then(function (response) {
                    // Single Dropdown Value Controller
                    if (SingleValueDropdownAtrbIds.includes(newValue.ATRB_SID)) {
                        if (!!$("#UPD_VAL_DROPDOWN").data("kendoDropDownList")) {
                            $("#UPD_VAL_DROPDOWN").data("kendoDropDownList").setDataSource(response.data);
                            $("#UPD_VAL_DROPDOWN").data("kendoDropDownList").refresh();
                            $("#UPD_VAL_DROPDOWN").data("kendoDropDownList").select(-1);
                        }
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_DROPDOWN"] = false;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_MULTISELECT"] = true;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_TEXT"] = true;
                        $scope.ShowNumeric = false;
                    }
                    else if (TextBoxAtrbIds.includes(newValue.ATRB_SID)) {
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_DROPDOWN"] = true;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_MULTISELECT"] = true;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_TEXT"] = false;
                        $scope.ShowNumeric = false;
                    }
                    // Multivalue Dropdown Value Controller
                    else {
                        if (!!$("#UPD_VAL_MULTISELECT").data("kendoMultiSelect")) {
                            $("#UPD_VAL_MULTISELECT").data("kendoMultiSelect").dataSource.data(response.data);
                        }
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_DROPDOWN"] = true;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_MULTISELECT"] = false;
                        $scope.MassUpdateData._behaviors.isHidden["UPD_VAL_TEXT"] = true;
                        $scope.ShowNumeric = false;
                    }
                },
                    function (response) {
                        logger.error("Unable to get Attribute List", response, response.statusText);
                    });
            }
        }, true);

        $scope.ValidateAndUpdateValues = function () {
            $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);
            var data = {};
            var reg = new RegExp(/^[0-9,]+$/);
            var isvalidAtrb = true;
            var isDealIdsValid = true;
            var updatedValues = "";
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

            // Numeric Value Controller Read
            if (NumericAtrbIds.includes($scope.MassUpdateData.ATRB_SID)) {
                updatedValues = $scope.MassUpdateData.UPD_VAL;
            }
            // Text Value Controller Read
            else if (TextBoxAtrbIds.includes($scope.MassUpdateData.ATRB_SID)) {
                //if ($scope.MassUpdateData.UPD_VAL_TEXT) {
                    updatedValues = $scope.MassUpdateData.UPD_VAL_TEXT;
                //}
                //else {
                //    $scope.MassUpdateData._behaviors.validMsg["UPD_VAL_TEXT"] = "Please Select Valid Values";
                //    $scope.MassUpdateData._behaviors.isError["UPD_VAL_TEXT"] = true;
                //    isvalidAtrb = false;
                //}
            }
            // Single Dropdown Value Controller Read
            else if (SingleValueDropdownAtrbIds.includes($scope.MassUpdateData.ATRB_SID)) {
                if ($scope.MassUpdateData.UPD_VAL_DROPDOWN) {
                    updatedValues = $scope.MassUpdateData.UPD_VAL_DROPDOWN;
                }
                else {
                    $scope.MassUpdateData._behaviors.validMsg["UPD_VAL_DROPDOWN"] = "Please Select Valid Values";
                    $scope.MassUpdateData._behaviors.isError["UPD_VAL_DROPDOWN"] = true;
                    isvalidAtrb = false;
                }
            }
            // Multivalue Dropdown Value Controller Read
            else {
                if ($scope.MassUpdateData.UPD_VAL_MULTISELECT && $scope.MassUpdateData.UPD_VAL_MULTISELECT.length > 0) {
                    updatedValues = $scope.MassUpdateData.UPD_VAL_MULTISELECT.toString();
                }
                else {
                    $scope.MassUpdateData._behaviors.validMsg["UPD_VAL_MULTISELECT"] = "Please Select Valid Values";
                    $scope.MassUpdateData._behaviors.isError["UPD_VAL_MULTISELECT"] = true;
                    isvalidAtrb = false;
                }
            }

            if (isDealIdsValid && isvalidAtrb) {
                if ($scope.MassUpdateData._behaviors.validMsg) $scope.MassUpdateData._behaviors.validMsg = {};
                if ($scope.MassUpdateData._behaviors.isError) $scope.MassUpdateData._behaviors.isError = {};
                data.DEAL_IDS = $scope.MassUpdateData.DEAL_IDS;
                data.ATRB_SID = $scope.MassUpdateData.ATRB_SID;
                data.UPD_VAL = updatedValues;
                data.SEND_VSTX_FLG = $scope.MassUpdateData.SEND_VSTX_FLG;             
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