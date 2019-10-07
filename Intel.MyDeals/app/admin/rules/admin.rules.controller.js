(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleController', RuleController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    RuleController.$inject = ['$uibModal', 'ruleService', '$scope', 'logger', '$timeout']

    function RuleController($uibModal, ruleService, $scope, logger, $timeout) {
        var vm = this;
        vm.ruleTypeId = 0;
        vm.ruleId = 0;

        //--------------------------------------------DataSources----------
        vm.RuleTypes = [{
            'id': 1,
            'Name': 'Tender DA auto approval',
            'Approvers': '11579289',
            'CreaterBy': '11579289',
            'CreatedDateTime': '',
            'ChangedBy': '11579289',
            'ChangedDateTime': '',
        },
        {
            'id': 2,
            'Name': 'Sample',
            'Approvers': '11579289',
            'CreaterBy': '11579289',
            'CreatedDateTime': '',
            'ChangedBy': '11579289',
            'ChangedDateTime': '',
        }];

        vm.Rules = [{
            'Id': 1,
            'RuleTypeId': 1,
            'Name': 'Mahesh Auto Approval Tender Rules',
            'IsActive': true,
            'OwnerId': 11579289,
            'StartDate': "01/01/2019",
            'EndDate': "12/31/2019",
            'Notes': 'Tender Deals will be auto approved when it passed below rule',
            'Criteria': '',
            'CreatedBy': '11579289',
            'CreatedDateTime': new Date(),
            'ChangedBy': '11579289',
            'ChangeDateTime': new Date(),
        }];
        //------------------------------------------------------------------------------------------------

        vm.ruleTypeDs = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.RuleTypes);
                }
            }
        });

        vm.ruleTypeOptions = {
            placeholder: "Select a Rule Type...",
            dataTextField: "Name",
            dataValueField: "Id",
            valuePrimitive: true,
            autoBind: false,
            autoClose: false,
            dataSource: vm.ruleTypeDs,
            change: function (e) {
                // Cascade dropdown trigger
            }
        };

        vm.ruleDs = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Rules);
                }
            }
        });

        vm.rule = {};

        vm.ruleOptions = {
            placeholder: "Select a Rule ...",
            dataTextField: "Name",
            dataValueField: "Id",
            valuePrimitive: true,
            autoBind: false,
            autoClose: false,
            dataSource: vm.ruleDs,
            change: function (e) {
                $timeout(function () {
                    vm.rule = vm.Rules[0];
                });
            }
        };

        vm.ownerDs = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Employees/GetUsrProfileRole",
                    dataType: "json"
                }
            }
        });

        vm.ownerOptions = {
            placeholder: "Select email address...",
            dataTextField: "EMAIL_ADDR",
            dataValueField: "EMP_WWID",
            valueTemplate: '<div class="tmpltItem">' +
                '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
                '<div class="fl tmpltContract"><div class="tmpltPrimary">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
                '<div class="fr tmpltRole">#: data.ROLE_NM #</div>' +
                '<div class="clearboth"></div>' +
                '</div>',
            template: '<div class="tmpltItem">' +
                '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
                '<div class="fl tmpltContract"><div class="tmpltPrimary" style="text-align: left;">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
                '<div class="clearboth"></div>' +
                '</div>',
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            valuePrimitive: true,
            filter: "contains",
            maxSelectedItems: 1,
            autoBind: true,
            dataSource: vm.ownerDs
        };

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
                    operator: ["=", "LIKE"]
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
                template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_TITLE#</a>"
            }, {
                field: "CNTRCT_OBJ_SID",
                title: "Contract Id",
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
                field: "CNTRCT_C2A_DATA_C2A_ID",
                title: "C2A Id",
                type: "string",
                width: 100
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
                field: "DEAL_DESC",
                title: "Deal Description",
                type: "string",
                width: 210,
                filterable: "objFilter",
            }, {
                field: "START_DT",
                title: "Start Date",
                type: "date",
                template: "#if(START_DT==null){#  #}else{# #= moment(START_DT).format('MM/DD/YYYY') # #}#",
                width: 130
            }, {
                field: "END_DT",
                title: "End Date",
                type: "date",
                template: "#if(END_DT==null){#  #}else{# #= moment(END_DT).format('MM/DD/YYYY') # #}#",
                width: 130
            }, {
                field: "OEM_PLTFRM_LNCH_DT",
                title: "OEM Platform Launch Date",
                type: "date",
                template: "#if(OEM_PLTFRM_LNCH_DT==null){#  #}else{# #= moment(OEM_PLTFRM_LNCH_DT).format('MM/DD/YYYY') # #}#",
                width: 130
            }, {
                field: "OEM_PLTFRM_EOL_DT",
                title: "OEM Platform EOL Date",
                type: "date",
                template: "#if(OEM_PLTFRM_EOL_DT==null){#  #}else{# #= moment(OEM_PLTFRM_EOL_DT).format('MM/DD/YYYY') # #}#",
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
    }
})();