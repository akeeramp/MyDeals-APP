(function () {
    'use strict';

    angular
        .module('app.advancedSearch')
        .controller('tenderSearchController', tenderSearchController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    tenderSearchController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger', '$window', '$linq', '$location'];

    function tenderSearchController($scope, $state, $filter, $localStorage, $compile, $uibModal, $timeout, $q, objsetService, templatesService, logger, $window, $linq, $location) {

        kendo.culture().numberFormat.currency.pattern[0] = "-$n";

        $scope.$root.pc = null;

        $scope.operatorSettings = {
            "operators": [
                {
                    operator: "LIKE",
                    operCode: "contains",
                    label: "contains"
                },
                {
                    operator: "=",
                    operCode: "eq",
                    label: "equal to"
                },
                {
                    operator: "!=",
                    operCode: "neq",
                    label: "not equal to"
                },
                {
                    operator: "!=",
                    operCode: "ne",
                    label: "not equal to"
                },
                {
                    operator: "<",
                    operCode: "lt",
                    label: "less than"
                },
                {
                    operator: "<=",
                    operCode: "lte",
                    label: "less than or equal to"
                },
                {
                    operator: ">",
                    operCode: "gt",
                    label: "greater than"
                },
                {
                    operator: ">=",
                    operCode: "gte",
                    label: "greater than or equal to"
                }
            ],
            "types": [
                {
                    "type": "string",
                    "uiType": "textbox"
                },
                {
                    "type": "number",
                    "uiType": "numeric"
                },
                {
                    "type": "money",
                    "uiType": "numeric"
                },
                {
                    "type": "date",
                    "uiType": "datepicker"
                },
                {
                    "type": "list",
                    "uiType": "combobox"
                },
                {
                    "type": "bool",
                    "uiType": "checkbox"
                }
            ],
            "types2operator": [
                {
                    type: "number",
                    operator: ["<=", "<", "=", "!=", ">", ">="]
                },
                {
                    type: "money",
                    operator: ["<=", "<", "=", "!=", ">", ">="]
                },
                {
                    type: "date",
                    operator: ["<=", "<", "=", "!=", ">", ">="]
                },
                {
                    type: "string",
                    operator: ["=", "!=", "LIKE"]
                },
                {
                    type: "list",
                    operator: ["=", "!=", "LIKE"]
                },
                {
                    type: "bool",
                    operator: ["=", "!="]
                }
            ]
        }

        $scope.attributeSettings = [
        {
            field: "DC_ID",
            title: "&nbsp;",
            type: "number",
            width: 50,
            filterable: false,
            sortable: false,
            template:
                "<span id='dealTool_#=data.DC_ID#'><deal-tools-tender ng-model='dataItem' is-editable='true' ng-if='customFunc(root.canShowCheckBox, dataItem)'></deal-tools></span>",
            excelTemplate: " ",
            bypassExport: true
        }, {
            field: "BID_STATUS",
            title: "Bid Action",
            template: "<div id='cb_actn_#=data.DC_ID#'>#=gridUtils.getBidActions(data)#</div>",
            excelTemplate: "#=gridUtils.getBidActionsLabel(data)#</div>",
            type: "string",
            filterable: {
                ui: function(element) {
                    element.kendoDropDownList({
                        dataSource: {
                            data: [
                                "Lost",
                                "Won",
                                "Offer"
                            ]
                        },
                        optionLabel: "--Select Value--"
                    });
                },
                extra: false
            },
            width: 110
        }, {
            field: "DC_ID",
            title: "Deal",
            type: "number",
            width: 100,
            filterable: $scope.numObjFilter,
            template:
                "<a href='/advancedSearch\\#/gotoDeal/#=data.DC_ID#' target='_blank' class='objDealId'>#=data.DC_ID#</a>"
        }, {
            field: "CNTRCT_TITLE",
            title: "Contract Title",
            type: "string",
            width: 120,
            template:
                "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_TITLE#</a>"
        }, {
            field: "PRODUCT_FILTER",
            title: "Product",
            type: "string",
            width: 250,
            dimKey: 20,
            filterable: $scope.objFilter,
            template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
        }, {
            field: "TRKR_NBR",
            title: "Tracker #",
            type: "string",
            width: 210,
            dimKey: 20,
            filterable: $scope.objFilter,
            template: "<span id='trk_#= data.DC_ID #'>#= gridUtils.tenderDim(data, 'TRKR_NBR') #</span>"
        }, {
            field: "ECAP_PRICE",
            title: "ECAP Price",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: $scope.moneyObjFilter,
            template: "#= gridUtils.tenderDim(data, 'ECAP_PRICE', 'c') #"
        }, {
            field: "CAP",
            title: "CAP",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: $scope.moneyObjFilter,
            template: "#= gridUtils.tenderDim(data, 'CAP', 'c') #"
        }, {
            field: "YCS2_PRC_IRBT",
            title: "YCS2",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: $scope.moneyObjFilter,
            template: "#= gridUtils.tenderDim(data, 'YCS2_PRC_IRBT', 'c') #"
        }, {
            field: "START_DT",
            title: "Start Date",
            type: "date",
            template: "#= moment(START_DT).format('MM/DD/YYYY') #",
            width: 130
        }, {
            field: "END_DT",
            title: "End Date",
            type: "date",
            template: "#= moment(END_DT).format('MM/DD/YYYY') #",
            width: 130
        }, {
            field: "VOLUME",
            title: "Ceiling Vol",
            type: "number",
            width: 120
        }, {
            field: "OBJ_SET_TYPE_CD",
            title: "Type",
            type: "string",
            width: 100,
            filterable: {
                ui: function(element) {
                    element.kendoDropDownList({
                        dataSource: {
                            data: [
                                "ECAP",
                                "KIT"
                            ]
                        },
                        optionLabel: "--Select Value--"
                    });
                },
                extra: false
            }
        }, {
            field: "END_CUSTOMER_RETAIL",
            title: "End Customer",
            type: "string",
            width: 140
        }, {
            field: "SERVER_DEAL_TYPE",
            title: "SVR Deal Type",
            type: "string",
            width: 140,
            filterable: {
                ui: function(element) {
                    element.kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            type: 'json',
                            transport: {
                                read: {
                                    url: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP",
                                    type: "GET",
                                    dataType: "json"
                                }
                            }
                        }),
                        dataTextField: "DROP_DOWN",
                        dataValueField: "DROP_DOWN",
                        valuePrimitive: true
                    });
                },
                extra: false
            }
        }, {
            field: "Customer.CUST_NM",
            title: "OEM",
            type: "string",
            width: 140,
            filterable: {
                ui: function(element) {
                    element.kendoMultiSelect({
                        dataSource: new kendo.data.DataSource({
                            type: 'json',
                            transport: {
                                read: {
                                    url: "/api/Customers/GetMyCustomersNameInfo",
                                    type: "GET",
                                    dataType: "json"
                                }
                            }
                        }),
                        dataTextField: "CUST_NM",
                        dataValueField: "CUST_NM",
                        tagMode: "single",
                        valuePrimitive: true
                    });
                },
                extra: false
            }
            }, {
                field: "CUST_ACCNT_DIV",
                title: "Cust Division",
                type: "string",
                width: 140
            }, {
                field: "QLTR_PROJECT",
                title: "Project Name",
                type: "string",
                width: 140
            }, {
                field: "QLTR_BID_GEO",
                title: "Bid Geo",
                type: "string",
                width: 100
            }, {
                field: "GEO_COMBINED",
                title: "Geo",
                type: "string",
                width: 100
            }, {
                field: "CREDIT_VOLUME",
                title: "Credit Vol",
                type: "number",
                width: 120
            }, {
                field: "DEBIT_VOLUME",
                title: "Debit Vol",
                type: "number",
                width: 120
            }, {
                field: "NET_VOL_PAID",
                title: "Net Credited Volume",
                type: "number",
                filterable: false,
                sortable: false,
                width: 120
            }, {
                field: "CREDIT_AMT",
                title: "Credit Amt",
                type: "number",
                format: "{0:c}",
                width: 120
            }, {
                field: "DEBIT_AMT",
                title: "Debit Amt",
                type: "number",
                format: "{0:c}",
                width: 120
            }, {
                field: "TOT_QTY_PAID",
                title: "Total Qty Paid",
                type: "number",
                format: "{0:c}",
                filterable: false,
                sortable: false,
                width: 120
            }, {
                field: "BLLG_DT",
                title: "Last Credit Date",
                type: "string",
                template: "#= moment(BLLG_DT).format('MM/DD/YYYY') #",
                width: 140
            }, {
                field: "CRE_EMP_WWID",
                title: "Created By",
                type: "string",
                width: 120
            }, {
                field: "CRE_DTM",
                title: "Created Time",
                type: "string",
                template: "#= moment(CHG_DTM).format('MM/DD/YYYY HH:mm:ss') #",
                width: 140
            }, {
                field: "CHG_EMP_WWID",
                title: "Last Update By",
                type: "string",
                width: 120
            }, {
                field: "CHG_DTM",
                title: "Last Update Time",
                type: "string",
                template: "#= moment(CHG_DTM).format('MM/DD/YYYY HH:mm:ss') #",
                width: 140
            }
        ];

        $scope.options = {
            "messages": {
                "help": "<div style=\"margin-bottom: 5px; \"><b>Search Tip</b></div>Search by Deal #, End Customer, Project Name, Bid Status <span class=\"color: #666666; font-size: 10px;\">(Offer, Lost, Won)</span>, Product or Tracker #<br/><div style=\"color: #666666; margin: 5px 0;\">Example: <i>i7-5*, Offer</i></div>"
            },
            "busy": {
                "search": {
                    "title": "Searching...",
                    "message": "Searching for Tender Deals"
                },
                "export": {
                    "title": "Exporting to Excel...",
                    "message": "Please be aware this may take some time."
                }
            },
            "customToolbarTemplate": "custom-toolbar",
            "url": function () {
                var st = $scope.startDt.replace(/\//g, '-');
                var en = $scope.endDt.replace(/\//g, '-');
                var searchText = $scope.searchText === null || $scope.searchText === undefined || $scope.searchText === "" ? "null" : $scope.searchText;
                var url = "/api/Search/GetTenderList/" + st + "/" + en + "/" + ($scope.activeOnlyEnabled ? 1 : 0) + "/" + searchText;
                $scope.savingToExcel = false;
                return url;
            }
        };

        $scope.$storage = $localStorage;

        $scope.$storage = $localStorage.$default({
            startDate: moment().subtract(6, 'months').format("MM/DD/YYYY"),
            endDate: moment().add(6, 'months').format("MM/DD/YYYY")
        });

        $scope.toggleActive = function () {
            $scope.activeOnlyEnabled = !$scope.activeOnlyEnabled;
        }

        // init dashboard
        $scope.startDt = $scope.$storage.startDate;
        $scope.endDt = $scope.$storage.endDate;
        $scope.customers = [];
        $scope.searchText = $location.search().id;
        $scope.activeOnlyEnabled = true;

        $scope.changeDt = function (st, en) {
            $scope.$storage.startDate = st;
            $scope.$storage.endDate = en;
        }

        $scope.canShowCheckBox = function (dataItem, scope) {
            if (dataItem.BID_ACTNS === undefined) return "";
            return dataItem.BID_ACTNS.length > 1 && (scope.curLinkedVal === "" || scope.curLinkedVal === dataItem.BID_STATUS);
        }

        $scope.chkClick = function (dataItem, scope) {
            var isLinked = dataItem.isLinked;
            if (isLinked) {
                scope.curLinkedVal = dataItem.BID_STATUS;
            } else {
                var data = scope.ds.data();
                var linkedData = $linq.Enumerable().From(data)
                                .Where(function (x) {
                                    return (x.isLinked);
                                }).ToArray();
                if (linkedData.length === 0) scope.curLinkedVal = "";
            }
        }

        $scope.uncheckAll = function() {
            var dsData = scope.ds.data();
            for (var d = 0; d < dsData.length; d++) {
                if (dsData[d].isLinked) {
                    dsData[d].set("isLinked", false);
                }
            }

        }

        $scope.changeBidAction = function (dataItem, scope) {
            var newVal = dataItem.BID_STATUS;
            var dsData = scope.ds.data();
            var tenders = [];

            // now update all checked items if the current one is checked
            if (dataItem.isLinked) {
                for (var d = 0; d < dsData.length; d++) {
                    if (dsData[d].isLinked) {
                        dsData[d].BID_STATUS = newVal;
                        tenders.push({
                            DC_ID: dsData[d].DC_ID,
                            CNTRCT_OBJ_SID: dsData[d].CNTRCT_OBJ_SID,
                            CUST_MBR_SID: dsData[d].CUST_MBR_SID
                        });
                    }
                }
            } else {
                tenders.push({
                    DC_ID: dataItem.DC_ID,
                    CNTRCT_OBJ_SID: dataItem.CNTRCT_OBJ_SID,
                    CUST_MBR_SID: dataItem.CUST_MBR_SID
                });
            }

            var plural = tenders.length > 1 ? "s" : "";
            var msg = "";
            if (newVal === "Won") msg = "Would you like to mark the Tender Deal" + plural + " as 'Won'?  This will generate a Tracker Number.";
            if (newVal === "Lost") msg = "Would you like to mark the Tender Deal" + plural + " as 'Lost'?";
            if (newVal === "Offer") msg = "Would you like to re-open the Tender Deal" + plural + " and set to 'Offer'?";

            kendo.confirm(msg)
                .then(function () {
                    //Save the changes
                    $scope.actionTenderDeals(tenders, newVal, scope);
                },
                function () {
                    var dropdownlist, indx, lis, i;

                    if (dataItem.isLinked) {
                        for (var d = 0; d < dsData.length; d++) {
                            if (dsData[d].isLinked) {
                                dsData[d].BID_STATUS = dataItem["orig_BID_STATUS"];
                                dropdownlist = $("#ddListStat_" + dsData[d].DC_ID).data("kendoDropDownList");
                                indx = 0;
                                lis = dropdownlist.ul.children();
                                for (i = 0; i < lis.length; i++) {
                                    if (lis[i].textContent === dsData[d]["orig_BID_STATUS"]) indx = i;
                                }
                                dropdownlist.select(indx);
                                dsData[d].set("isLinked", false);
                            }
                        }
                    } else {
                        dropdownlist = $("#ddListStat_" + dataItem.DC_ID).data("kendoDropDownList");
                        indx = 0;
                        lis = dropdownlist.ul.children();
                        for (i = 0; i < lis.length; i++) {
                            if (lis[i].textContent === dataItem["orig_BID_STATUS"]) indx = i;
                        }
                        dropdownlist.select(indx);
                    }

                });

        }

        $scope.actionTenderDeals = function (tenders, actn, scope) {
            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Action Tenders", "");
            var pc = new perfCacheBlock("Action tenders", "UX");

            scope.setBusy("Updating Tender Bids...", "Please wait as we update the Tender Deals!");
            var pcService = new perfCacheBlock("Update Actions to Tenders", "MT");
            objsetService.actionTenderDeals(tenders, actn).then(
                function (results) {
                    pcService.addPerfTimes(results.data.PerformanceTimes);
                    pc.add(pcService.stop());
                    var pcUI = new perfCacheBlock("Processing returned data", "UI");

                    var foundIt = false;
                    var noDeals = [];
                    scope.messages = results.data.Data.Messages;

                    var dsData = scope.ds.data();
                    for (var m = 0; m < scope.messages.length; m++) {
                        if (scope.messages[m].Message === "Action List") {
                            foundIt = true;
                            var details = scope.messages[m].ExtraDetails;
                            for (var d = 0; d < dsData.length; d++) {
                                if (details[dsData[d].DC_ID] !== undefined) {
                                    $("#trk_" + dsData[d].DC_ID).html(details[dsData[d].DC_ID].join(", "));
                                    $("#cb_actn_" + dsData[d].DC_ID).html('<div style="text-align: center; width: 100%;" class="ng-binding">Won</div>');
                                    $("#dealTool_" + dsData[d].DC_ID).html('');
                                    dsData[d].isLinked = false;
                                }

                                // if linked, clear out the check boxes
                                if (dsData[d].isLinked) {
                                    //dsData[d].isLinked = false;
                                    dsData[d].set("isLinked", false);
                                }

                            }
                        }
                        else if (scope.messages[m].Message === "No Deal") {
                            noDeals.push(scope.messages[m].ExtraDetails);
                        }
                    }

                    pc.add(pcUI.stop());
                    $scope.$root.pc.add(pc.stop());
                    $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                    $scope.$root.pc = null;


                    if (noDeals.length > 0) {
                        kendo.alert("It looks like one or more deals were deleted.  We need to refresh the data.");
                        $scope.$broadcast('reload-search-dataSource');
                    } else if (foundIt) {
                        scope.curLinkedVal = "";
                        $timeout(function () {
                            scope.setBusy("", "");
                        }, 50);
                        //scope.ds.read(); // we rely on the DS post load to close down the busy indicator
                    } else {
                        $timeout(function () {
                            scope.setBusy("", "");
                        }, 50);
                    }

                },
                function (result) {
                    //debugger;
                }
            );
        }

        $scope.$on('attribute-datasource-end', function (event, data) {
            for (var d = 0; d < data.length; d++) {                
                var cVol = data[d]["CREDIT_VOLUME"] === undefined || data[d]["CREDIT_VOLUME"] === "" ? 0 : parseFloat(data[d]["CREDIT_VOLUME"]);
                var dVol = data[d]["DEBIT_VOLUME"] === undefined || data[d]["DEBIT_VOLUME"] === "" ? 0 : parseFloat(data[d]["DEBIT_VOLUME"]);
                var cAmt = data[d]["CREDIT_AMT"] === undefined || data[d]["CREDIT_AMT"] === "" ? 0 : parseFloat(data[d]["CREDIT_AMT"]);
                var dAmt = data[d]["DEBIT_AMT"] === undefined || data[d]["DEBIT_AMT"] === "" ? 0 : parseFloat(data[d]["DEBIT_AMT"]);

                data[d]["NET_VOL_PAID"] = cVol - dVol !== 0 ? cVol - dVol : "";
                data[d]["TOT_QTY_PAID"] = cAmt + dAmt !== 0 ? cAmt + dAmt : "";
            }
        });

        function resizeGrid() {
            var h = window.innerHeight - $(".navbar").height() - 15;
            $("#attributeGrid").css("height", h);
            $("#attributeGrid .k-grid").data("kendoGrid").resize();
        }

        $($window).resize(function () {
            resizeGrid();
        });

        $timeout(function () {
            resizeGrid();
        }, 500);

        // initially load data
        $timeout(function () {
            $scope.$broadcast('reload-search-dataSource');
        }, 1000);

    }
})();