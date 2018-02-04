(function () {
    'use strict';

    angular
        .module('app.advancedSearch')
        .controller('attributeSearchController', attributeSearchController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    attributeSearchController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger', '$window', '$linq'];

    function attributeSearchController($scope, $state, $filter, $localStorage, $compile, $uibModal, $timeout, $q, objsetService, templatesService, logger, $window, $linq) {

        $scope.showSearchFilters = true;
        $scope.ruleToRun = null;

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
                title: "Contract Title",
                type: "string",
                width: 140,
                template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' class='objDealId'>#=data.CNTRCT_TITLE#</a>"
            }, {
                field: "DC_ID",
                title: "Deal",
                type: "number",
                width: 100,
                filterable: "numObjFilter",
                template: "<div ng-click='navToPath(dataItem)' class='objDealId'>#=data.DC_ID#</div>"
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
                type: "list",
                width: 130,
                filterable: {
                    ui: function (element) {
                        element.kendoDropDownList({
                            dataSource: {
                                data: [
                                    "ECAP",
                                    "KIT",
                                    "PROGRAM",
                                    "VOL_TIER"
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
                    { OBJ_SET_TYPE_CD: "PROGRAM", OBJ_SET_TYPE_NM: "PROGRAM" },
                    { OBJ_SET_TYPE_CD: "KIT", OBJ_SET_TYPE_NM: "KIT" },
                    { OBJ_SET_TYPE_CD: "VOL_TIER", OBJ_SET_TYPE_NM: "VOL TIER" }
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
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 250,
                dimKey: 20,
                filterable: "objFilter",
                template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
            }, {
                field: "MRKT_SEG",
                title: "Market Segment",
                type: "list",
                width: 140,
                filterable: {
                    ui: function(element) {
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
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string",
                width: 140
            }, {
                field: "NOTES",
                title: "Comments / notes",
                type: "string",
                width: 250
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
                "help": "<div style=\"margin-bottom: 5px; \"><b>Search Tip</b></div>Search by Deal #, Customer, Product or Tracker #<br/><div style=\"color: #666666; margin: 5px 0;\">Example: <i>i7-5*, HPI</i></div>"
            },
            "busy": {
                "search": {
                    "title": "Searching...",
                    "message": "Searching for Deals"
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
                var searchText = $scope.customers.length === 0 ? "null" : $scope.customers.join(',');

                var url = "/api/Search/GetDealList/" + st + "/" + en + "/" + searchText;
                $scope.savingToExcel = false;
                return url;
            }
        };

        $scope.customersDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Customers/GetMyCustomersNameInfo",
                    dataType: "json"
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
            var custNames = $linq.Enumerable().From($scope.customers)
                    .Select(function (x) {
                        return (x.CUST_NM);
                    }).ToArray();
            return custNames.join(", ");
        }

        $scope.$storage = $localStorage;

        $scope.$storage = $localStorage.$default({
            startDate: moment().subtract(6, 'months').format("MM/DD/YYYY"),
            endDate: moment().add(6, 'months').format("MM/DD/YYYY")
        });

        $scope.$on('invoke-search-datasource', function (event, args) {
            $scope.ruleData = args.rule;
            $scope.$broadcast('reload-search-dataSource', args);
        });

        $scope.$on('search-rules-updated', function (event, args) {
            $scope.$broadcast('reload-search-rules', args);
        });
        
        // init dashboard
        $scope.startDt = $scope.$storage.startDate;
        $scope.endDt = $scope.$storage.endDate;
        $scope.customers = [];
        $scope.searchText = "";

        $scope.changeDt = function (st, en) {
            $scope.$storage.startDate = st;
            $scope.$storage.endDate = en;
        }

        function resizeGrid() {
            var h = window.innerHeight - $(".navbar").height() - $("#search-info-container").height() - 15;
            $("#attributeGrid").css("height", h);
            $("#attributeGrid .k-grid").data("kendoGrid").resize();
        }

        $($window).resize(function () {
            resizeGrid();
        });

        $timeout(function () {
            resizeGrid();
        }, 500);

    }
})();