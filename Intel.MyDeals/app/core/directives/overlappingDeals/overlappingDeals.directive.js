(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('overlappingDeals', overlappingDeals);

    overlappingDeals.$inject = ['$compile', '$filter', 'objsetService', 'securityService', '$timeout', 'logger', '$linq', '$uibModal'];

    function overlappingDeals($compile, $filter, objsetService, securityService, $timeout, logger, $linq, $uibModal) {
        kendo.culture("en-US");

        return {
            scope: {
                objSids: '=',
                objType: '='
            },
            restrict: 'AE',
            transclude: true,
            templateUrl: '/app/core/directives/overlappingDeals/overlappingDeals.directive.html',
            controller: ['$scope', 'dataService', function ($scope, dataService) {                
                $scope.loading = true;
                $scope.msg = "Looking for Overlapping Deals";
                $scope.isOverlapping = false;
                $scope.isOvlpAccess = false;
                if (usrRole === "GA" || usrRole === "FSE") {
                    $scope.isOvlpAccess = true;
                }
                $scope.isOverlapping = false;
                $scope.ovlpData = [];

                $scope.assignVal = function (field, defval) {
                    var item = $scope[field];
                    return (item === undefined || item === null) ? defval : item;
                }

                $scope.$root.$broadcast("overlappingDealSearching", null);

                // these need to be global... if the user navigates around, we need to be able to update them
                $scope.$root.ovlapObjSids = $scope.objSids;
                $scope.$root.ovlapObjType = $scope.objType;

                $scope.ovlpErrorCounter = function (data) {
                    $scope.ovlpErrorCount = [];
                    var rowCount = $filter('unique')(data, 'WIP_DEAL_OBJ_SID');
                    for (var z = 0; z < rowCount.length; z++) {
                        $scope.ovlpErrorCount.push(rowCount[z].WIP_DEAL_OBJ_SID);
                    }
                }

                $scope.gotoDealDetails = function (dataItem, dcID) {
                    var win = window.open("Contract#/manager/" + dataItem.CONTRACT_NBR + "/" + dataItem.PRICE_STRATEGY + "/" + dataItem.PRICING_TABLES + "/wip?searchTxt=" + dcID, '_blank');
                    win.focus();
                }

                //Accept Overlapping
                $scope.acceptOvlp = function (data, YCS2_OVERLAP_OVERRIDE) {
                    var tempdata = $scope.ovlpData;
                    var START_DT = '';
                    var END_DT = '';
                    var dcID = 0;

                    $scope.$root.$broadcast("overlappingDealUpdating", null);

                    for (var i = 0; i < tempdata.length; i++) {
                        if (tempdata[i].WIP_DEAL_OBJ_SID === data && tempdata[i].WF_STG_CD === "Draft" && tempdata[i].OVLP_CD === "SELF_OVLP") {
                            START_DT = tempdata[i].START_DT;
                            END_DT = tempdata[i].END_DT;
                        }
                    }
                    for (var i = 0; i < tempdata.length; i++) {
                        if (tempdata[i].WIP_DEAL_OBJ_SID === data && tempdata[i].WF_STG_CD === "Active" && tempdata[i].OVLP_CD === "FE_HARD_STOP") {
                            if (YCS2_OVERLAP_OVERRIDE === 'Y') {                                
                                var drftStartDate = new Date(START_DT);
                                var drftEndDate = new Date(END_DT);
                                var actvEndDate = new Date(tempdata[i].END_DT);
                                var actvStartDate = new Date(tempdata[i].START_DT);

                                //Pulling END Date condition 
                                if (drftStartDate > actvStartDate) {                                    
                                    drftStartDate.setDate(drftStartDate.getDate() - 1);                                    
                                    var tempEND_DT = drftStartDate.getMonth("MM") + 1 + "/" + drftStartDate.getDate() + "/" + drftStartDate.getFullYear();
                                    $scope.ovlpData[i].END_DT = "<span title='END Date Pulling' style='color:red'> " + tempEND_DT + " - Pending </span>";
                                }
                                //Pushing END Date Condition
                                else if (drftEndDate < actvEndDate) {                                    
                                    drftEndDate.setDate(drftEndDate.getDate() + 1);                                    
                                    var tempSTART_DT = drftEndDate.getMonth("MM") + 1 + "/" + drftEndDate.getDate() + "/" + drftEndDate.getFullYear();
                                    $scope.ovlpData[i].START_DT = "<span title='START Date Pushing' style='color:red'> " + tempSTART_DT + " - Pending </span>";
                                }                             
                                
                            }
                            else {
                                $scope.ovlpData[i].START_DT = $scope.ovlpDataRep[i].START_DT;
                                $scope.ovlpData[i].END_DT = $scope.ovlpDataRep[i].END_DT;
                            }

                        }
                    }

                    $scope.ovlpDataSource.read();

                    objsetService.updateOverlappingDeals(data, YCS2_OVERLAP_OVERRIDE)
                        .then(function (response) {
                            if (response.data[0].PRICING_TABLES > 0) {

                                if (YCS2_OVERLAP_OVERRIDE === 'N') {
                                    $scope.ovlpErrorCount.push(data);
                                }
                                else {
                                    if ($scope.ovlpErrorCount.indexOf(data) > -1) {
                                        $scope.ovlpErrorCount.splice($scope.ovlpErrorCount.indexOf(data), 1);
                                    }
                                }

                                $scope.ovlpDataSource.read();
                                $scope.$root.$broadcast("overlappingDealUpdateFinished", null);

                            } else {
                                $scope.$root.$broadcast("overlappingDealUpdateFinished", null);
                                return false;
                            }

                        });
                }
                //Take first character of WF_STG_CD
                $scope.stageOneChar = function (WF_STG_CD) {
                    return WF_STG_CD === undefined ? "&nbsp;" : WF_STG_CD[0];
                }
                //Reject
                $scope.rejectOvlp = function (OVLP_DEAL_OBJ_SID) {
                    kendo.alert("Please go to <b>Deal Editor</b>; <b>edit</b> and <b>re-validate</b> your deal to avoid overlapping with other deals.", "Overlapping Warning");
                }

                $scope.ovlpDataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (e) {
                            e.success($scope.ovlpData);
                        }
                    },
                    error: function (e) {
                        // handle data operation error
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                    },
                    schema: {
                        model: {
                            id: "CONTRACTNUMBER",
                            fields: {
                                "PROGRAM_PAYMENT": {
                                    type: "string"
                                },
                                "CONTRACTNUMBER": {
                                    type: "number"
                                },
                                "OVLP_DEAL_OBJ_SID": {
                                    type: "string",
                                    editable: false
                                },
                                "WIP_DEAL_OBJ_SID": {
                                    type: "number",
                                    editable: false
                                },
                                "WF_STG_CD": {
                                    type: "string",
                                    editable: false
                                },
                                "CUST_ACCNT_DIV": {
                                    type: "string",
                                    editable: false
                                },
                                "PRODUCT_NM": {
                                    type: "string",
                                    editable: false
                                },
                                "GEO_COMBINED": {
                                    type: "string",
                                    editable: false
                                },
                                "SOLD_TO_ID": {
                                    type: "string",
                                    editable: false
                                },
                                "START_DT": {
                                    type: "stirng",
                                    editable: false
                                },
                                "END_DT": {
                                    type: "string",
                                    editable: false
                                },
                                "ECAP_PRICE": {
                                    type: "number",
                                    editable: false
                                },
                                "DEAL_COMB_TYPE": {
                                    type: "string",
                                    editable: false
                                },
                                "ECAP_TYPE": {
                                    type: "string",
                                    editable: false
                                },
                                "MRKT_SEG": {
                                    type: "string",
                                    editable: false
                                },
                                "OVLP_CD": {
                                    type: "string",
                                    editable: false
                                }
                            }
                        }
                    },
                    pageSize: 50,
                    group: [{ field: "PROGRAM_PAYMENT" }, { field: "WIP_DEAL_OBJ_SID" }]
                });

                $scope.gridOptions = {
                    dataSource: $scope.ovlpDataSource,
                    scrollable: true,
                    sortable: true,
                    editable: false,
                    navigatable: true,
                    filterable: true,
                    resizable: true,
                    reorderable: true,
                    noRecords: {
                        template: "<div style='padding: 100px;'>No Overlapping deals were found</div>"
                    },
                    pageable: {
                        refresh: false,
                        pageSizes: [25, 50, 100, 250, 500],
                        buttonCount: 5
                    },
                    columns: [
                        {
                            field: "WF_STG_CD",
                            filterable: false,
                            template: "<div class='fl gridStatusMarker centerText #=WF_STG_CD#' title='#=WF_STG_CD#'>{{stageOneChar(dataItem.WF_STG_CD)}}</div>",
                            title: " ",
                            width: "21px"
                        },
                        {
                            field: "PROGRAM_PAYMENT",
                            title: "Type",
                            width: "120px",
                            filterable: { multi: true, search: true },
                            groupHeaderTemplate: function (e) {
                                if (e.value === "Frontend YCS2") {
                                    return "<span style='font-weight:bold;font-size:13px; color: red;letter-spacing:0.07em '>Front End Overlap</span>";
                                }
                                else {
                                    return "<span style='font-weight:bold;font-size:13px; color: red;letter-spacing:0.07em '>Billings Overlap</span>";
                                }
                            },
                            hidden: true
                        },
                        {
                            field: "WIP_DEAL_OBJ_SID",
                            title: "Contract",
                            width: "120px",
                            groupHeaderTemplate: function (e) {
                                var hasResolved = false;
                                var cnt = 0;
                                var groupRow = $filter("where")($scope.ovlpDataSource._data, { 'WIP_DEAL_OBJ_SID': e.value, 'PROGRAM_PAYMENT': 'Frontend YCS2' });
                                if (groupRow.length > 1) {

                                    if ($filter("where")(groupRow, { 'WF_STG_CD': 'Draft' }).length > 1) {
                                        cnt = groupRow.length;
                                    }
                                    else if ($filter("where")(groupRow, { 'WF_STG_CD': 'Draft' }).length === 1) {
                                        cnt = 1;
                                    }
                                    else {
                                        cnt = 2;
                                    }

                                }
                                if ($scope.ovlpErrorCount.indexOf(e.value) > -1) {
                                    hasResolved = true;
                                }

                                if (hasResolved && cnt > 0 && cnt === 1 && $scope.isOvlpAccess) {
                                    return "<span class=\"grpTitle\" style='font-weight:bold'>" + e.value + " </span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was found with an Active or Draft deal, in order you create this new deal would you like the System to change the End date of the deal?</span>&nbsp;<a class='lnk btnYes' ng-click='acceptOvlp(" + e.value + ",\"Y\")' ><i class='intelicon-check' style='font-size: 12px !important;'></i> Yes </a > <span class='or'>&nbsp;OR&nbsp;</span> <a class='lnk btnNo' ng-click='rejectOvlp(" + e.value + ")'><i class='intelicon-close-max' style='font-size: 10px !important;padding-right: 3px;'></i>&nbsp;No</a>";
                                }
                                else if (hasResolved && cnt > 1 && $scope.isOvlpAccess) {
                                    return "<span class=\"grpTitle\" style='font-weight:bold'>" + e.value + " </span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was found with another Draft deal, please correct and revalidate.</span>&nbsp;<a class='lnk btnYes' ng-click='rejectOvlp(" + e.value + ")'><i class='intelicon-check' style='font-size: 12px !important;'></i>Yes</a>";
                                }
                                else if (!hasResolved) {
                                    return "<span class=\"grpTitle\" style='font-weight:bold'>" + e.value + " </span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was found with an Active or Draft deal, in order you create this new deal would you like the System to change the End date of the deal?</span>&nbsp;<a class='undolnk' ng-click='acceptOvlp(" + e.value + ", \"N\")'><i class='intelicon-home-outlined intelicon-undo' style='font-size: 10px !important;padding-right: 3px;'></i>Undo</a>";
                                }
                                else {
                                    return "<span class=\"grpTitle\" style='font-weight:bold'>" + e.value + " </span> <i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;letter-spacing:0.07em '>Please correct and revalidate</span>";
                                }

                            },
                            filterable: { multi: true, search: true },
                            hidden: true
                        },
                        {
                            field: "OVLP_DEAL_OBJ_SID",
                            title: "Deal #",
                            width: "80px",
                            template: "<div class='ovlpCell'><a ng-click='gotoDealDetails(dataItem,#=OVLP_DEAL_OBJ_SID#)' class='btnDeal' style='cursor: pointer;'> #= OVLP_DEAL_OBJ_SID # </a></div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "CONTRACT_NBR",
                            title: "Contract",
                            template: "<div class='ovlpCell' title='#= CONTRACT_NM # ( #= CONTRACT_NBR # )'>#= CONTRACT_NM # ( #= CONTRACT_NBR # )</div>",
                            width: "160px",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "PRICE_STRATEGY",
                            title: "Pricing Strategy",
                            template: "<div class='ovlpCell' title='#= PRICE_STRATEGY_NM # ( #= PRICE_STRATEGY # )'>#= PRICE_STRATEGY_NM # ( #= PRICE_STRATEGY # )</div>",
                            width: "160px",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "PRICING_TABLES",
                            title: "Pricing Table",
                            template: "<div class='ovlpCell' title='#= PRICING_TABLES_NM # ( #= PRICING_TABLES # )'>#= PRICING_TABLES_NM # ( #= PRICING_TABLES # )</div>",
                            width: "120px",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "WF_STG_CD",
                            title: "Stage",
                            width: "80px",
                            template: "<div class='ovlpCell'> #= WF_STG_CD # </div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "CUST_ACCNT_DIV",
                            title: "Customer Division",
                            width: "120px",
                            template: "<div class='ovlpCell'> #= CUST_ACCNT_DIV # </div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "PRODUCT_NM",
                            title: "My Deals Product",
                            width: "120px",
                            template: "<div class='ovlpCell' title='#= PRODUCT_NM #'>#= PRODUCT_NM #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "GEO_COMBINED",
                            title: "Geo",
                            width: "100px",
                            template: "<div class='ovlpCell' title='#= GEO_COMBINED #'> #= GEO_COMBINED # </div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "SOLD_TO_ID",
                            title: "Sold To ID",
                            width: "120px",
                            template: "<div class='ovlpCell' title='#= SOLD_TO_ID #'> #= SOLD_TO_ID # </div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "START_DT",
                            title: "Deal Start Date",
                            width: "120px",
                            template: "<div class='ovlpCell'> #= kendo.toString(START_DT) # </div>",
                            groupable: false
                        },
                        {
                            field: "END_DT",
                            title: "Deal End Date",
                            width: "120px",
                            template: "<div class='ovlpCell'> #= kendo.toString(END_DT) # </div>",
                            groupable: false
                        },
                        {
                            field: "ECAP_PRICE",
                            title: "ECAP Price",
                            width: "120px",
                            template: "<div class='ovlpCell' ng-bind='(dataItem.ECAP_PRICE | currency)' title='#= ECAP_PRICE #'> #= kendo.parseFloat(ECAP_PRICE) # </div>",
                            format: "{0:c}",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "DEAL_COMB_TYPE",
                            title: "Additive",
                            template: "<div class='ovlpCell' title='#= DEAL_COMB_TYPE #'> #= DEAL_COMB_TYPE # </div>",
                            width: "120px",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "ECAP_TYPE",
                            title: "ECAP Type",
                            template: "<div class='ovlpCell' title='#= ECAP_TYPE #'> #= ECAP_TYPE # </div>",
                            width: "150px",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "MRKT_SEG",
                            title: "Market Segment",
                            template: "<div class='ovlpCell' title='#= MRKT_SEG #'> #= MRKT_SEG # </div>",
                            width: "150px",
                            filterable: { multi: true, search: true }
                        }
                    ]
                };

                $scope.$on('overlappingDealSearch', function (event) {
                    $scope.refresh();
                });

                $scope.refreshOverlappingDeals = function () {
                    $scope.overlappingDealsSetup();
                }

                $scope.overlappingDealsSetup = function () {
                    $scope.msg = "Looking for Overlapping Deals";
                    $scope.loading = true;

                    //var dealType = $scope.dealTypes[0];
                    //if (dealType.toUpperCase() === "ECAP" && $scope.isOverlapNeeded) {

                    //    util.console("Overlapping Deals Started");
                    //    $scope.$parent.$parent.setBusy("Overlapping Deals...", "Looking for Overlapping Deals!");
                    //    if (usrRole === "GA" || usrRole === "FSE") {
                    //        $scope.isOvlpAccess = true;
                    //    }
                    //    //Fetch Overlapping Data
                    //    var pricingTableID = $scope.parentRoot.curPricingTable.DC_ID;

                    var params = null;
                    var fn = null;

                    if ($scope.$root.ovlapObjType === "Contract") {
                        fn = objsetService.getOverlappingDealsFromContract;
                        params = $scope.$root.ovlapObjSids.join(",");
                    } else if ($scope.$root.ovlapObjType === "PricingStrategy") {
                        fn = objsetService.getOverlappingDealsFromPricingStrategy;
                        params = $scope.$root.ovlapObjSids.join(",");
                    } else if ($scope.$root.ovlapObjType === "PricingTable") {
                        fn = objsetService.getOverlappingDealsFromPricingTable;
                        params = $scope.$root.ovlapObjSids.join(",");
                    }

                    //Calling WEBAPI
                    if (fn !== null && typeof fn === 'function') {
                        fn(params)
                            .then(function (response) {
                                $scope.msg = "Done";
                                if (response.data) {
                                    var data = response.data.Data;

                                    $scope.drawGrid(response.data.Data);
                                }

                                $scope.$root.$broadcast("overlappingDealFinished", null);
                                $timeout(function () {
                                    $scope.loading = false;
                                }, 1000);

                            },
                            function (response) {
                                $scope.$root.$broadcast("overlappingDealFailed", response);
                                $scope.loading = false;
                            });
                    } else {
                        $scope.$root.$broadcast("overlappingDealFailed", null);
                        $scope.loading = false;
                    }

                }

                $scope.drawGrid = function (ovData) {
                    $scope.isOverlapping = ovData.length > 0;

                    //Calculate Error count
                    $scope.ovlpErrorCounter(ovData);

                    //Assigning Data to Overlapping GRID
                    $scope.ovlpData = ovData;

                    //Data massaging for END_DT
                    for (var i = 0; i < $scope.ovlpData.length; i++) {
                        //START DT massaging
                        var d = new Date($scope.ovlpData[i].START_DT);
                        $scope.ovlpData[i].START_DT = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

                        //END DT massaging
                        var d = new Date($scope.ovlpData[i].END_DT);
                        $scope.ovlpData[i].END_DT = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
                    }

                    $scope.ovlpDataSource.read();

                    //Saving data for RedoUndo
                    $scope.ovlpDataRep = angular.copy($scope.ovlpData);
                }

                if ($scope.objType === "local") {
                    $scope.loading = false;
                    if ($scope.$root.ovrlpData === undefined) $scope.$root.ovrlpData = [];
                    $scope.drawGrid($scope.$root.ovrlpData);
                } else if (!!$scope.$root.ovlapObjSids) {
                    $scope.overlappingDealsSetup();
                }

            }],
            link: function (scope, element, attrs) {

            }
        };
    }
})();