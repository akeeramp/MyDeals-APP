(function () {
    'use strict';

    angular
        .module('app.advancedSearch')
        .controller('tenderDashboardController', tenderDashboardController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    tenderDashboardController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger', '$window', '$linq', '$rootScope', 'opGridTemplate', 'colorDictionary', '$location'];

    function tenderDashboardController($scope, $state, $filter, $localStorage, $compile, $uibModal, $timeout, $q, objsetService, templatesService, logger, $window, $linq, $rootScope, opGridTemplate, colorDictionary, $location) {

        kendo.culture().numberFormat.currency.pattern[0] = "-$n";
        document.title = "Tender Dashboard - My Deals";

        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
        var kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"]; //TODO: this is a copy of a hard-coded list of strings from contract.controller.js - ideally we move this into some sort of global file and reference from there at least.

        $scope.contractData = [];
        $scope.templateData = [];

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
                $scope.templateData = response.data;
            })
            .catch(function (data) {
                console.log('Template Retrieval Failed');
            });

        $scope.openMCTScreen = function (dataItem) {

            objsetService.readContract($scope.contractData.DC_ID).then(function (data) {
                $scope.contractData = $scope.initContract(data);
                $scope.contractData.CUST_ACCNT_DIV_UI = "";

                // if the current strategy was changed, update it

                $scope.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, dataItem.PRC_ST_OBJ_SID);
                $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, $scope.curPricingStrategy.PRC_TBL[0].DC_ID);

                $timeout(function () {
                    $scope.$apply();
                });

                var modal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/partials/ptModals/meetCompModal.html',
                    controller: 'MeetCompController',
                    //controllerAs: 'contract',
                    size: 'lg',
                    windowClass: 'tenderFolio-modal-window',
                    resolve: {
                        dataItem: function () {
                            return dataItem;
                        },
                        parentScope: function () {
                            return $scope;
                        }
                    }
                });

                modal.result.then(
                    function () {
                        //Close Event will come here
                    },
                    function () {
                        // Do Nothing on cancel
                    });
            });


        }


        $scope.showSearchFilters = true;
        $scope.ruleToRun = null;
        $scope.runSearch = false;

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
                field: "CNTRCT_OBJ_SID",
                title: "Folio Id",
                type: "string",
                width: 110,
                template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_OBJ_SID#</a>"
            }, {
                field: "PRC_ST_TITLE",
                title: "Pricing Strategy",
                type: "string",
                width: 140,
                template: "<a href='/advancedSearch\\#/gotoPs/#=data.PRC_ST_OBJ_SID#' target='_blank' class='objDealId'>#=data.PRC_ST_TITLE#</a>"
            }, {
                field: "PRC_ST_OBJ_SID",
                title: "Pricing Strategy Id",
                type: "number",
                filterable: "numObjFilter",
                width: 140,
                template: "<a href='/advancedSearch\\#/gotoPs/#=data.PRC_ST_OBJ_SID#' target='_blank' class='objDealId'>#=data.PRC_ST_OBJ_SID#</a>"
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
                                    "Pending",
                                    "Approved",
                                    "Active",
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
                    { Value: "Pending" },
                    { Value: "Approved" },
                    { Value: "Active" },
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
                field: "REBATE_TYPE",
                title: "Rebate Type",
                type: "list",
                width: 140,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                type: 'json',
                                transport: {
                                    read: {
                                        url: "/api/Dropdown/GetDistinctDropdownCodes/REBATE_TYPE",
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
                lookupUrl: "/api/Dropdown/GetDistinctDropdownCodes/REBATE_TYPE"
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
                field: "STRT_VOL",
                title: "Start Volume",
                type: "number",
                width: 170,
                dimKey: 10,
                format: "{0:n}",
                filterable: "numObjFilter",
                template: "#= gridUtils.tierDim(data, 'STRT_VOL', 'n') #"
            }, {
                field: "END_VOL",
                title: "End Volume",
                type: "number",
                width: 170,
                dimKey: 10,
                format: "{0:n}",
                filterable: "numObjFilter",
                template: "#= gridUtils.tierDim(data, 'END_VOL', 'n') #"
            }, {
                field: "RATE",
                title: "Rate",
                type: "money",
                width: 170,
                dimKey: 10,
                format: "{0:c}",
                filterable: "moneyObjFilter",
                template: "#= gridUtils.tierDim(data, 'RATE', 'c') #"
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
                field: "TOTAL_DOLLAR_AMOUNT",
                title: "Total Dollar Amount",
                type: "number",
                width: 170,
                format: "{0:c}",
                filterable: "moneyObjFilter"
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
        });

        if ($scope.customSettings.length === 0) {
            $scope.customSettings = [{
                field: "OBJ_SET_TYPE_CD",
                operator: "=",
                value: "ECAP",
                source: null
            }, {
                field: "END_CUSTOMER_RETAIL",
                operator: "=",
                value: "",
                source: null
            }];
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

        //////
        ////// contract controller root override functions - these are the functions that opGrid expects to have in the parent scope.  Most are a copy paste from contract.controller.js and then modified for this context
        //////

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

                    var fields = $scope.templateData.ModelTemplates.WIP_DEAL[$scope.dealType].model.fields;
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

            //if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Contract Controller", "");
            //var pc = new perfCacheBlock("Save Contract Root", "UX");
            //var pcUi = new perfCacheBlock("Gather data to pass", "UI");

            //if (forceValidation === undefined || forceValidation === null) forceValidation = false;
            //if (forcePublish === undefined || forcePublish === null) forcePublish = false;

            //$scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);

            var data = $scope.createWIPBase();
            //pc.mark("Built data structure");

            // If there are critical errors like bad dates, we need to stop immediately and have the user fix them
            if (!!data.Errors && !angular.equals(data.Errors, {})) {
                logger.warning("Please fix validation errors before proceeding", $scope.contractData, "");
                $scope.syncCellValidationsOnAllRows($scope.pricingTableData["PRC_TBL_ROW"]); /////////////
                $scope.setBusy("", "");
                return;
            }

            var copyData = util.deepClone(data);


            //pc.add(pcUi.stop());
            //var pcService = new perfCacheBlock("Update Contract And CurPricing Table", "MT");

            objsetService.bulkTenderUpdate(copyData).then(
                function (results) {

                    var data = results.data.Data;
                    //TODO: confirm why response data isn't being updated to be shown in the grid, do db modification test to confirm

                    //pcService.addPerfTimes(results.data.PerformanceTimes);
                    //pc.add(pcService.stop());
                    //var pcUI = new perfCacheBlock("Processing returned data", "UI");
                    //util.console("updateContractAndCurPricingTable Returned");

                    $scope.setBusy("Saving your data...Done", "Processing results now!", "Info", true);

                    var anyWarnings = false;

                    //pc.mark("Constructing returnset");
                    
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

                        //$scope.delPtrIds = [];

                        //if (!!toState) {
                        //    $scope.stealthMode = false;
                        //    if ($scope.switchingTabs) toState = toState.replace(/.wip/g, '');
                        //    $state.go(toState, toParams, { reload: true });
                        //} else {
                            $timeout(function () {
                                //if ($scope.isBusyMsgTitle !== "Overlapping Deals...")
                                    $scope.setBusy("", "");
                                //$scope.stealthMode = false;
                            }, 1000);
                        //}
                        //if ($scope.isTenderContract && ($scope.selectedTAB == 'PTR' || $scope.selectedTAB == 'DE')) {
                        //    $scope.forceNavigation = true; //Purpose: If No Error/Warning go to Meet Comp Automatically-After Refreshing Contract
                        //}
                        //else {
                        //    $scope.forceNavigation = false;
                        //}

                    } else {
                        //if ($scope.isTenderContract && $scope.selectedTAB == 'PTR') {
                        //    $scope.forceNavigation = false; //Purpose: If No Error/Warning go to PTR Automatically-After Refreshing Contract
                        //}

                        $scope.setBusy("Saved with warnings", "Didn't pass Validation", "Warning");
                        $scope.$broadcast('saveWithWarnings', data);
                        //JEFFTODO: save with warning broadcast, make sure it touches opgrid
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 2000);
                    }

                    //if (toState === undefined || toState === null || toState === "") {

                        $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);  //JEFFTODO: investigate, do we need this?
                    //}
                    //$scope.isAutoSaving = false;

                    //util.console("updateContractAndCurPricingTable Complete");

                    //if a callback function is provided, invoke it now once everything else is completed
                    if (!!callback && typeof callback === "function") {
                        callback();
                        //pc.add(pcUI.stop());
                        //if ($scope.$root.pc !== null) $scope.$root.pc.add(pc.stop());
                    //} else {
                        //pc.add(pcUI.stop());
                        //if ($scope.$root.pc !== null) {
                        //    $scope.$root.pc.add(pc.stop());
                        //    $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                        //    $scope.$root.pc = null;
                        //}
                    }

                },
                function (response) {
                    $scope.setBusy("Error", "Could not save the contract.", "Error");
                    logger.error("Could not save tenders.", response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    //$scope.isAutoSaving = false;
                }
            );
        }

        $scope.resetDirty = function () {
            $scope._dirty = false;
            //$scope._dirtyContractOnly = false;
        }

        function mapTieredWarnings(dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
            // Tie warning message (valid message and red highlight) to its specific tier
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


        $scope.canDeleteAttachment = function (wf_st_cd) {
            console.log("TODO: 2");
            return true; //TODO
        }

        $scope.$on('OpGridDataBound',
            function (event, args) {
                console.log("TODO: 1");
                ////TODO
                ////found in managerExcludeGroups.controller.js
                //if (!$scope.firstGridLoaded) {
                //    if ($scope.pctFilterEnabled) {
                //        $timeout(function () {

                //            // if allowed... add tab to go back to PCT tab
                //            $scope.filterPct();

                //            var html = '<li ng-click="gotoPct()" class="k-item k-state-default"><span unselectable="on" class="k-link" title="Click to go back to Price Cost Test">Price Cost Test</span></li>';
                //            var template = angular.element(html);
                //            var linkFunction = $compile(template);
                //            linkFunction($scope);

                //            $(".k-tabstrip-wrapper ul.k-tabstrip-items").append(template);
                //        },
                //            500);
                //    }
                //}
                //$scope.firstGridLoaded = true;
            });

        //////
        //////      end section of code that replaces contract.controller functions
        //////


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

                $scope.setBusy("Searching...", "Search speed depends on how specific your search options are.", "Info", true, true)
                objsetService.searchTender(st, en, searchText)
                .then(function (response) {
                    $scope.wipData = response.data.Items;
                    $scope.dealType = $scope.ruleData[0].value;

                    if ($scope.wipData.length == 0) {
                        $scope.setBusy("", "");
                        kendo.alert("No results found.  Try changing your search options.");
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

                    $scope.wipOptions.columns = angular.copy($scope.templateData.ModelTemplates.WIP_DEAL[$scope.dealType].columns);
                    $scope.wipOptions.model = angular.copy($scope.templateData.ModelTemplates.WIP_DEAL[$scope.dealType].model);

                    $scope.wipOptions.default.groups = angular.copy(opGridTemplate.groups[$scope.dealType]);
                    $scope.wipOptions.default.groupColumns = angular.copy(opGridTemplate.templates[$scope.dealType]);

                    //insert tender bid actions to deal editor
                    $scope.wipOptions.columns.splice(3, 0, {
                        "field": "bid_actions",
                        "bypassExport": true,
                        "hidden": false,
                        "isDimKey": false,
                        "isRequired": false,
                        "lockable": false,
                        "locked": true,
                        "lookupText": "",
                        "lookupUrl": "",
                        "lookupValue": "",
                        "mjrMnrChg": null,
                        "sortable": false,
                        "template": "<div id='cb_actn_#=data.DC_ID#'>#=gridUtils.getBidActions(data)#</div>",
                        "excelTemplate": "<div>#=gridUtils.getBidActionsLabel(data)#</div>",
                        //"type": "string",
                        "editor": "BID_ACTNS",
                        "filterable": false,
                        //"filterable": {
                        //    ui: function (element) {
                        //        element.kendoDropDownList({
                        //            dataSource: {
                        //                data: [
                        //                    "Lost",
                        //                    "Won",
                        //                    "Offer"
                        //                ]
                        //            },
                        //            optionLabel: "--Select Value--"
                        //        });
                        //    },
                        //    extra: false
                        //},
                        "title": "Action",
                        "width": 110
                    });
                    $scope.wipOptions.model.fields.bid_actions = {
                        "field": "bid_actions",
                        "editable": true,
                        "label": "Action",
                        "nullable": true,
                        "opLookupText": "",
                        "opLookupUrl": "",
                        "opLookupValue": "",
                        //"type": "string",
                        "editor": "BID_ACTNS",
                        "validMsg": ""
                    };
                    $scope.wipOptions.default.groupColumns.bid_actions = {
                        "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "Payment"]     //we add bid actions to be locked on all tab groups
                    };

                    $scope.wipOptions.groups = $scope.wipOptions.default.groups
                    $scope.wipOptions.groupColumns = $scope.wipOptions.default.groupColumns;

                }).catch(function (data) {
                    console.log('Tender Search Failed');
                });
            } else {
                kendo.alert("Please specify a Tender Deal Type");
            }
        });

        $scope.$on('search-rules-updated', function (event, args) {
            $scope.$broadcast('reload-search-rules', args);
        });

        $scope.$on("grid-datasource-read-complete", function (event, args) {
            resizeGrid();
        });

        $scope.$on("bid-actions-updated", function (event, args) {
            var newValue = args.newValue;
            var dataItem = args.dataItem;
            if (newValue == dataItem.WF_STG_CD) return; //user selected the same item, aka we do nothing here and break out

            $scope.changeBidAction(dataItem, newValue);
        });

        $scope.$on("approval-actions-updated", function (event, args) {
            var newValue = args.newValue;
            var dataItem = args.dataItem;
            if (newValue == "Action") return;   //user selected the default non-item action so we break out here.

            $scope.changeBidAction(dataItem, newValue);
        });

        $scope.changeBidAction = function (dataItem, newVal) {
            //var newVal = dataItem.WF_STG_CD;
            var dsData = $scope.wipData;
            var tenders = [];

            // now update all checked items if the current one is checked
            //if (dataItem.isLinked) {
            //    for (var d = 0; d < dsData.length; d++) {
            //        if (dsData[d].isLinked) {
            //            dsData[d].WF_STG_CD = newVal;
            //            tenders.push({
            //                DC_ID: dsData[d].DC_ID,
            //                CNTRCT_OBJ_SID: dsData[d].CNTRCT_OBJ_SID,
            //                CUST_MBR_SID: dsData[d].CUST_MBR_SID
            //            });
            //        }
            //    }
            //} else {
                tenders.push({
                    DC_ID: dataItem.DC_ID,
                    CNTRCT_OBJ_SID: dataItem.CNTRCT_OBJ_SID,
                    CUST_MBR_SID: dataItem.CUST_MBR_SID,
                    WF_STG_CD: dataItem.WF_STG_CD
                });
            //}

            var plural = tenders.length > 1 ? "s" : "";
            var msg = "";
            if (newVal === "Won") msg = "Would you like to mark the Tender Deal" + plural + " as 'Won'?  This will generate a Tracker Number.";
            if (newVal === "Lost") msg = "Would you like to mark the Tender Deal" + plural + " as 'Lost'?";
            if (newVal === "Offer") msg = "Would you like to re-open the Tender Deal" + plural + " and set to 'Offer'?";

            if (newVal === "Approve") msg = "Would you like approve the Tender Deal" + plural + " and set to 'Approved'?";
            if (newVal === "Revise") msg = "Would you like to edit the Tender Deal" + plural + " and set to 'Revise'?";

            kendo.confirm(msg)
                .then(function () {
                    //Save the changes
                    $scope.actionTenderDeals(tenders, newVal);
                },
                function () {
                    //var dropdownlist, indx, lis, i;

                    //if (dataItem.isLinked) {
                    //    for (var d = 0; d < dsData.length; d++) {
                    //        if (dsData[d].isLinked) {
                    //            dsData[d].WF_STG_CD = dataItem["orig_WF_STG_CD"];
                    //            dropdownlist = $("#ddListStat_" + dsData[d].DC_ID).data("kendoDropDownList");
                    //            indx = 0;
                    //            lis = dropdownlist.ul.children();
                    //            for (i = 0; i < lis.length; i++) {
                    //                if (lis[i].textContent === dsData[d]["orig_WF_STG_CD"]) indx = i;
                    //            }
                    //            dsData[d]['isLinked'] = false;
                    //            dropdownlist.select(indx);
                    //        }
                    //    }
                    //} else {
                    //    dropdownlist = $("#ddListStat_" + dataItem.DC_ID).data("kendoDropDownList");
                    //    indx = 0;
                    //    lis = dropdownlist.ul.children();
                    //    for (i = 0; i < lis.length; i++) {
                    //        if (lis[i].textContent === dataItem["orig_WF_STG_CD"]) indx = i;
                    //    }
                    //    dropdownlist.select(indx);
                    //}

                });

        }

        $scope.actionTenderDeals = function (tenders, actn) {
            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Action Tenders", "");
            var pc = new perfCacheBlock("Action tenders", "UX");

            $scope.setBusy("Updating Tender Deals...", "Please wait as we update the Tender Deals!");
            var pcService = new perfCacheBlock("Update Actions to Tenders", "MT");
            objsetService.actionTenderDeals(tenders, actn).then(
                function (results) {
                    //pcService.addPerfTimes(results.data.PerformanceTimes);
                    //pc.add(pcService.stop());
                    //var pcUI = new perfCacheBlock("Processing returned data", "UI");

                    //var foundIt = false;
                    //var noDeals = [];
                    //$scope.messages = results.data.Data.Messages;

                    //var dsData = $scope.wipData;
                    //var singleRowUpdate = [];
                    //if (tenders.length === 1) {
                    //    singleRowUpdate[tenders[0]["DC_ID"]] = tenders[0]["DC_ID"];
                    //}
                    //for (var m = 0; m < $scope.messages.length; m++) {
                    //    if ($scope.messages[m].Message === "Action List") {
                    //        foundIt = true;
                    //        var details = $scope.messages[m].ExtraDetails;
                    //        for (var d = 0; d < dsData.length; d++) {
                    //            if (details[dsData[d].DC_ID] !== undefined) {
                    //                $("#trk_" + dsData[d].DC_ID).html(details[dsData[d].DC_ID].join(", "));
                    //                $("#cb_actn_" + dsData[d].DC_ID).html('<div style="text-align: center; width: 100%;" class="ng-binding">Won</div>');
                    //                $("#dealTool_" + dsData[d].DC_ID).html('');
                    //                dsData[d]['isLinked'] = false;
                    //            } else if (singleRowUpdate[dsData[d].DC_ID] !== undefined) {
                    //                updateBidStatusDropDownSource(dsData[d]);
                    //                break;
                    //            }

                    //            // if linked, clear out the check boxes
                    //            if (dsData[d].isLinked) {
                    //                updateBidStatusDropDownSource(dsData[d]);
                    //            }

                    //        }
                    //    }
                    //    else if ($scope.messages[m].Message === "No Deal") {
                    //        noDeals.push($scope.messages[m].ExtraDetails);
                    //    }
                    //}

                    //pc.add(pcUI.stop());
                    //if ($scope.$root.pc !== null) {
                    //    $scope.$root.pc.add(pc.stop());
                    //    $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                    //    $scope.$root.pc = null;
                    //}

                    //if (noDeals.length > 0) {
                    //    kendo.alert("It looks like one or more deals were deleted.  We need to refresh the data.");
                    //    $scope.$broadcast('reload-search-dataSource');
                    //} else if (foundIt) {
                    //    $scope.curLinkedVal = "";
                        //$timeout(function () {
                    $scope.setBusy("Tender Deals Updated... But Jeff hasn't implemented Grid refresh yet.", "Your approval/action should have gone through.  Please refresh the page and pull up your tenders again.  Sorry :(");
                        //}, 50);
                        //////scope.ds.read(); // we rely on the DS post load to close down the busy indicator
                    //} else {
                    //    $timeout(function () {
                    //        $scope.setBusy("", "");
                    //    }, 50);
                    //}

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

        $timeout(function () {
            resizeGrid();
        }, 500);

    }
})();