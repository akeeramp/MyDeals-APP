(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleController', RuleController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    RuleController.$inject = ['$rootScope', 'ruleService', '$scope', 'logger', '$timeout', 'confirmationModal', 'gridConstants']

    function RuleController($rootScope, ruleService, $scope, logger, $timeout, confirmationModal, gridConstants) {
        var vm = this;
        vm.ruleId = 0;
        vm.isEditmode = false;
        vm.Rules = [];
        vm.rule = {};

        $scope.init = function () {
            vm.GetRules(0, "GET_RULES");
        }

        $scope.operatorSettings = {
            "operators": [
                {
                    "id": 1,
                    "operator": "LIKE",
                    "operCode": "contains",
                    "label": "contains"
                },
                {
                    "id": 2,
                    "operator": "=",
                    "operCode": "eq",
                    "label": "equal to"
                },
                {
                    "id": 3,
                    "operator": "IN",
                    "operCode": "in",
                    "label": "in"
                },
                {
                    "id": 4,
                    "operator": "!=",
                    "operCode": "neq",
                    "label": "not equal to"
                },
                {
                    "id": 5,
                    "operator": "<",
                    "operCode": "lt",
                    "label": "less than"
                },
                {
                    "id": 6,
                    "operator": "<=",
                    "operCode": "lte",
                    "label": "less than or equal to"
                },
                {
                    "id": 7,
                    "operator": ">",
                    "operCode": "gt",
                    "label": "greater than"
                },
                {
                    "id": 8,
                    "operator": ">=",
                    "operCode": "gte",
                    "label": "greater than or equal to"
                }
            ],
            "types": [
                {
                    "id": 1,
                    "type": "string",
                    "uiType": "textbox"
                },
                {
                    "id": 2,
                    "type": "autocomplete",
                    "uiType": "textbox"
                },
                {
                    "id": 3,
                    "type": "number",
                    "uiType": "numeric"
                },
                {
                    "id": 4,
                    "type": "money",
                    "uiType": "numeric"
                },
                {
                    "id": 5,
                    "type": "date",
                    "uiType": "datepicker"
                },
                {
                    "id": 6,
                    "type": "list",
                    "uiType": "combobox"
                },
                {
                    "id": 7,
                    "type": "bool",
                    "uiType": "checkbox"
                },
                {
                    "id": 8,
                    "type": "singleselect",
                    "uiType": "combobox"
                }
            ],
            "types2operator": [
                {
                    "type": "number",
                    "operator": [
                        "=",
                        "IN",
                        "!=",
                        "<",
                        "<=",
                        ">",
                        ">="
                    ]
                },
                {
                    "type": "money",
                    "operator": [
                        "=",
                        "IN",
                        "!=",
                        "<",
                        "<=",
                        ">",
                        ">="
                    ]
                },
                {
                    "type": "date",
                    "operator": [
                        "=",
                        "!=",
                        "<",
                        "<=",
                        ">",
                        ">="
                    ]
                },
                {
                    "type": "string",
                    "operator": [
                        "LIKE",
                        "=",
                        "!="
                    ]
                },
                {
                    "type": "autocomplete",
                    "operator": [
                        "LIKE",
                        "=",
                        "!="
                    ]
                },
                {
                    "type": "list",
                    "operator": [
                        "LIKE",
                        "="
                    ]
                },
                {
                    "type": "bool",
                    "operator": [
                        "=",
                        "!="
                    ]
                },
                {
                    "type": "singleselect",
                    "operator": [
                        "="
                    ]
                }
            ]
        };

        vm.ruleOptions = {
            placeholder: "Select a Rule ...",
            dataTextField: "Name",
            dataValueField: "Id",
            autoBind: false,
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.Rules);
                    }
                }
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
            dataTextField: "NAME",
            dataValueField: "EMP_WWID",
            valueTemplate: '<div class="tmpltItem">' +
            '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
            '<div class="fl tmpltContract"><div class="tmpltPrimary">#: data.NAME #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
            '<div class="fr tmpltRole">#: data.ROLE_NM #</div>' +
            '<div class="clearboth"></div>' +
            '</div>',
            template: '<div class="tmpltItem">' +
            '<div class="fl tmpltIcn"><i class="intelicon-email-message-solid"></i></div>' +
            '<div class="fl tmpltContract"><div class="tmpltPrimary" style="text-align: left;">#: data.NAME #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
            '<div class="clearboth"></div>' +
            '</div>',
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            valuePrimitive: true,
            filter: "contains",
            maxSelectedItems: 1,
            autoBind: true,
            dataSource: vm.ownerDs,
            change: function (e) {
                vm.rule.OwnerId = this.value();
            }
        };

        $scope.attributeSettings = [
            {
                field: "CRE_EMP_NAME",
                title: "Created by name",
                type: "singleselect",
                width: 150.0,
                lookupText: "NAME",
                lookupValue: "NAME",
                lookupUrl: "/api/Employees/GetUsrProfileRole"
            },
            {
                field: "DC_ID",
                title: "Deal #",
                type: "number",
                width: 150
            },
            {
                field: "OBJ_SET_TYPE_CD",
                title: "Deal Type",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ECAP" }]
            },
            {
                field: "CUST_NM",
                title: "Customer",
                type: "singleselect",
                width: 150.0,
                lookupText: "CUST_NM",
                lookupValue: "CUST_NM",
                lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
            },
            {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string",
                width: 150
            },
            {
                field: "GEO_COMBINED",
                title: "Customer Geo",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "APAC" }, { Value: "PRC" }, { Value: "ASMO" }, { Value: "EMEA" }]
            },
            {
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 150,
                dimKey: 20
            },
            {
                field: "CUST_TYPE",
                title: "Customer Type",
                type: "string",
                width: 150
            },
            {
                field: "OP_CD",
                title: "Op Code",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "HJ" }, { Value: "HE" }]
            },
            {
                field: "PRD_DIV",
                title: "Product Division",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ND" }]
            },
            {
                field: "PRODUCT_CATEGORIES",
                title: "Product Verticals",
                type: "string",
                width: 150
            },
            {
                field: "SERVER_DEAL_TYPE",
                title: "Server Deal Type",
                type: "singleselect",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
            },
            {
                field: "MRKT_SEG",
                title: "Market Segment",
                type: "singleselect",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
            },
            {
                field: "PAYOUT_BASED_ON",
                title: "Payout Based On",
                type: "singleselect",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
            },
            {
                field: "COMP_SKU",
                title: "Meet Comp Sku",
                type: "string",
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
                field: "VOLUME_INC",
                title: "Ceiling Volume Increase",
                type: "number",
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
                field: "END_DT_REDEAL",
                title: "End Date (Redeal)",
                type: "date",
                template: "#if(END_DT_REDEAL==null){#  #}else{# #= moment(END_DT_REDEAL).format('MM/DD/YYYY') # #}#",
                width: 150
            },
            {
                field: "BLKT_DISC",
                title: "Blanket Discount",
                type: "number",
                width: 150
            }
        ];

        vm.ProductCriteria = [{ "PRD_NM": "test product", "ECAP_PRICE": "10" }];

        vm.ProductCriteriaOptions = {
            scrollable: true,
            editable: true,
            width: 200,
            columns: [
                { field: "PRD_NM", title: "Product Name", width: "65%", filterable: { multi: false, search: false } },
                { field: "ECAP_PRICE", title: "ECAP", filterable: { multi: false, search: false } },
            ],
            dataBound: function (e) {
                var rowCount = this.dataSource.view().length;  // only get count for current page
                if (rowCount < 5) {
                    for (var i = 1; i < 5 - rowCount; i++) {
                        this.addRow();
                    }
                }
            },
            save: function (e) {
                vm.ProductCriteria= this.dataSource.view(); 
            },
        };

        vm.editRule = function (id) {
            vm.GetRules(id, "GET_BY_RULE_ID");
        }

        vm.copyRule = function (id) {
            var priceRuleCriteria = {
                Id: id
            }
            vm.RuleActions(priceRuleCriteria, "COPY");
        }

        vm.RuleActions = function (priceRuleCriteria, actionName) {
            ruleService.savePriceRule(priceRuleCriteria, actionName).then(function (response) {
                vm.Rules = response.data;
                vm.isEditmode = false;
                vm.dataSource.read();
                logger.success("Operation success");
            }, function (response) {
                logger.error("Operation failed");
            });
        };

        vm.GetRules = function (id, actionName) {
            ruleService.getPriceRules(id, actionName).then(function (response) {
                switch (actionName) {
                    case "GET_BY_RULE_ID": {
                        vm.rule = response.data[0];
                        vm.isEditmode = true;
                    } break;
                    default: {
                        vm.Rules = response.data;
                        vm.isEditmode = false;
                        vm.dataSource.read();
                    } break;
                }
            }, function (response) {
                logger.error("Operation failed");
            });
        };

        vm.deleteRule = function (id) {
            kendo.confirm("Are you sure wants to delete?").then(function () {
                var priceRuleCriteria = {
                    Id: id
                }
                vm.RuleActions(priceRuleCriteria, "DELETE");
            });
        };

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Rules);
                },
                update: function (e) {

                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Rule',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Rule ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {

                    }, function (response) {
                    });
                },
                create: function (e) {

                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                    }
                }
            },
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            columns: [
                {
                    width: "6%",
                    template: "<div class='rule'><i role='button' class='rulesGidIcon intelicon-edit' ng-click='vm.editRule(#= Id #)'></i><i role='button' class='rulesGidIcon intelicon-copy-solid' ng-click='vm.copyRule(#=Id #)'></i><i role='button' class='rulesGidIcon intelicon-trash-solid' ng-click='vm.deleteRule(#= Id #)'></i></div>"
                },
                { field: "Id", title: "Id", width: "5%", hidden: true },
                { field: "Name", title: "Name", width: "15%", filterable: { multi: true, search: true } },
                { field: "IsActive", title: "Is Active", filterable: { multi: true, search: true } },
                { field: "IsNormalRule", title: "Is Normal Rule", filterable: { multi: true, search: true } },
                { field: "RuleStatus", title: "Status", filterable: { multi: true, search: true } },
                { field: "StartDate", title: "Start Date", filterable: { multi: true, search: true } },
                { field: "EndDate", title: "End Date", filterable: { multi: true, search: true } },
                { field: "Notes", title: "Notes", filterable: { multi: true, search: true } },
                { field: "ChangedBy", title: "Changed By", filterable: { multi: true, search: true } },
                { field: "ChangeDateTime", title: "Change Date", filterable: { multi: true, search: true }, template: "#= kendo.toString(new Date(gridUtils.stripMilliseconds(ChangeDateTime)), 'M/d/yyyy hh:mm tt') #", },
            ]
        };

        vm.cancel = function () {
            vm.isEditmode = false;
            vm.rule = {};
        }

        vm.saveRule = function () {
            $rootScope.$broadcast('save-criteria');
            $timeout(function () {
                var requiredFields = [];
                if (vm.rule.Name == null || vm.rule.Name == "")
                    requiredFields.push("Rule name ");
                if (vm.rule.OwnerId == null || vm.rule.OwnerId == 0)
                    requiredFields.push("Rule owner ");
                if (vm.rule.StartDate == null)
                    requiredFields.push("Start date ");
                if (vm.rule.EndDate == null)
                    requiredFields.push("End date ");
                if (vm.rule.Criteria.filter(x => x.value != "").length == 0)
                    requiredFields.push("Rule criteria ");
                if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                    var dtEffFrom = new Date(vm.rule.StartDate);
                    var dtEffTo = new Date(vm.rule.EndDate);
                    if (dtEffFrom >= dtEffTo)
                        requiredFields.push("Effective from date cannot be greater than effective to date ");
                }

                if (requiredFields.length > 0) {
                    alert("Please fill the required fields!\n" + requiredFields.join());
                } else {
                    var priceRuleCriteria = {
                        Id: vm.rule.Id,
                        Name: vm.rule.Name,
                        OwnerId: vm.rule.OwnerId,
                        IsActive: vm.rule.IsActive,
                        IsNormalRule: vm.rule.IsNormalRule,
                        StartDate: vm.rule.StartDate,
                        EndDate: vm.rule.EndDate,
                        RuleStatus: vm.rule.RuleStatus,
                        Notes: vm.rule.Notes,
                        Criteria: vm.rule.Criteria.filter(x => x.value != ""),
                        ProductCriteria: {}
                    }
                    vm.RuleActions(priceRuleCriteria, (vm.rule.Id != undefined && vm.rule.Id != null && vm.rule.Id > 0 ? "UPDATE" : "CREATE"));
                }
            });
        }

        vm.addNewRule = function () {
            vm.rule.Id = 0;
            vm.isEditmode = true;
            vm.rule = {};
            vm.rule.IsNormalRule = true;
            vm.rule.IsActive = true;
            vm.rule.StartDate = new Date();
            vm.rule.Criteria = [{ "type": "singleselect", "field": "OBJ_SET_TYPE_CD", "operator": "=", "value": "ECAP" }];
        }

        vm.sendEmail = function () {
            alert('Todo: TADA!!')
        }

        $scope.init();
    }
})();