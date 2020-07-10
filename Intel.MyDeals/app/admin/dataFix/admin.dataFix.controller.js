(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DataFixController', DataFixController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];
    DataFixController.$inject = ['$rootScope', '$timeout', 'dataFixService', '$scope', 'logger', 'gridConstants'];

    function DataFixController($rootScope, $timeout, dataFixService, $scope, logger, gridConstants) {
        var vm = this;
        vm.DataFixActions = [];
        vm.DataFixes = [];
        vm.currentDataFix = {};
        vm.IsEditMode = false;

        vm.Init = function () {
            dataFixService.getDataFixActions().then(function (result) {
                vm.DataFixActions = result.data;
                vm.dataSourceActions.read();
            }, function (response) {
                logger.error("Unable to get actions for data fix");
            });

            dataFixService.getDataFixes().then(function (result) {
                vm.DataFixes = result.data;
                vm.dataSourceDataFixes.read();
            }, function (response) {
                logger.error("Unable to get data fixes");
            });
        }

        vm.SaveFix = function () {
            $rootScope.$broadcast("save-criteria");
            $timeout(function () {
                dataFixService.updateDataFix(vm.currentDataFix).then(function (result) {
                    vm.DataFixes.push(result.data);
                    vm.dataSourceDataFixes.read();
                    vm.IsEditMode = false;
                    logger.success("Data fix has been updated successfully!");
                }, function (response) {
                    logger.error("Unable to update data fix");
                });
            });
        }

        vm.addNewFix = function () {
            vm.currentDataFix = {};
            vm.IsEditMode = true;
        }

        vm.ok = function () {
            vm.IsEditMode = false;
        }

        vm.dataSourceActions = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.DataFixActions);
                }
            }
        });

        vm.dataSourceDataFixes = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.DataFixes);
                }
            }
        });

        vm.DataFixActionOptions = {
            placeholder: "Select action name for data fix..",
            dataSource: vm.dataSourceActions,
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "Text",
            dataValueField: "Value",
            valuePrimitive: true
        };

        vm.gridOptions = {
            dataSource: vm.dataSourceDataFixes,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: false,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            columns: [
                {
                    field: "IncidentNumber",
                    title: "Incident Number"
                },
                {
                    field: "ActionId",
                    title: "Action Name",
                    template: "<Span>Action #= ActionId #<Span>"
                },
                {
                    field: "IsActive",
                    title: "Is Active",
                    template: gridUtils.boolViewer('IsActive')
                },
                {
                    field: "IsApproved",
                    title: "Is Approved",
                    template: gridUtils.boolViewer('IsApproved')
                },
                {
                    field: "Notes",
                    title: "Notes"
                }
            ]
        }

        $scope.operatorSettings = {
            "operators": [
                {
                    "operator": "LIKE",
                    "operCode": "contains",
                    "label": "contains"
                },
                {
                    "operator": "=",
                    "operCode": "eq",
                    "label": "equal to"
                },
                {
                    "operator": "IN",
                    "operCode": "in",
                    "label": "in"
                },
                {
                    "operator": "!=",
                    "operCode": "neq",
                    "label": "not equal to"
                },
                {
                    "operator": "<",
                    "operCode": "lt",
                    "label": "less than"
                },
                {
                    "operator": "<=",
                    "operCode": "lte",
                    "label": "less than or equal to"
                },
                {
                    "operator": ">",
                    "operCode": "gt",
                    "label": "greater than"
                },
                {
                    "operator": ">=",
                    "operCode": "gte",
                    "label": "greater than or equal to"
                }
            ],
            "types": [
                {
                    "type": "string",
                    "uiType": "textbox"
                }, {
                    "type": "string_with_in",
                    "uiType": "textbox"
                }, {
                    "type": "string_limited",
                    "uiType": "textbox"
                },
                {
                    "type": "autocomplete",
                    "uiType": "textbox"
                },
                {
                    "type": "number",
                    "uiType": "numeric"
                },
                {
                    "type": "numericOrPercentage",
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
                },
                {
                    "type": "singleselect",
                    "uiType": "combobox"
                },
                {
                    "type": "singleselect_ext",
                    "uiType": "combobox"
                },
                {
                    "type": "singleselect_read_only",
                    "uiType": "combobox"
                }
            ],
            "types2operator": [
                {
                    "type": "number",
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "numericOrPercentage",
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "money",
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "date",
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "string",
                    "operator": ["LIKE", "=", "!="]
                },
                {
                    "type": "string_with_in",
                    "operator": ["=", "!=", "LIKE", "IN"]
                },
                {
                    "type": "string_limited",
                    "operator": ["=", "!=", "IN"]
                },
                {
                    "type": "autocomplete",
                    "operator": ["=", "!=", "IN"]
                },
                {
                    "type": "list",
                    "operator": ["=", "!="]
                },
                {
                    "type": "list",
                    "subType": "xml",
                    "operator": ["="]
                },
                {
                    "type": "bool",
                    "operator": ["=", "!="]
                },
                {
                    "type": "singleselect",
                    "operator": ["="]
                },
                {
                    "type": "singleselect_read_only",
                    "operator": ["="]
                },
                {
                    "type": "singleselect_ext",
                    "operator": ["=", "!="]
                }
            ]
        };

        var allowedRoleForCreatedBy = ["GA", "FSE"];
        $scope.attributeSettings = [
            {
                field: "CRE_EMP_NAME",
                title: "Created by name",
                type: "list",
                width: 150.0,
                lookupText: "NAME",
                lookupValue: "EMP_WWID",
                lookupUrl: "/api/Employees/GetUsrProfileRoleByRoleCd/" + allowedRoleForCreatedBy.join()
            },
            {
                field: "WIP_DEAL_OBJ_SID",
                title: "Deal #",
                type: "string_limited",
                width: 150
            },
            {
                field: "OBJ_SET_TYPE_CD",
                title: "Deal Type",
                type: "singleselect_read_only",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ECAP" }]
            },
            {
                field: "CUST_NM",
                title: "Customer",
                type: "list",
                width: 150.0,
                lookupText: "CUST_NM",
                lookupValue: "CUST_SID",
                lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
            },
            {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string_with_in",
                width: 150
            },
            {
                field: "GEO_COMBINED",
                title: "Deal Geo",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Worldwide" }, { Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
            },
            {
                field: "HOST_GEO",
                title: "Customer Geo",
                type: "list",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
            },
            {
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 150,
                dimKey: 20
            },
            {
                field: "DEAL_DESC",
                title: "Deal Description",
                type: "string",
                width: 150,
                dimKey: 20
            },
            {
                field: "OP_CD",
                title: "Op Code",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/OP_CD"
            },
            {
                field: "DIV_NM",
                title: "Product Division",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/DIV_NM"
            },
            {
                field: "FMLY_NM",
                title: "Family",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/FMLY_NM"
            },
            {
                field: "PRD_CAT_NM",
                title: "Product Verticals",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/PRD_CAT_NM"
            },
            {
                field: "SERVER_DEAL_TYPE",
                title: "Server Deal Type",
                type: "list",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
            },
            {
                field: "MRKT_SEG",
                title: "Market Segment",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
            },
            {
                field: "PAYOUT_BASED_ON",
                title: "Payout Based On",
                type: "singleselect_ext",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
            },
            {
                field: "COMP_SKU",
                title: "Meet Comp Sku",
                type: "string_with_in",
                width: 150
            },
            {
                field: "ECAP_PRICE",
                title: "ECAP (Price)",
                type: "money",
                width: 150,
                dimKey: 20,
                format: "{0:c}"
            },
            {
                field: "VOLUME",
                title: "Ceiling Volume",
                type: "number",
                width: 150
            },
            {
                field: "VOL_INCR",
                title: "Ceiling Volume Increase",
                type: "numericOrPercentage",
                width: 150
            },
            {
                field: "END_DT",
                title: "End Date",
                type: "date",
                template: "#if(END_DT==null){#  #}else{# #= moment(END_DT).format('MM/DD/YYYY') # #}#",
                width: 150
            },
            {
                field: "END_DT_PUSH",
                title: "End Date Push",
                type: "number",
                width: 150,
                post_label: "Days"
            },
            {
                field: "HAS_TRCK",
                title: "Has Tracker",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Yes" }, { Value: "No" }]
            },
            {
                field: "MTRL_ID",
                title: "Material Id",
                type: "autocomplete",
                width: 150
            },
            {
                field: "DEAL_PRD_NM",
                title: "Level 4",
                type: "autocomplete",
                width: 150
            },
            {
                field: "PCSR_NBR",
                title: "Processor Number",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/PCSR_NBR"
            },
            {
                field: "QLTR_BID_GEO",
                title: "Bid Geo",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "dropdownName",
                lookupValue: "dropdownName",
                lookupUrl: "/api/Dropdown/GetGeosDropdowns"
            }
        ];

        vm.Init();
    }
})();