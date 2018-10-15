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

        $scope.contractData = [];

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
                return colorDictionary[k][c];
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
        ////// contract controller root override functions - these are the functions that opGrid expects to have in the parent scope.  Most are for now a copy paste from contract.controller.js
        //////

        $scope.saveCell = function (args) {
            //TODO
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

        $scope.contractData = {}    //placeholder

        $scope.canDeleteAttachment = function (wf_st_cd) {
            return true; //TODO
        }

        $scope.$on('OpGridDataBound',
            function (event, args) {
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
                $q.all([templatesService.readTemplates(), objsetService.searchTender(st, en, searchText)])
                .then(function (responses) {

                    $scope.templateData = responses[0].data;
                    $scope.wipData = responses[1].data.Items;
                    $scope.dealType = $scope.ruleData[0].value;

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

                    $scope.wipOptions.columns = $scope.templateData.ModelTemplates.WIP_DEAL[$scope.dealType].columns;
                    $scope.wipOptions.model = $scope.templateData.ModelTemplates.WIP_DEAL[$scope.dealType].model;

                    $scope.wipOptions.default.groups = opGridTemplate.groups[$scope.dealType];
                    $scope.wipOptions.default.groupColumns = opGridTemplate.templates[$scope.dealType];

                    //insert tender bid actions to deal editor
                    $scope.wipOptions.columns.splice(3, 0, {
                        "bypassExport": true,
                        "field": "bid_actions",
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
                        "excelTemplate": "#=gridUtils.getBidActionsLabel(data)#</div>",
                        //"type": "string",
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
                        "title": "Bid Action",
                        "width": 110
                    });
                    $scope.wipOptions.model.fields.bid_actions = {
                        "editable": false,
                        "field": "bid_actions",
                        "label": "Bid Action",
                        "nullable": true,
                        "opLookupText": "",
                        "opLookupUrl": "",
                        "opLookupValue": "",
                        "type": "string",       //TODO: is is a number? object? what is this bound to?
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
                //TODO: user did not specify a deal type, maybe pop out a popup? let them know somehow that we did not kick off the search\
                kendo.alert("Please specify a Tender Deal Type");
            }
        });

        $scope.$on('search-rules-updated', function (event, args) {
            $scope.$broadcast('reload-search-rules', args);
        });

        $scope.$on("grid-datasource-read-complete", function (event, args) {
            resizeGrid();
        });

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