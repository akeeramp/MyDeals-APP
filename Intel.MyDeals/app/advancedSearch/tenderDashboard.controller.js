(function () {
    'use strict';

    angular
        .module('app.advancedSearch')
        .controller('tenderDashboardController', tenderDashboardController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    tenderDashboardController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$uibModalStack', '$timeout', '$q', 'objsetService', 'templatesService', 'securityService', '$location', 'logger', '$window', 'opGridTemplate', '$linq', '$rootScope', 'colorDictionary', 'dataService', 'maxRecordCountConstant'];

    function tenderDashboardController($scope, $state, $filter, $localStorage, $compile, $uibModal, $uibModalStack, $timeout, $q, objsetService, templatesService, securityService, $location, logger, $window, opGridTemplate, $linq, $rootScope, colorDictionary, dataService, maxRecordCountConstant) {

        kendo.culture().numberFormat.currency.pattern[0] = "-$n";
        document.title = "Tender Dashboard - My Deals";
        $scope.uid = -101;
        var maxRecordCount = maxRecordCountConstant.data;

        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
        var kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"]; //TODO: this is a copy of a hard-coded list of strings from contract.controller.js - ideally we move this into some sort of global file and reference from there at least.

        $scope.contractData = [];
        $scope.templates = [];

        $scope.C_VIEW_ATTACHMENTS = securityService.chkDealRules('C_VIEW_ATTACHMENTS', window.usrRole, null, null, null);
        $scope.C_ADD_ATTACHMENTS = securityService.chkDealRules('C_ADD_ATTACHMENTS', window.usrRole, null, null, null);
        $scope.C_DELETE_CONTRACT = securityService.chkDealRules('C_DELETE_CONTRACT', window.usrRole, null, null, null);


        $scope.$on('btnPctMctRunning', function (event, args) {
            $scope.setBusy("Running", "Price Cost Test and Meet Comp Test.", "Info", true);
        });

        $scope.$on('btnPctMctComplete', function (event, args) {
            $scope.setBusy("Complete", "Reloading the page now.", "Success");
            $timeout(function () {
                $scope.setBusy("", "");
            }, 2000);
        });

        $scope.refreshContractData = function (id, ptId) {
            objsetService.readContract($scope.contractData.DC_ID).then(function (data) {
                $scope.contractData = $scope.initContract(data);
                $scope.contractData.CUST_ACCNT_DIV_UI = "";

                // if the current strategy was changed, update it
                if (id != undefined && $scope.curPricingStrategyId === id) {
                    $scope.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, id);
                    if (id != undefined && $scope.curPricingTableId === ptId && !!$scope.curPricingStrategy) {
                        $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, ptId);
                    }
                }

                //$scope.OverrideDeleteContract();

                $scope.$broadcast('refreshContractDataComplete');

                $timeout(function () {
                    $scope.$apply();
                });
            });
        }

        templatesService.readTemplates()
            .then(function (response) {
                $scope.templates = response.data;
                $scope.addCustomToTemplates();
            })
            .catch(function (data) {
                console.log('Template Retrieval Failed');
            });


        $scope.showSearchFilters = true;
        $scope.ruleToRun = null;
        $scope.runSearch = false;
        var approveDeals = false;

        $scope.filterDealTypes = function (items) {
            var result = {};
            return result;
        }

        $scope.clearPtTemplateIcons = function () {
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    value._custom._active = false;
                });
        }
        $scope.selectPtTemplateIcon = function (ptTmplt) {
            $scope.clearPtTemplateIcons();
            ptTmplt._custom._active = true;
        }

        $scope.getColorStyle = function (c) {
            var k = 'pct';
            if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                return { color: colorDictionary[k][c] };
            }
            return "#aaaaaa";
        }

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
                    operator: "IN",
                    operCode: "in",
                    label: "in"
                },
                {
                    operator: "!=",
                    operCode: "neq",
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
                    "type": "singleselect",
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
                    operator: ["<=", "<", "=", "!=", ">", ">=", "IN"]
                },
                {
                    type: "money",
                    operator: ["<=", "<", "=", "!=", ">", ">=", "IN"]
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
                    operator: ["=", "LIKE"]
                },
                {
                    type: "singleselect",
                    operator: ["="]
                },
                {
                    type: "bool",
                    operator: ["=", "!="]
                }
            ]
        }

        $scope.attributeSettings = [
            {
                field: "Customer.CUST_NM",
                title: "Customer",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
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
                },
                lookupText: "CUST_NM",
                lookupValue: "CUST_NM",
                lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
            }, {
                field: "CUST_ACCNT_DIV",
                title: "Division",
                type: "string",
                width: 140
            }, {
                field: "CNTRCT_TITLE",
                title: "Folio Title",
                type: "string",
                width: 140,
                template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_TITLE#</a>"
            }, {
                field: "PRC_ST_OBJ_SID",
                title: "Pricing Strategy Id",
                type: "number",
                filterable: "numObjFilter",
                width: 140,
                template: "<a href='/advancedSearch\\#/gotoPs/#=data.PRC_ST_OBJ_SID#' target='_blank' class='objDealId'>#=data.PRC_ST_OBJ_SID#</a>"
            }, {
                field: "CNTRCT_OBJ_SID",
                title: "Folio Id",
                type: "number",
                width: 110,
                template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_OBJ_SID#</a>"
            }, {
                field: "DC_ID",
                title: "Deal",
                type: "number",
                width: 100,
                filterable: "numObjFilter",
                template: "<deal-popup-icon deal-id=\"'#=data.DC_ID#'\"></deal-popup-icon><a href='/advancedSearch\\#/gotoDeal/#=data.DC_ID#' target='_blank' class='objDealId'>#=data.DC_ID#</a>"
            }, {
                field: "WF_STG_CD",
                title: "Deal Status",
                type: "list",
                width: 140,
                template: "#=gridUtils.stgFullTitleChar(data)#",
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: {
                                data: [
                                    "Draft",
                                    "Requested",
                                    "Submitted",
                                    "Won",
                                    "Offer",
                                    "Lost",
                                    "Cancelled"
                                ]
                            },
                            optionLabel: "--Select Status--"
                        });
                    },
                    extra: false
                },
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [
                    { Value: "Draft" },
                    { Value: "Requested" },
                    { Value: "Submitted" },
                    { Value: "Won" },
                    { Value: "Offer" },
                    { Value: "Lost" },
                    { Value: "Cancelled" }
                ]

            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Deal Type",
                type: "singleselect",
                width: 130,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: {
                                data: [
                                    "ECAP",
                                    "KIT"       //tenders only have ecap/kit deal type
                                ]
                            },
                            optionLabel: "--Select Value--"
                        });
                    },
                    extra: false
                },
                lookupText: "OBJ_SET_TYPE_NM",
                lookupValue: "OBJ_SET_TYPE_CD",
                lookups: [
                    { OBJ_SET_TYPE_CD: "ECAP", OBJ_SET_TYPE_NM: "ECAP" },
                    { OBJ_SET_TYPE_CD: "KIT", OBJ_SET_TYPE_NM: "KIT" }
                ]
            }, {
                field: "DEAL_DESC",
                title: "Deal Description",
                type: "string",
                width: 210,
                filterable: "objFilter",
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
                field: "PRODUCT_CATEGORIES",
                title: "Product Verticals",
                type: "list",
                width: 150,
                filterable: "listMultiProdCatFilter",
                lookupText: "PRD_CAT_NM",
                lookupValue: "PRD_CAT_NM",
                lookupUrl: "/api/Products/GetProductCategories"
            }, {
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 400,
                dimKey: 20,
                filterable: "objFilter",
                template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
            }, {
                field: "MRKT_SEG",
                title: "Market Segment",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                type: 'json',
                                transport: {
                                    read: {
                                        url: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG",
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
                },
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
            }, {
                field: "TRKR_NBR",
                title: "Tracker #",
                type: "string",
                width: 210,
                dimKey: 20,
                filterable: "objFilter",
                template: "<span id='trk_#= data.DC_ID #'>#= gridUtils.tenderDim(data, 'TRKR_NBR') #</span>"
            }, {
                field: "CAP",
                title: "CAP",
                type: "money",
                width: 170,
                dimKey: 20,
                format: "{0:c}",
                filterable: "moneyObjFilter",
                template: "#= gridUtils.tenderDim(data, 'CAP', 'c') #"
            }, {
                field: "ECAP_PRICE",
                title: "ECAP Price",
                type: "money",
                width: 170,
                dimKey: 20,
                format: "{0:c}",
                filterable: "moneyObjFilter",
                template: "#= gridUtils.tenderDim(data, 'ECAP_PRICE', 'c') #"
            }, {
                field: "VOLUME",
                title: "Ceiling Vol",
                type: "number",
                width: 120
            }, {
                field: "PROGRAM_PAYMENT",
                title: "Program Payment",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                type: 'json',
                                transport: {
                                    read: {
                                        url: "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT",
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
                },
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT"
            }, {
                field: "PAYOUT_BASED_ON",
                title: "Payout Based On",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                type: 'json',
                                transport: {
                                    read: {
                                        url: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON",
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
                },
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
            }, {
                field: "SERVER_DEAL_TYPE",
                title: "Server Deal Type",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
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
                },
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
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
                template: "# if (BLLG_DT !== undefined) { # #=moment(BLLG_DT).format('MM/DD/YYYY')# # } #",
                width: 140
            }, {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string",
                width: 140
            }, {
                field: "QUOTE_LN_ID",
                title: "Quote Line Id",
                type: "string",
                width: 140
            }, {
                field: "DEAL_GRP_NM ",
                title: "Kit Name",
                type: "string",
                width: 140
            }, {
                field: "NOTES",
                title: "Comments / notes",
                type: "string",
                width: 250
            }, {
                field: "GEO_APPROVED_BY",
                title: "GEO Approved By",
                type: "string",
                width: 160
            }, {
                field: "DIV_APPROVED_BY",
                title: "DIV Approved By",
                type: "string",
                width: 160
            }, {
                field: "CRE_EMP_NAME",
                title: "Created By",
                type: "string",
                width: 160
            }, {
                field: "CRE_DTM",
                title: "Created Time",
                type: "string",
                template: "#= moment(CHG_DTM).format('MM/DD/YYYY HH:mm:ss') #",
                width: 140
            }
        ];

        $scope.$storage = $localStorage;

        $scope.customSettings = [];

        var qm = $location.search();
        angular.forEach(qm, function (value, key) {
            if (key.toLowerCase() == "dealtype") {
                $scope.customSettings.push({
                    field: "OBJ_SET_TYPE_CD",
                    operator: "=",
                    value: value.toUpperCase(),
                    source: null
                });
            }
            if (key.toLowerCase() == "folioid") {
                $scope.customSettings.push({
                    field: "CNTRCT_OBJ_SID",
                    operator: "=",
                    value: value,
                    source: null
                });
            }
            if (key.toLowerCase() == "psid") {
                $scope.customSettings.push({
                    field: "PRC_ST_OBJ_SID",
                    operator: "=",
                    value: parseInt(value),
                    source: null
                });
            }
            if (key.toLowerCase() == "ptid") {
                $scope.customSettings.push({
                    field: "PRC_ST_OBJ_SID",
                    operator: "=",
                    value: parseInt(value),
                    source: null
                });
            }
            if (key.toLowerCase() == "deal") {
                $scope.customSettings.push({
                    field: "DC_ID",
                    operator: "=",
                    value: parseInt(value),
                    source: null
                });
            }
            if (key.toLowerCase() == "search") {
                $scope.runSearch = true
            }
            if (key.toLowerCase() == "approvedeals") {
                approveDeals = true
            }
        });

        if ($scope.customSettings.length === 0) {
            $scope.customSettings = [{
                field: "OBJ_SET_TYPE_CD",
                operator: "=",
                value: "ECAP",
                source: null
            }, {
                field: "END_CUSTOMER_RETAIL",
                operator: "LIKE",
                value: "",
                source: null
            }, {
                field: "QUOTE_LN_ID",
                operator: "LIKE",
                value: "",
                source: null
            }];
        }

        if (window.usrRole === "DA") {
            $scope.customSettings.splice(1, 0, {
                field: "WF_STG_CD",
                operator: "=",
                value: ["Submitted", "Approved", "Won", "Offer", "Lost"],
                source: null
            })
        }

        $scope.$storage = $localStorage.$default({
            startDate: moment().subtract(6, 'months').format("MM/DD/YYYY"),
            endDate: moment().add(6, 'months').format("MM/DD/YYYY")
        });

        // init dashboard
        $scope.startDt = $scope.$storage.startDate;
        $scope.endDt = $scope.$storage.endDate;
        $scope.customers = []; //$scope.$storage.selectedCustomerIds;
        $scope.searchText = "";

        $scope.customersDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Customers/GetMyCustomersNameInfo",
                    dataType: "json"
                }
            },
            requestEnd: function (e) {
                if ($scope.$storage.selectedCustomerIds === undefined || $scope.$storage.selectedCustomerIds.length === 0) return;

                var data = e.response;
                if (data != null) {
                    for (var d = 0; d < data.length; d++) {
                        if ($scope.$storage.selectedCustomerIds.indexOf(data[d].CUST_SID) >= 0) {
                            $scope.customers.push(data[d].CUST_NM);
                        }
                    }
                }
            }
        });

        $scope.toggleFilters = function () {
            $scope.showSearchFilters = !$scope.showSearchFilters;
            $timeout(function () {
                resizeGrid();
            }, 100);
        }

        $scope.showCustomers = function () {
            if ($scope.customers === undefined) return "";

            return $scope.customers.join(", ");
        }

        $scope.wipOptions = {};
        $scope.wipOptions.default = {};
        $scope.helpTopic = HelpTopicEnum.DealEditor_Features;
        $scope.wipData = [];

        $scope.saveCell = function (dataItem, newField) {
            if (dataItem._behaviors === undefined) dataItem._behaviors = {};
            if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[newField] = true;
            dataItem._dirty = true;
            $scope._dirty = true;
        }

        $scope.validateWipDeals = function (callback) {
            $scope.saveWIPBase(callback);
        }

        //createWIPContractBase is a slimmed down version of contract.controller's createEntireContractBase where everything except the wipdeal logic is cut
        $scope.createWIPBase = function () {
            var gData = $scope.wipData;
            var errs = {};
            var needPrdVld = [];

            var curPricingTableData = [];

            // Wip Deal
            if (gData !== undefined && gData !== null) {
                for (var i = 0; i < gData.length; i++) {

                    if (gData[i]["_dirty"] == undefined || gData[i]["_dirty"] == null) { continue; }   //we filter out everything without the dirty flag later anyways so let's just ignore and not process that data

                    // convert array types to strings which the middle tier expects
                    // Kindof a lame hack... should make it more dynamic, but for now let's see if we can get this working
                    if (Array.isArray(gData[i].TRGT_RGN)) gData[i].TRGT_RGN = gData[i].TRGT_RGN.join();
                    if (Array.isArray(gData[i].QLTR_BID_GEO)) gData[i].QLTR_BID_GEO = gData[i].QLTR_BID_GEO.join();
                    if (Array.isArray(gData[i].DEAL_SOLD_TO_ID)) gData[i].DEAL_SOLD_TO_ID = gData[i].DEAL_SOLD_TO_ID.join();

                    var fields = $scope.templates.ModelTemplates.WIP_DEAL[$scope.dealType].model.fields;
                    for (var key in fields) {
                        if (fields.hasOwnProperty(key)) {
                            if (fields[key].type === "date") {
                                gData[i][key] = moment(gData[i][key]).format("MM/DD/YYYY");
                            }
                        }
                    }

                    // This is silly hardcoding because these are not in our template and they are used by DSA only - set them to proper dates.
                    if (gData[i]["ON_ADD_DT"] !== undefined) gData[i]["ON_ADD_DT"] = moment(gData[i]["ON_ADD_DT"]).format("MM/DD/YYYY");
                    if (gData[i]["REBATE_BILLING_START"] !== undefined) gData[i]["REBATE_BILLING_START"] = moment(gData[i]["REBATE_BILLING_START"]).format("MM/DD/YYYY");
                    if (gData[i]["REBATE_BILLING_END"] !== undefined) gData[i]["REBATE_BILLING_END"] = moment(gData[i]["REBATE_BILLING_END"]).format("MM/DD/YYYY");
                }
            }


            return {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [],
                "PricingTableRow": [],
                "WipDeals": gData === undefined ? [] : gData.filter(function (a) { return a._dirty }),
                "EventSource": "WIP_DEAL",
                "Errors": errs
            }
        }

        $scope.saveWIPBase = function (callback) {
            // if save already started saving... exit
            // if validate triggers from product translation continue..validating data
            if ($scope.isBusyMsgTitle !== "Saving your data..." && $scope.isBusyMsgTitle !== "Validating your data..." && $scope.isBusyMsgTitle !== "Overlapping Deals...") {
                if (!!$scope.isBusyMsgTitle && $scope.isBusyMsgTitle !== "") return;
            }

            $scope.saveWIPRoot(callback);

            return;
        }

        $scope.saveWIPRoot = function (callback) {

            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Contract Controller", "");
            var pc = new perfCacheBlock("Save Contract Root", "UX");
            var pcUi = new perfCacheBlock("Gather data to pass", "UI");

            //$scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);

            var data = $scope.createWIPBase();
            pc.mark("Built data structure");

            // If there are critical errors like bad dates, we need to stop immediately and have the user fix them
            if (!!data.Errors && !angular.equals(data.Errors, {})) {
                logger.warning("Please fix validation errors before proceeding", $scope.contractData, "");
                $scope.syncCellValidationsOnAllRows($scope.pricingTableData["PRC_TBL_ROW"]); /////////////
                $scope.setBusy("", "");
                return;
            }

            var copyData = util.deepClone(data);


            pc.add(pcUi.stop());
            var pcService = new perfCacheBlock("Update Contract And CurPricing Table", "MT");

            objsetService.bulkTenderUpdate(copyData).then(
                function (results) {

                    var data = results.data.Data;

                    pcService.addPerfTimes(results.data.PerformanceTimes);
                    pc.add(pcService.stop());
                    var pcUI = new perfCacheBlock("Processing returned data", "UI");
                    //util.console("updateContractAndCurPricingTable Returned");

                    $scope.setBusy("Saving your data...Done", "Processing results now!", "Info", true);

                    var anyWarnings = false;

                    pc.mark("Constructing returnset");

                    if (!!data.WIP_DEAL) {
                        for (i = 0; i < data.WIP_DEAL.length; i++) {
                            var dataItem = data.WIP_DEAL[i];
                            if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;

                            if (anyWarnings) {
                                var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                                var isKit = 0;
                                var relevantAtrbs = tierAtrbs;
                                var tierCount = dataItem.NUM_OF_TIERS;

                                if ($scope.dealType === "KIT") {
                                    if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                                    dimStr = "_20___";
                                    isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                                    relevantAtrbs = kitDimAtrbs;
                                    tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                                }
                                // map tiered warnings
                                for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                                    for (var a = 0; a < relevantAtrbs.length; a++) {
                                        mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);
                                    }
                                }
                            }
                        }
                        $scope.updateResults(data.WIP_DEAL, $scope.pricingTableData === undefined ? [] : $scope.pricingTableData.WIP_DEAL);
                    }

                    if (!anyWarnings) {
                        //$scope.stealthMode = true;
                        $scope.setBusy("Save Successful", "Saved the contract", "Success");
                        $scope.$broadcast('saveComplete', data);
                        $scope.resetDirty();

                        $timeout(function () {
                            //if ($scope.isBusyMsgTitle !== "Overlapping Deals...")
                            $scope.setBusy("", "");
                            //$scope.stealthMode = false;
                        }, 1000);


                    } else {
                        $scope.setBusy("Saved with warnings", "Didn't pass Validation", "Warning");
                        $scope.$broadcast('saveWithWarnings', data);
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 2000);
                    }

                    $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);  //JEFFTODO: investigate, do we need this?

                    var wip_ids = [];
                    for (var i = 0; i < data.WIP_DEAL.length; i++) {
                        wip_ids.push(data.WIP_DEAL[i]["DC_ID"]);
                    }

                    $scope.refreshGridRows(wip_ids, data["WIP_DEAL"]);

                    document.getElementById('chkDealTools').checked = false;    //as the save will automatically reset all checkboxes of deals that were saved, we will go ahead and uncheck the check-all box as well in the event that it was used.

                    //util.console("updateContractAndCurPricingTable Complete");

                    //if a callback function is provided, invoke it now once everything else is completed
                    if (!!callback && typeof callback === "function") {
                        callback();
                        pc.add(pcUI.stop());
                        if ($scope.$root.pc !== null) $scope.$root.pc.add(pc.stop());
                    } else {
                        pc.add(pcUI.stop());
                        if ($scope.$root.pc !== null) {
                            $scope.$root.pc.add(pc.stop());
                            $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                            $scope.$root.pc = null;
                        }
                    }

                },
                function (response) {
                    $scope.setBusy("Error", "Could not save tenders.", "Error");
                    logger.error("Could not save tenders.", response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    //$scope.isAutoSaving = false;
                }
            );
        }

        //this function will trigger the grid to update information for the rows associated with the passed in array of wip deal ids.
        //if wip data is not provided, it will go to the middle tier to retrieve it.
        //make sure that if you do provide wip_data, it is wip data that has gone through the FetchTenderData() in PricingStrategiesLib.cs as that formats the data to how we need it.
        $scope.refreshGridRows = function (wip_ids, wip_data) {
            if (wip_data == null) {
                //if no provided wip data, then we need to go to the middle tier and get it ourselves.
                objsetService.getTendersByIds(wip_ids.join()).then(
                    function (results) {
                        $scope.refreshGridRowsHelper(wip_ids, results.data);
                    },
                    function (response) {
                        $scope.setBusy("Error", "Could not refresh tenders.", "Error");
                        logger.error("Could not refresh tenders dashboard.", response, response.statusText);
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 2000);
                    }
                );
            } else {
                $scope.refreshGridRowsHelper(wip_ids, wip_data);
            }
        }

        $scope.refreshGridRowsHelper = function (wip_ids, wip_data) {
            for (var dsIndex = 0; dsIndex < $scope.wipData.length; dsIndex++) {
                for (var wipIndex = 0; wipIndex < wip_data.length; wipIndex++) {
                    if ($scope.wipData[dsIndex]["DC_ID"] == wip_data[wipIndex]["DC_ID"]) {
                        //found the updated wip deal in the bound datasource
                        var contractId = $scope.wipData[dsIndex]["CNTRCT_OBJ_SID"];
                        var psId = $scope.wipData[dsIndex]["PRC_ST_OBJ_SID"];
                        $scope.wipData[dsIndex] = wip_data[wipIndex]; //extradetails contains the myDealsData of the wip deal that was updated and would have updated security flags we can utilize
                        $scope.wipData[dsIndex]["CNTRCT_OBJ_SID"] = contractId;
                        $scope.wipData[dsIndex]["PRC_ST_OBJ_SID"] = psId;
                        break;
                    }
                }
            }

            $("#dealEditor").data("kendoGrid").dataSource.read();
            $("#dealEditor").data("kendoGrid").refresh();
        }

        $scope.resetDirty = function () {
            $scope._dirty = false;
            //$scope._dirtyContractOnly = false;
        }

        function mapTieredWarnings(dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
            // Tier warning message (valid message and red highlight) to its specific tier
            // NOTE: this expects that tiered errors come in the form of a Dictionary<tier, message>
            if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
                if (dataItem._behaviors.validMsg[atrbName] != null) {
                    try {
                        // Parse the Dictionary json
                        var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                        if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                            // KIT ECAP
                            if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                                dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                                dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                            }
                        }

                        if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                            // Set the validation message
                            dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                            dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                        } else {
                            // Delete the tier-specific validation if it doesn't tie to this specific tier
                            delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                            delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                        }
                    } catch (e) {
                        // not Valid Json String
                        console.log("map tiered warnings - invalid json string")
                    }
                }
            }
        }

        $scope.setBusy = function (msg, detail, msgType, isShowFunFact, isInstant) { // msgType can be Success, Error, Warning, and Info
            if (isInstant == null) {
                isInstant = false;
            }

            if (isInstant) {
                $scope.setBusyBase(msg, detail, msgType, isShowFunFact);
            } else {
                $timeout(function () {
                    $scope.setBusyBase(msg, detail, msgType, isShowFunFact);
                });
            }
        }

        $scope.setBusyBase = function (msg, detail, msgType, isShowFunFact) {
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
        }

        $scope.updateResults = function (data, source) {
            //TODO: in the tender Dashboard the majority of code in this function that we imported from contract controller doesn't appear to be reachable.  need to research what their original intended purposes were.
            $scope.renameMapping = {};
            var i, p;
            if (data !== undefined && data !== null) {
                // look for actions -> this has to be first because remapping might happen
                for (i = 0; i < data.length; i++) {
                    if (data[i]["_actions"] !== undefined) {
                        var actions = data[i]["_actions"];
                        for (var a = 0; a < actions.length; a++) {
                            if (actions[a]["Action"] === "ID_CHANGE") {
                                if (Array.isArray(source)) {
                                    for (p = 0; p < source.length; p++) {
                                        $scope.mapActionIdChange(source[p], actions[a]);
                                    }
                                } else {
                                    $scope.mapActionIdChange(source, actions[a]);
                                }
                            }
                        }
                    }
                }

                // Now look for items that need to be updated
                for (i = 0; i < data.length; i++) {
                    if (data[i]["DC_ID"] !== undefined && data[i]["DC_ID"] !== null) {
                        if (Array.isArray(source)) {
                            for (p = 0; p < source.length; p++) {
                                if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = $scope.renameMapping[data[i]["DC_ID"]];
                                if (data[i]["DC_ID"] === source[p]["DC_ID"]) {
                                    $scope.mapProperty(source[p], data[i]);
                                }
                            }
                        } else {
                            if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = $scope.renameMapping[data[i]["DC_ID"]];
                            if (data[i]["DC_ID"] === source["DC_ID"]) $scope.mapProperty(source, data[i]);
                        }
                    }
                }
            }
        }

        $scope.mapActionIdChange = function (args) {
            console.log("TODO: A");
        }

        $scope.mapProperty = function (args) {
            console.log("TODO: C");
        }

        $scope.deletePricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Deleting...", "Deleting Tender Deal " + wip.DC_ID + " information");
                $scope._dirty = false;

                // Remove from DB first... then remove from screen
                objsetService.deletePricingStrategyById(wip.CUST_MBR_SID, wip._contractId, wip._parentIdPS).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Delete Failed", "Unable to Delete Tender Deal " + wip.DC_ID, "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.$broadcast('removeRow', wip.DC_PARENT_ID);
                        $scope.refreshContractData($scope.curPricingStrategyId);

                        $scope.setBusy("Delete Successful", "Deleted Tender Deal " + wip.DC_ID + " information", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                    },
                    function (response) {
                        logger.error("Could not delete the Tender Deal " + wip.DC_ID, response, response.statusText);
                        $scope.setBusy("", "");
                    }
                );
            });
        }

        $scope.rollbackPricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Rolling Back...", "Rolling Back the Deal");
                $scope._dirty = false;

                // Remove from DB first... then remove from screen
                objsetService.rollbackPricingTableRow(wip.CUST_MBR_SID, wip._contractId, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Rollback Failed", "Unable to Rollback the Deal", "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.refreshGridRows([wip.DC_ID], null);
                        $scope.setBusy("Rollback Successful", "Rollback of the Deal", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);

                        // You changed the deals list, just reload it.
                        //TODO need to issue a reload most likely
                    },
                    function (response) {
                        logger.error("Could not Rollback the Deal " + wip.DC_ID, response, response.statusText);
                        $scope.setBusy("", "");
                    }
                );
            });
        }

        $scope.actionWipDeal = function (wip, actn) {
            if (actn === "Cancel") {
                $scope.setBusy("Cancelling Wip Deal...", "Please wait as we cancel the Wip Deal!", "Info", true);
            } else {
                $scope.setBusy("Updating Wip Deal...", "Please wait as we update the Wip Deal!", "Info", true);
            }
            objsetService.actionWipDeal(wip.CUST_MBR_SID, wip._contractId, wip, actn).then(
                function (data) {
                    //$scope.syncHoldItems(data, { Cancel: [wip] });
                    $scope.$broadcast('refreshStage', { Cancel: [wip] });
                    $scope.setBusy("Cancel Successful", "Reloading the Deal", "Success");
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 4000);

                    // You changed the deals list, just reload it.
                    $scope.refreshGridRows([wip.DC_ID], null);
                },
                function (result) {
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.downloadQuoteLetter = function (customerSid, objTypeSid, objSid) {
            var downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + customerSid + "/" + objTypeSid + "/" + objSid + "/0";
            window.open(downloadPath, '_blank', '');
        }

        $scope.canDeleteAttachment = function (wf_st_cd) {
            return securityService.chkDealRules('C_DELETE_ATTACHMENTS', window.usrRole, null, null, wf_st_cd);
        }

        $scope.$on('OpGridDataBound',
            function (event, args) {
                ////TODO: investigate if we need to port any code over that happens on grid data bound.
            });


        $scope.$on('invoke-search-datasource', function (event, args) {
            $scope.ruleData = args.rule;

            if ($scope.ruleData[0].value == "ECAP" || $scope.ruleData[0].value == "KIT") {
                //reset wip options
                $scope.wipOptions = {};
                $scope.wipOptions.default = {};
                $scope.helpTopic = HelpTopicEnum.DealEditor_Features;
                $scope.wipData = [];
                //$('#dealEditor').data('kendoGrid').destroy().empty();   //TODO: new search, murder the grid to create a new one?  Do we need to clean up?

                var st = $scope.startDt.replace(/\//g, '-');
                var en = $scope.endDt.replace(/\//g, '-');
                var searchText = $scope.customers.length === 0 ? "null" : $scope.customers.join(',');

                $scope.setBusy("Searching...", "Search speed depends on how specific your search options are.", "Info", true, true);

                var take = 100;
                if (maxRecordCount !== undefined && maxRecordCount.CNST_VAL_TXT !== undefined && maxRecordCount.CNST_VAL_TXT !== null) {
                    take = Number.parseInt(maxRecordCount.CNST_VAL_TXT);
                    take = Number.isInteger(take) ? take : 100;
                    searchText = searchText + "?$top=" + (take - 1);
                } else {
                    searchText = searchText + "?$top=" + (take - 1);
                }
                toastr.clear();// Clear any sticky messages present
                objsetService.searchTender(st, en, searchText)
                    .then(function (response) {

                        // For DA check if he has access to Product vertical //Mike's managetab code
                        if (window.usrRole === "DA" && window.usrVerticals.length > 0) {
                            var userVerticals = window.usrVerticals.split(",");
                            for (var i = response.data.Items.length - 1; i >= 0; i--) {
                                // For tender deals hide these columns
                                var dataVerticals = response.data.Items[i].PRODUCT_CATEGORIES.split(",");
                                if (!util.findOne(dataVerticals, userVerticals)) {
                                    response.data.Items.splice(i, 1);
                                }
                            }
                        }

                        $scope.wipData = response.data.Items;
                        $scope.dealType = $scope.ruleData[0].value;

                        if ($scope.wipData.length == 0) {
                            var message = window.usrRole === "DA" ? "No results found. Try changing your search options or check your product category access." : "No results found. Try changing your search options."
                            $scope.setBusy("", "");
                            kendo.alert(message);
                        }

                        if (response.data['Count'] > take) {
                            var info = maxRecordCount.CNST_DESC != undefined ? maxRecordCount.CNST_DESC : "Your search options returned <b>" + response.data['Count'] + "</b> deals. Refine your search options"
                            info = info.replace("**", response.data['Count']);
                            logger.stickyInfo(info);
                        }

                        for (var w = 0; w < $scope.wipData.length; w++) {
                            var item = $scope.wipData[w];

                            // Get missing cap... but the message is too long and has line breaks... this will cause issues in the grid filter.
                            // Could replace the \n with spaces, but the text for filtering probably only needs the first sentence... let's split on the first \n

                            // -- first sentence version
                            item["MISSING_CAP_COST_INFO"] = gridUtils.getMissingCostCapTitle(item).split('\n')[0];
                            // -- Replace break version
                            //item["MISSING_CAP_COST_INFO"] = gridUtils.getMissingCostCapTitle(item).replace(/(?:\r\n|\r|\n)/g, ' ');

                            if (item._contractPublished !== undefined && item._contractPublished === 0) {
                                for (var k in item) {
                                    if (typeof item[k] !== 'function' && k[0] !== '_') {
                                        item._behaviors.isReadOnly[k] = true;
                                    }
                                }
                            }
                        }

                        //reset wip options
                        $scope.wipOptions = {
                            "default": {},
                            "isLayoutConfigurable": true,
                            //"isPricingTableEnabled": true,
                            "isVisibleAdditionalDiscounts": true,
                            "isExportable": true,
                            "isEditable": true,
                            "initSearchStr": "", //initSearchValue,
                            "exportableExcludeFields": ["CAP_INFO", "CUST_MBR_SID", "DC_PARENT_ID", "PASSED_VALIDATION", "YCS2_INFO", "details", "tools"]
                        };

                        $scope.wipOptions.columns = angular.copy($scope.templates.ModelTemplates.WIP_DEAL[$scope.dealType].columns);
                        for (var i = $scope.wipOptions.columns.length - 1; i >= 0; i--) {
                            if (opGridTemplate.hideForTender.indexOf($scope.wipOptions.columns[i].field) !== -1) {
                                $scope.wipOptions.columns.splice(i, 1);
                            }
                            //if (opGridTemplate.requiredForTender.indexOf($scope.wipOptions.columns[i].field) !== -1) {
                            //    break;
                            //    $scope.wipOptions.columns.splice(i, 1);
                            //}
                        }

                        $scope.wipOptions.model = angular.copy($scope.templates.ModelTemplates.WIP_DEAL[$scope.dealType].model);

                        opGridTemplate.hideForTender.forEach(function (x) {
                            delete $scope.wipOptions.model.fields[x];
                        });

                        $scope.wipOptions.default.groups = angular.copy(opGridTemplate.groups[$scope.dealType]);
                        $scope.wipOptions.default.groupColumns = angular.copy(opGridTemplate.templates[$scope.dealType]);

                        $scope.wipOptions.groups = $scope.wipOptions.default.groups
                        $scope.wipOptions.groupColumns = $scope.wipOptions.default.groupColumns;

                    }).catch(function (data) {
                        $scope.setBusy("", "");
                        kendo.alert("Tender Search Failed.  Please try again with more specific Search Options.");
                        console.log('Tender Search Failed');
                    });
            } else {
                $scope.setBusy("", "");
                kendo.alert("Please specify a Tender Deal Type");
            }
        });

        $scope.$on('search-rules-updated', function (event, args) {
            $scope.$broadcast('reload-search-rules', args);
        });

        $scope.$on("grid-datasource-read-complete", function (event, args) {
            resizeGrid();
            triggerApproveAction();
        });

        function triggerApproveAction() {
            // Once the grid is loaded trigger the Approve action
            if (approveDeals && usrRole === "DA") {
                $timeout(function () {
                    approveDeals = false;
                    $scope.$broadcast("check-tender-deals", "Approve");
                }, 500);
            }
        }

        $scope.$on("bid-actions-updated", function (event, args) {
            var newValue = args.newValue;
            var dataItem = args.dataItem;
            var gridDS = args.gridDS;
            if (newValue == dataItem.WF_STG_CD) return; //user selected the same item, aka we do nothing here and break out
            $scope.actionType = "BID";
            $scope.changeBidAction(dataItem, newValue, gridDS);
        });


        $scope.$on("approval-actions-updated", function (event, args) {
            var newValue = args.newValue;
            var dataItem = args.dataItem;
            var gridDS = args.gridDS;
            if (newValue == "Action") return;   //user selected the default non-item action so we break out here.
            $scope.actionType = "PS";
            $scope.changeBidAction(dataItem, newValue, gridDS);
        });

        $scope.addCustomToTemplates = function () {
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    value._custom = {
                        "ltr": value.name[0],
                        "_active": false
                    };
                });
        }

        $scope.removeBlanks = function (val) {
            return val.replace(/_/g, ' ');
        }

        $scope.changeBidAction = function (dataItem, newVal, gridDS) {
            var tenders = [];
            var linkedUnactionables = [];
            // if item is checked (linked) then we need to make sure all linked items are in the same stages otherwise we disallow the action
            if (dataItem.isLinked) {
                for (var d = 0; d < gridDS.length; d++) {
                    if (gridDS[d].isLinked) {
                        if (gridDS[d].WF_STG_CD != dataItem.WF_STG_CD || gridDS[d].PS_WF_STG_CD != dataItem.PS_WF_STG_CD) {
                            //mismatch detected, end execution and warn user
                            kendo.alert("The selected deals must be in the same Stage in order to do Actions in bulk.");
                            return;
                        } else if (gridDS[d]["_actionsPS"][newVal] == false) {
                            linkedUnactionables.push(gridDS[d].DC_ID);
                        } else {
                            //no mismatch, therefore we push it into the packet that we will send to the middle tier
                            tenders.push({
                                DC_ID: gridDS[d].DC_ID,
                                CNTRCT_OBJ_SID: gridDS[d].CNTRCT_OBJ_SID,
                                CUST_MBR_SID: gridDS[d].CUST_MBR_SID,
                                WF_STG_CD: gridDS[d].WF_STG_CD,
                                PS_WF_STG_CD: gridDS[d].PS_WF_STG_CD,
                                PS_ID: gridDS[d]._parentIdPS
                            });
                        }
                    }
                }
            } else {
                //not linked, so we will just push the single data item to the middle tier
                tenders.push({
                    DC_ID: dataItem.DC_ID,
                    CNTRCT_OBJ_SID: dataItem.CNTRCT_OBJ_SID,
                    CUST_MBR_SID: dataItem.CUST_MBR_SID,
                    WF_STG_CD: dataItem.WF_STG_CD,
                    PS_WF_STG_CD: dataItem.PS_WF_STG_CD,
                    PS_ID: dataItem._parentIdPS
                });
            }

            var plural = tenders.length > 1 ? "s" : "";
            var msg = "";
            if (newVal === "Won") msg = "Would you like to mark the Tender Deal" + plural + " as 'Won'?  This will generate a Tracker Number.";
            if (newVal === "Lost") msg = "Would you like to mark the Tender Deal" + plural + " as 'Lost'?";
            if (newVal === "Offer") msg = "Would you like to re-open the Tender Deal" + plural + " and set to 'Offer'?";

            if (newVal === "Approve") msg = "Would you like to approve the Tender Deal" + plural + " and set to 'Approved'?";
            if (newVal === "Revise") msg = "Would you like to edit the Tender Deal" + plural + " and set to 'Revise'?";

            if (linkedUnactionables.length > 0) {
                msg += "<br/><br/>The following deals cannot be Actioned:";
                msg += "<br/><b>" + linkedUnactionables.join(", ") + "</b>";
                msg += "<br/>Please check validations and/or Missing Cost/CAP."
                msg += "<br/><br/>All other selected deals will proceed with your selected Action."
            }

            kendo.confirm(msg)
                .then(function () {
                    // Before updating stage from Submitted to offer run PCT forecfully, after running PCT it will call the actionTenderDeals function
                    if (dataItem.PS_WF_STG_CD == 'Submitted' && newVal == 'Approve') {
                        $scope.$broadcast('TenderRunPCTBeforeApproval', { 'tenders': tenders, 'newVal': newVal });
                    } else {
                        // Change stage of deals
                        $scope.actionTenderDeals(tenders, newVal);
                    }
                }, function () {
                    //User hit cancel, reset Actions to default values
                    if ($scope.actionType == "PS") {
                        dataItem["tender_actions"].text = "Action";
                        dataItem["tender_actions"].value = "Action";
                    }
                    if ($scope.actionType == "BID") {
                        dataItem["tender_actions"].BidActnName = dataItem["WF_STG_CD"];
                        dataItem["tender_actions"].BidActnValue = dataItem["WF_STG_CD"];
                    }
                });
        }

        $scope.actionTenderDeals = function (tenders, actn) {
            if ($scope.$root.pc === null || $scope.$root.pc === undefined) $scope.$root.pc = new perfCacheBlock("Action Tenders", "");
            var pc = new perfCacheBlock("Action tenders", "UX");

            $scope.setBusy("Updating Tender Deals...", "Please wait as we update the Tender Deals!");
            var pcService = new perfCacheBlock("Update Actions to Tenders", "MT");
            objsetService.actionTenderDeals(tenders, actn).then(
                function (results) {

                    pcService.addPerfTimes(results.data.PerformanceTimes);
                    pc.add(pcService.stop());
                    var pcUI = new perfCacheBlock("Processing returned data", "UI");

                    //take the response opMsgQueue and update grid accordingly
                    var msgArray = results.data.Data.Messages;
                    var errorMessages = [];
                    for (var dsIndex = 0; dsIndex < $scope.wipData.length; dsIndex++) {
                        //iterate through grid's dats in order to find entries that were updated
                        if ($scope.actionType == "BID") {
                            for (var i = 0; i < tenders.length; i++) {
                                if (tenders[i].DC_ID != $scope.wipData[dsIndex].DC_ID) {
                                    continue;
                                } else {
                                    //found the index of a tender we changed

                                    for (var m = 0; m < msgArray.length; m++) {

                                        if (msgArray[m].MsgType == 1) {
                                            //opMsgyType = 1 is for "Info messages", aka the success scenario

                                            if (msgArray[m].ExtraDetails.length === undefined) { // not and array... dictionary.  This means a WON bid
                                                if (msgArray[m].Message === "Action List") {
                                                    var details = msgArray[m].ExtraDetails;
                                                    $scope.wipData[dsIndex]["WF_STG_CD"] = "Won";
                                                    $scope.wipData[dsIndex]["bid_actions"] = [];
                                                    $scope.wipData[dsIndex]["BID_ACTNS"] = [];
                                                    if (details[$scope.wipData[dsIndex].DC_ID] !== undefined) $scope.wipData[dsIndex]["TRKR_NBR"] = details[$scope.wipData[dsIndex].DC_ID];
                                                }

                                            } else {

                                                $scope.wipData[dsIndex]["bid_actions"] = msgArray[m].ExtraDetails;  //for bid_action updates, these will contain the new possible bid actions - 3 possible means offer, 2 possible means lost, 1 possible means won
                                                $scope.wipData[dsIndex]["BID_ACTNS"] = [];
                                                for (var actionLength = 0; actionLength < msgArray[m].ExtraDetails.length; actionLength++) {
                                                    $scope.wipData[dsIndex]["BID_ACTNS"].push({
                                                        "BidActnName": msgArray[m].ExtraDetails[actionLength],
                                                        "BidActnValue": msgArray[m].ExtraDetails[actionLength],
                                                    })
                                                }

                                                if ($scope.wipData[dsIndex]["bid_actions"].length == 3) $scope.wipData[dsIndex]["WF_STG_CD"] = "Offer";
                                                if ($scope.wipData[dsIndex]["bid_actions"].length == 2) $scope.wipData[dsIndex]["WF_STG_CD"] = "Lost";
                                                if ($scope.wipData[dsIndex]["bid_actions"].length == 1) $scope.wipData[dsIndex]["WF_STG_CD"] = "Won";
                                            }

                                        } else {
                                            //update failed for this data item
                                            //TODO: create popup indicating warnings/failures
                                        }
                                    }
                                }
                            }
                        } else if ($scope.actionType == "PS") {
                            for (var i = 0; i < msgArray.length; i++) {
                                var keyIdentifiers = msgArray[i].KeyIdentifiers;    //for approval action updates, these will contain the pricing strategy IDs which can be used to identify the dataItem in wipData as tenders have a 1:1 relation to their pricing strategies

                                var psId = $scope.wipData[dsIndex]["_parentIdPS"];

                                if (keyIdentifiers.indexOf(psId) == -1) {
                                    continue;  //dataItem's parent pricing strategy id not being present in return message's key identifiers indicate that it was not part of the changed set
                                } else {
                                    //found the index of a tender we actioned

                                    if (msgArray[i].MsgType == 1) {
                                        //opMsgType = 1 is for "Info" messages, aka the success scenario

                                        //the advanced search functions we take advantage of kindly gives us the contract obj sids of each wip deal which we utilize in the standard save routine.  however the wip data returned to us by actioning pricing strategies does not... 
                                        // so rather than elaborately retrieving contract data and passing it around as well, we just create a copy and reset it after we replace wipData as we know that is a value that should never change.
                                        var contractId = $scope.wipData[dsIndex]["CNTRCT_OBJ_SID"];
                                        $scope.wipData[dsIndex] = msgArray[i].ExtraDetails; //extradetails contains the myDealsData of the wip deal that was updated and would have updated security flags we can utilize
                                        $scope.wipData[dsIndex]["CNTRCT_OBJ_SID"] = contractId;
                                    } else {
                                        //update failed for this data item
                                        //TODO: create popup indicating warnings/failures
                                        errorMessages.push(msgArray[i]);
                                    }
                                }
                            }
                        }
                    }

                    //Temp fix to indicate there was a error
                    if (errorMessages.length > 0) {
                        logger.stickyError("The stage or PCT/MCT was changed by another source prior to this action.Please refresh and try again.");
                    }

                    //go through and remove all checkboxes / unlink everything
                    for (var d = 0; d < $scope.wipData.length; d++) {
                        if ($scope.wipData[d].isLinked) {
                            $scope.wipData[d].isLinked = false;
                        }
                        document.getElementById('chkDealTools').checked = false;
                    }

                    pc.add(pcUI.stop());
                    if ($scope.$root.pc !== null) {
                        $scope.$root.pc.add(pc.stop());
                        $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                        $scope.$root.pc = null;
                    }

                    $("#dealEditor").data("kendoGrid").dataSource.read();
                    $("#dealEditor").data("kendoGrid").refresh();

                    $scope.setBusy("", "");
                    $scope.actionType = "";

                },
                function (result) {
                    //debugger;
                }
            );
        }


        $scope.changeDt = function (st, en) {
            $scope.$storage.startDate = st;
            $scope.$storage.endDate = en;
        }

        function resizeGrid() {
            var h = window.innerHeight - $(".navbar").height() - $("#search-info-container").height() - 100;
            $("#dealEditor").css("height", h);
            var grid = $("#dealEditor").data("kendoGrid");
            if (grid !== undefined && grid !== null) grid.resize();
        }

        $($window).resize(function () {
            resizeGrid();
            $scope.setBusy("", "");
        });

        $scope.$watch('contractData', function (newValue, oldValue, el) {
            if (oldValue === newValue || $scope.stealthMode) return;

            if (oldValue["CUST_MBR_SID"] != newValue["CUST_MBR_SID"]) {
                $scope.contractData.CUST_ACCNT_DIV_UI = "";
                $scope.updateCorpDivision(newValue["CUST_MBR_SID"]);
            }

            if (oldValue["CUST_ACCNT_DIV_UI"].toString() !== newValue["CUST_ACCNT_DIV_UI"].toString()) {
                $timeout(function () {
                    $scope.contractData.CUST_ACCNT_DIV = newValue["CUST_ACCNT_DIV_UI"].toString().replace(/,/g, '/');
                }, 1);
            }
        }, true);

        $scope.updateCorpDivision = function (custId) {
            if (custId === "" || custId == null) return;
            dataService.get("/api/Customers/GetMyCustomerDivsByCustNmSid/" + custId).then(function (response) {
                // only show if more than 1 result
                // TODO: This is a temp fix API is getting the 2002 and 2003 level records, fix the API
                response.data = $filter('where')(response.data, { CUST_LVL_SID: 2003 });

                if (response.data.length <= 1) {
                    $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                    $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                    //US2444394: commented out below because we no longer want to save Customer Account Division names if there is only one possible option
                    //if ($scope.contractData.CUST_ACCNT_DIV_UI !== undefined) $scope.contractData.CUST_ACCNT_DIV_UI = response.data[0].CUST_DIV_NM.toString();
                } else {
                    $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = false;
                    $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false; // never required... blank now mean ALL
                }
                if (!!$("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect")) {
                    $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").dataSource.data(response.data);
                    $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").value($scope.contractData.CUST_ACCNT_DIV_UI);
                }
            },
                function (response) {
                    logger.error("Unable to get Customer Divisions.", response, response.statusText);
                });
        }

        $scope.$on("copy-tender-deals", function (event, items) {
            $scope.copyDeals(items);
        });

        $scope.copyDeals = function (items) {
            if (items.length === 0) {
                kendo.alert("Please select a deal to copy by checking the checkbox next to each deal to be copied.");
                return;
            }

            $scope.$root.copyItems = items;

            var modal = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/app/contract/partials/ptModals/tenderFolio.html',
                controller: 'tenderDashboardController',
                controllerAs: 'contract',
                size: 'lg',
                windowClass: 'tenderFolio-modal-window',
                resolve: {
                    copyItems: function () {
                        return items;
                    },
                    maxRecordCountConstant: function () {
                        return maxRecordCountConstant
                    }
                }
            });

            modal.result.then(
                function () {
                    debugger;
                    //Close Event will come here
                },
                function () {
                    debugger;
                    // Do Nothing on cancel
                });
        }

        $scope.contractData = {
            WF_STG_CD: "InComplete",
            DC_ID: -101,
            TITLE: "",
            CUST_MBR_SID: null,
            CUST_ACCNT_DIV: null,
            CUST_ACCNT_DIV_UI: "",
            COMP_MISSING_FLG: 0,
            HAS_ATTACHED_FILES: 0,
            OBJ_SET_TYPE_CD: "ALL_TYPES",
            TENDER_PUBLISHED: 0,
            START_DT: "01/01/2018", // These are just set to whatever, switched out mid tier to current Q
            END_DT: "04/30/2018", // These are just set to whatever, switched out mid tier to current Q
            C2A_DATA_C2A_ID: "Tender Folio Auto-Filled",
            MEETCOMP_TEST_RESULT: "Not Run Yet",
            COST_TEST_RESULT: "Not Run Yet",
            CUST_ACCPT: "Acceptance Not Required in C2A",
            PASSED_VALIDATION: "Dirty",
            HAS_TRACKER: 0,
            OVERLAP_RESULT: "Not Run Yet",
            COST_MISSING_FLG: 0,
            SYS_COMMENTS: 0,
            CAP_MISSING_FLG: 0,
            IN_REDEAL: 0,
            IS_TENDER: 1,
            VERTICAL_ROLLUP: "",
            _behaviors: {
                isRequired:
                {
                    "CUST_MBR_SID": true,
                    "TITLE": true
                },
                isHidden:
                {
                    "CUST_ACCNT_DIV_UI": true
                }
            }
        }


        $scope.customContractValidate = function () {
            $scope.isValid = true;
            var ct = $scope.contractData;

            // If user has clicked on save, that means he has accepted the default contract name set, make it dirty to avoid any changes to dates making a change to contract name.
            if (!ct._behaviors) ct._behaviors = {};

            if (!ct.CUST_MBR_SID) {
                ct._behaviors.validMsg["CUST_MBR_SID"] = "Please select a valid customer";
                ct._behaviors.isError["CUST_MBR_SID"] = true;
                $scope.isValid = false;
            } else {
                ct._behaviors.validMsg["CUST_MBR_SID"] = "";
                ct._behaviors.isError["CUST_MBR_SID"] = false;
            }

            ct.CUST_ACCNT_DIV = ct.CUST_ACCNT_DIV_UI.toString().replace(/,/g, '/');

            // Clear all values
            angular.forEach(ct,
                function (value, key) {
                    // Do not clear the custom validations user has to correct them e.g contract name duplicate
                    if (ct._behaviors.validMsg[key] === "" ||
                        ct._behaviors.validMsg[key] === "* field is required" ||
                        ct._behaviors.validMsg[key] === undefined) {
                        ct._behaviors.validMsg[key] = "";
                        ct._behaviors.isError[key] = false;
                        if (ct[key] === null) ct[key] = "";
                        // Special handling for CUST_MBR_SID only field where user can make it null by clearing combobox
                    }
                });

            // Check required
            angular.forEach(ct,
                function (value, key) {
                    if (key[0] !== '_' &&
                        value !== undefined &&
                        value !== null &&
                        !Array.isArray(value) &&
                        typeof (value) !== "object" &&
                        (typeof (value) === "string" && value.trim() === "") &&
                        ct._behaviors.isRequired[key] === true &&
                        ct._behaviors.validMsg[key] === "") {
                        ct._behaviors.validMsg[key] = "* field is required";
                        ct._behaviors.isError[key] = true;
                        $scope.isValid = false;
                    }
                    if (ct._behaviors.validMsg[key] !== "") {
                        $scope.isValid = false;
                    }
                });

            ct._behaviors.isError["CUST_ACCNT_DIV_UI"] = ct._behaviors
                .isError["CUST_ACCNT_DIV"];
            ct._behaviors.validMsg["CUST_ACCNT_DIV_UI"] = ct._behaviors
                .validMsg["CUST_ACCNT_DIV"];

            // Check for duplicated titles..
            objsetService.isDuplicateContractTitle(ct.DC_ID, ct.TITLE).then(function (response) {
                ct._behaviors.isError['TITLE'] = response.data;
                ct._behaviors.validMsg['TITLE'] = "";
                if (response.data) {
                    ct._behaviors
                        .validMsg['TITLE'] = "This contract name already exists in another contract.";
                }
                else { // If it passes, do this
                    if ($scope.isValid) {
                        if (ct._behaviors.isHidden["CUST_ACCNT_DIV_UI"] == false && ct.CUST_ACCNT_DIV == "") {
                            kendo.confirm("The division is blank. Do you intend for this deal to apply to all divisions ?").then(function () {
                                $scope.copyTenderFolioContract();
                            },
                                function () {
                                    return;
                                });
                        }
                        else {
                            $scope.copyTenderFolioContract();
                        }
                    } else {
                        $timeout(function () {
                            if (!!$("input.isError")[0]) $("input.isError")[0].focus();
                        }, 300);
                    }
                }
            });

        }

        //Adhoc Tender Manager popup close
        $scope.dismissPopup = function () {
            $uibModalStack.dismissAll();
        };

        $scope.copyTenderFolioContract = function () {
            $scope.setBusy("Copy Tender Folio", "Copying the Contract Information");

            // Contract Data
            var ct = $scope.contractData;
            //$scope.templates.ModelTemplates.PRC_TBL
            var objSetTypeCd = "";
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    if (value._custom._active === true) {
                        objSetTypeCd = key;
                    }
                });

            $scope.contractData["OBJ_SET_TYPE_CD_target"] = objSetTypeCd;

            // check for NEW contract
            if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

            // Add to DB first... then add to screen
            objsetService.copyTenderFolioContract([ct], $scope.$root.copyItems.join()).then(
                function (data) {
                    if (data.data === undefined || data.data.CNTRCT.length < 2) {
                        kendo.alert("Unable to successfully create the Tender Copies.");
                        $scope.setBusy("", "");
                        return;
                    }
                    var id = data.data.CNTRCT[1].DC_ID;
                    document.location.href = "/Contract#/manager/" + id
                    $scope.setBusy("", "");
                },
                function (result) {
                    logger.error("Could not create the contract.", result, result.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.saveBtnName = function () {
            return "COPY";
        }


        $scope.$on("send-notification", function (event, items) {
            openEmailMsg(items);
        });

        $scope.openDealProducts = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/contract/partials/ptModals/dealProductsModal.html',
                controller: 'dealProductsModalCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function () { }, function () { });
        }

        var openEmailMsg = function (items) {
            if (items.length === 0) {
                kendo.alert("No items were selected to email.");
                return;
            }

            var custNames = [];
            var endCustomers = [];
            var rootUrl = window.location.protocol + "//" + window.location.host;

            // Check unique stages as per role
            var stageToCheck = "";
            if (window.usrRole == "DA") {
                stageToCheck = "Approved"
            } else if (window.usrRole == "GA") {
                stageToCheck = "Submitted"
            }

            // set this flag to false when stages are not unique as per role
            var stagesOK = true;

            for (var x = 0; x < items.length; x++) {
                if (custNames.indexOf(items[x].CUST_NM) < 0)
                    custNames.push(items[x].CUST_NM);
                if (endCustomers.indexOf(items[x].END_CUSTOMER_RETAIL) < 0)
                    endCustomers.push(items[x].END_CUSTOMER_RETAIL);
                items[x].url = rootUrl + "/advancedSearch#/tenderDashboard?DealType=" + $scope.dealType + "&Deal=" + items[x].DEAL_ID + "&search&approvedeals"
                items[x].folioUrl = rootUrl + "/advancedSearch#/tenderDashboard?DealType=" + $scope.dealType + "&FolioId=" + items[x].FOLIO_ID + "&search&approvedeals"

                if (stageToCheck != "" && stageToCheck != items[x].NEW_STG) {
                    stagesOK = false;
                }
            }

            var subject = "";
            var eBodyHeader = "";

            if (stagesOK && window.usrRole === "DA") {
                subject = "My Deals Deals Approved for ";
                eBodyHeader = "My Deals Deals Approved!";
            } else if (stagesOK && window.usrRole === "GA") {
                subject = "My Deals Approval Required for "
                eBodyHeader = "My Deals Approval Required!";
            } else {
                subject = "My Deals Action Required for ";
                eBodyHeader = "My Deals Action Required!";
            }

            subject = subject + custNames.join(', ');

            var data = {
                from: window.usrEmail,
                items: items,
                eBodyHeader: eBodyHeader
            }

            var actnList = [];
            actnList.push(kendo.template($("#emailItemTemplateTender").html())(data));
            var msg = actnList.join("\n\n");

            var dataItem = {
                from: "mydeals.notification@intel.com",
                to: "",
                subject: subject,
                body: msg
            };

            if (endCustomers.length > 0) {
                dataItem.subject = dataItem.subject + " (End Customer: " + endCustomers.join(', ') + ")";
            }

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'emailModal',
                controller: 'emailModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function (result) {
            }, function () { });
        }

        $timeout(function () {
            resizeGrid();
        }, 500);
    }
})();