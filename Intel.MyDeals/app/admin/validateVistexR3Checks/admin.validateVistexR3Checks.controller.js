(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ValidateVistexR3Checkscontroller', ValidateVistexR3Checkscontroller)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    ValidateVistexR3Checkscontroller.$inject = ['validateVistexR3ChecksService', '$scope', 'logger','gridConstants'];

    function ValidateVistexR3Checkscontroller(validateVistexR3ChecksService, $scope, logger, gridConstants) {

        $scope.accessAllowed = true;
        if (!window.isDeveloper) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;
        vm.Results = [];
        vm.GoodToSendResults = [];
        $scope.GoodToSendDealIds = "";

        vm.vistexApiNames = [];
        vm.vistexApiNames.Request_Type = "MODES";
        $scope.ValidateForVistexR3 = {};
        $scope.UpdCnt = { 'sent': 0, 'returned': 0 };
        $scope.ShowResults = false;
        $scope.VstxCustFlag = 1;
        $scope.Mode = {};
        vm.ShowColumns = [];


        //$("#UPD_VAL_MULTISELECT").data("kendoMultiSelect").dataSource.data(response.data)
        vm.apiList = [];
        vm.apiList.Request_Type = "VISTEX_DEALS";
        //Creating API
        vm.apiList.push({ OPT_ID: 1, OPT_LBL: "1.  Deal Stage" });
        vm.apiList.push({ OPT_ID: 2, OPT_LBL: "2.  Lookback Period" });
        vm.apiList.push({ OPT_ID: 3, OPT_LBL: "3.  AR Settlement Level" });
        vm.apiList.push({ OPT_ID: 4, OPT_LBL: "4.  End Customer" });
        vm.apiList.push({ OPT_ID: 5, OPT_LBL: "5.  Reset Per Period" });
        vm.apiList.push({ OPT_ID: 6, OPT_LBL: "6.  Period Profile" });
        vm.apiList.push({ OPT_ID: 7, OPT_LBL: "7.  AR Settlement Level 2" });
        vm.apiList.push({ OPT_ID: 8, OPT_LBL: "8.  Settlement Partner" });
        vm.apiList.push({ OPT_ID: 9, OPT_LBL: "9.  Send To Vistex" });
        vm.apiList.push({ OPT_ID: 10, OPT_LBL: "10. All Attributes Report" });
        vm.selectedApiID = { OPT_ID: 10, OPT_LBL: "10. All Attributes Report" };

        vm.apiDs = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.apiList);
                }
            }
        });
        vm.vistexApiNames = {
            placeholder: "Select a Running Mode...",
            dataTextField: "OPT_LBL",
            dataValueField: "OPT_ID",
            valuePrimitive: true,
            autoBind: true,
            autoClose: false,
            dataSource: vm.apiDs,
            select: function (e) {
                if (e.dataItem) {
                    vm.apiSelectedCD = e.dataItem.OPT_ID;
                }
            }
        };

        vm.runAPI = function () {
            //Getting Selected API
            var comboboxApi = $("#comboApiName").data("kendoComboBox");
            var selectedIndex = comboboxApi._prev;
            if (vm.apiSelectedCD == "") {
                logger.warning('Please select an API to run Simulator...');
            }
            else {
                vm.callAPI(vm.apiSelectedCD);
            }
        };

        $scope.ValidateForVistexR3 = function () {
            var data = {};
            var reg = new RegExp(/^[0-9,]+$/);
            var isValidData = true;
            var isValidMode = true;
            var sentDeals = 0;
            if (!$scope.DealstoSend._behaviors) $scope.DealstoSend._behaviors = {};
            if ($scope.DealstoSend.DEAL_IDS != undefined) {
                $scope.DealstoSend.DEAL_IDS = $scope.DealstoSend.DEAL_IDS.replace(/ /g, "");
                if ($scope.DealstoSend.DEAL_IDS.slice(-1) == ',') {
                    $scope.DealstoSend.DEAL_IDS = $scope.DealstoSend.DEAL_IDS.replace(/,+$/g, "");
                }
                sentDeals = $scope.DealstoSend.DEAL_IDS.split(',').length;
            }

            // Check that all fields have data before sending
            if ($scope.DealstoSend.DEAL_IDS == undefined || $scope.DealstoSend.DEAL_IDS == '' || !reg.test($scope.DealstoSend.DEAL_IDS)) {
                $scope.DealstoSend._behaviors.validMsg["DEAL_IDS"] = "Please enter valid Deal Ids";
                $scope.DealstoSend._behaviors.isError["DEAL_IDS"] = true;
                isValidData = false;
            }
            else {
                $scope.DealstoSend._behaviors.validMsg["DEAL_IDS"] = "";
                $scope.DealstoSend._behaviors.isError["DEAL_IDS"] = false;
            }
            //if ($scope.SelectedCustId.ATRB_SID == undefined) {
            //    $scope.SelectedCustId._behaviors.validMsg["ATRB_SID"] = "Please enter valid Customer";
            //    $scope.SelectedCustId._behaviors.isError["ATRB_SID"] = true;
            //    isValidData = false;
            //}
            //else {
            //    $scope.SelectedCustId._behaviors.validMsg["ATRB_SID"] = "";
            //    $scope.SelectedCustId._behaviors.isError["ATRB_SID"] = false;
            //}
            if (vm.selectedApiID == undefined) {
                isValidMode = false;
            }

            // All fields are populated, send the request
            if (isValidData && isValidMode) {
                data.DEAL_IDS = $scope.DealstoSend.DEAL_IDS;
                data.VSTX_CUST_FLAG = $scope.VstxCustFlag;
                data.MODE = vm.selectedApiID.OPT_ID;
                if ($scope.SelectedCustId.ATRB_SID == undefined) {
                    data.CUST = null;
                }
                else {
                    data.CUST = $scope.SelectedCustId.ATRB_SID;
                }


                validateVistexR3ChecksService.ValidateVistexR3Checks(data).then(function (response) {
                    vm.Results = response.data.R3CutoverResponses;
                    vm.GoodToSendResults = response.data.R3CutoverResponsePassedDeals;
                    $scope.GoodToSendDealIds = _.pluck(vm.GoodToSendResults, 'Deal_Id').toString();

                    $scope.UpdCnt.sent = sentDeals;
                    $scope.UpdCnt.returned = vm.Results.length;
                    vm.dataSource.read();
                    $scope.ShowResults = true;
                    GetActiveColumns(vm.selectedApiID.OPT_ID);
                    logger.success("Please Check The Results.");
                }, function (response) {
                    logger.error("Unable to Send deal(s) to Vistex");
                    $scope.setBusy("", "");
                });
            }
            else if (!isValidMode) {
                $scope.ShowResults = false;
                logger.warning("Please select a valid mode");
            }
            else {
                $scope.ShowResults = false;
                logger.warning("Please fix validation errors");
            }
        };

        $scope.SendDealsToVistex = function () {
            //alert("Sending deals : " + $scope.GoodToSendDealIds);
            var win = window.open("Admin#/pushDealstoVistex?r3ValidDeals=" + $scope.GoodToSendDealIds);
            win.focus();
        };

        function GetActiveColumns(runMode) {
            var ShowColumns = ["Deal_Id"];
            if (runMode === 1) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Deal_Stage", "Deal_Type", "Pricing_Strategy_Stage", "COMMENTS" ]; //"LAST_TRACKER_NUMBER" is 2nd from last
            }
            if (runMode === 2) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Look_Back_Period_Months", "Payout_Based_On", "AR_Settlement_Level", "COMMENTS" ]; 
            }
            if (runMode === 3) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "AR_Settlement_Level", "COMMENTS" ];
            }
            if (runMode === 4) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "End_Customer_Retailer", "End_Customer", "End_Customer_Country", "Unified_Customer_ID", "Is_a_Unified_Cust", "COMMENTS" ];
            }
            if (runMode === 5) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Reset_Per_Period", "COMMENTS" ];
            }
            if (runMode === 6) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Period_Profile", "COMMENTS" ];
            }
            if (runMode === 7) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "AR_Settlement_Level", "COMMENTS" ];
            }
            if (runMode === 8) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "AR_Settlement_Level", "Settlement_Partner", "COMMENTS" ];
            }
            if (runMode === 9) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Send_To_Vistex", "COMMENTS" ];
            }
            else if (runMode === 10) {
                ShowColumns = ["Deal_Id", "Customer_Name", "Geo", "Deal_Type", "Rebate_Type", "Customer_Division", "Vertical", "Deal_Stage", "Pricing_Strategy_Stage", "Expire_Deal_Flag", "Deal_Start_Date", "Deal_End_Date", "Payout_Based_On", "Program_Payment", "Additive_Standalone", "End_Customer_Retailer", "Request_Date", "Requested_by", "Request_Quarter", "Division_Approved_Date", "Division_Approver", "Geo_Approver", "Market_Segment", "Deal_Description", "Ceiling_Limit_End_Volume_for_VT", "Limit", "Consumption_Reason", "Consumption_Reason_Comment", "Period_Profile", "AR_Settlement_Level", "Look_Back_Period_Months", "Consumption_Customer_Platform", "Consumption_Customer_Segment", "Consumption_Customer_Reported_Geo", "End_Customer", "End_Customer_Country", "Unified_Customer_ID", "Is_a_Unified_Cust", "Project_Name", "System_Price_Point", "System_Configuration", "Settlement_Partner", "Reset_Per_Period", "Send_To_Vistex", "COMMENTS" ];
            }
            //else {
            //    ShowColumns = ["Deal"];
            //}
            var grid = $("#OutputGrid").data("kendoGrid");

            for (var key in grid.columns) {
                if (ShowColumns.includes(grid.columns[key].field)) {
                    grid.showColumn(grid.columns[key].field);
                } else {
                    grid.hideColumn(grid.columns[key].field);
                }
            }

        }

        //To send data to DSA Outbound table 
        vm.toggleType = function (currentState) {
            $scope.VstxCustFlag = currentState;
        };

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Results);
                }
            },
            pageSize: 25
        });

        vm.exportToExcel = function () {
            gridUtils.dsToExcelVistexR3(vm.gridOptions, vm.gridOptions.dataSource, "Vistex R3 Deal Review.xlsx", false);
        }

        vm.clearFilters = function () {
            $("form.k-filter-menu button[type='reset']").trigger("click");
        };

        vm.gridOptions = {
            toolbar: [
                { text: "", template: kendo.template($("#grid_toolbar_clearbutton").html()) },
                { text: "", template: kendo.template($("#grid_toolbar_exportexcel").html()) }
            ],
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            //navigatable: true,
            resizable: true,
            reorderable: true,
            //selectable: true,
            //columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            columns: [
                {
                    field: "Deal_Id",
                    title: "Deal #",
                    width: "120px",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "COMMENTS",
                    width: "500px",
                    template: "<span ng-model='dataItem' style='color:red;'>#= COMMENTS #</span>",
                    headerTemplate: "<span style='color:red;'>Errors</span>"
                },
                {
                    field: "Customer_Name",
                    title: "Customer Name",
                    width: "185px",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "Geo",
                    title: "Geo",
                    width: "105px",
                    filterable: { multi: true, search: true }
                },
                { field: "Deal_Type", title: "Deal Type", width: "120px", filterable: { multi: true, search: true } },
                { field: "Rebate_Type", title: "Rebate Type", width: "120px", filterable: { multi: true, search: true } },
                { field: "Customer_Division", title: "Customer Division", width: "160px", filterable: { multi: true, search: true } },
                { field: "Vertical", title: "Vertical", width: "100px", filterable: { multi: true, search: true } },
                { field: "Deal_Stage", title: "Deal Stage", width: "130px", filterable: { multi: true, search: true } },
                { field: "Pricing_Strategy_Stage", title: "PS Stage", width: "120px", filterable: { multi: true, search: true } },
                { field: "Expire_Deal_Flag", title: "Expire Deal Flag", width: "150px", filterable: { multi: true, search: true } },
                { field: "Deal_Start_Date", title: "Billing Start Date", width: "150px", filterable: { multi: true, search: true } },
                { field: "Deal_End_Date", title: "Billing End Date", width: "150px", filterable: { multi: true, search: true } },
                { field: "Payout_Based_On", title: "Payout Based On", width: "160px", filterable: { multi: true, search: true } },
                { field: "Program_Payment", title: "Program Payment", width: "150px", filterable: { multi: true, search: true } },
                { field: "Additive_Standalone", title: "Group Type", width: "100px", filterable: { multi: true, search: true } },
                { field: "Request_Date", title: "Request Date", width: "130px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Requested_by", title: "Requested by", width: "130px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Request_Quarter", title: "Request Quarter", width: "130px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Division_Approved_Date", title: "Division Approved Date", width: "170px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Division_Approver", title: "Division Approver", width: "150px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Geo_Approver", title: "Geo Approver", width: "150px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Market_Segment", title: "Market Segment", width: "150px", filterable: { multi: true, search: true } },
                { field: "Deal_Description", title: "Deal Description", width: "150px", filterable: { multi: true, search: true }, hidden: true },
                { field: "Ceiling_Limit_End_Volume_for_VT", title: "Ceiling Limit/End Volume (for VT)", width: "200px", filterable: { multi: true, search: true } },
                { field: "Limit", title: "$ Limit", width: "100px", filterable: { multi: true, search: true } },
                { field: "Consumption_Reason", title: "Consumption Reason", width: "150px", filterable: { multi: true, search: true } },
                { field: "Consumption_Reason_Comment", title: "Consumption Reason Comment", width: "170px", filterable: { multi: true, search: true } },
                { field: "Period_Profile", title: "Period Profile", width: "150px", filterable: { multi: true, search: true } },
                { field: "AR_Settlement_Level", title: "AR Settlement Level", width: "160px", filterable: { multi: true, search: true } },
                { field: "Look_Back_Period_Months", title: "Look Back Period (Months)", width: "190px", filterable: { multi: true, search: true } },
                { field: "Consumption_Customer_Platform", title: "Consumption Customer Platform", width: "200px", filterable: { multi: true, search: true } },
                { field: "Consumption_Customer_Segment", title: "Consumption Customer Segment", width: "200px", filterable: { multi: true, search: true } },
                { field: "Consumption_Customer_Reported_Geo", title: "Consumption Customer Reported Geo", width: "220px", filterable: { multi: true, search: true } },
                { field: "End_Customer_Retailer", title: "End Customer/Retailer", width: "160px", filterable: { multi: true, search: true } },
                { field: "End_Customer", title: "End Customer", width: "150px", filterable: { multi: true, search: true } },
                { field: "End_Customer_Country", title: "End Customer Country", width: "180px", filterable: { multi: true, search: true } },
                { field: "Unified_Customer_ID", title: "Unified Customer ID", width: "170px", filterable: { multi: true, search: true } },
                { field: "Is_a_Unified_Cust", title: "Is a Unified Cust", width: "150px", filterable: { multi: true, search: true } },
                { field: "Project_Name", title: "Project Name", width: "150px", filterable: { multi: true, search: true } },
                { field: "System_Price_Point", title: "System Price Point", width: "160px", filterable: { multi: true, search: true } },
                { field: "System_Configuration", title: "System Configuration", width: "180px", filterable: { multi: true, search: true } },
                { field: "Settlement_Partner", title: "Settlement Partner", width: "170px", filterable: { multi: true, search: true } },
                { field: "Reset_Per_Period", title: "Reset Per Period", width: "150px", filterable: { multi: true, search: true } },
                { field: "Send_To_Vistex", title: "Send To Vistex", width: "150px", filterable: { multi: true, search: true } }
            ]
        };

    }
})();