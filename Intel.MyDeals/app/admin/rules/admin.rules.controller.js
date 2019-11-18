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
        vm.RuleConfig = [];

        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                vm.RuleConfig = response.data;
            }, function (response) {
                logger.error("Operation failed");
            });

            vm.GetRules(0, "GET_RULES");
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
                    "type": "numericOrPercentage",
                    "operator": [
                        "=",
                        "IN",
                        "!=",
                        "<",
                        "<=",
                        ">",
                        ">="
                    ],
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
                    url: "/api/Employees/GetUsrProfileByRole/DA",
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
                type: "list",
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
                type: "list",
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
                type: "list",
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
                field: "HAS_TRCK",
                title: "Has Tracker",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Yes" }, { Value: "No" }]
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
                vm.ProductCriteria = this.dataSource.view();
            },
        };

        vm.editRule = function (id) {
            vm.GetRules(id, "GET_BY_RULE_ID");
        }

        vm.copyRule = function (id) {
            var priceRuleCriteria = {
                Id: id
            }
            vm.RuleActions(priceRuleCriteria, "COPY", false);
        }

        vm.RuleActions = function (priceRuleCriteria, actionName, isWithEmail) {
            ruleService.savePriceRule(priceRuleCriteria, actionName, isWithEmail).then(function (response) {
                vm.Rules = response.data;
                vm.isEditmode = false;
                vm.dataSource.read();
                logger.success("Operation success");
            }, function (response) {
                logger.error("Operation failed");
            });
        };

        var availableAttrs = [];

        vm.GetRules = function (id, actionName) {
            ruleService.getPriceRules(id, actionName).then(function (response) {
                switch (actionName) {
                    case "GET_BY_RULE_ID": {
                        if (availableAttrs.length == 0) {
                            for (var i = 0; i < $scope.attributeSettings.length; i++)
                                availableAttrs.push($scope.attributeSettings[i].field);
                        }
                        vm.rule = response.data[0];
                        vm.rule.OwnerId = vm.ownerDs._data.filter(x => x.EMP_WWID == vm.rule.OwnerId).length == 0 ? null : vm.rule.OwnerId;
                        vm.rule.Criteria = vm.rule.Criteria.filter(x => availableAttrs.indexOf(x.field) > -1);
                        for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                            if (vm.rule.Criteria[idx].type == "list") {
                                vm.rule.Criteria[idx].value = vm.rule.Criteria[idx].multiValue;
                            }
                        }
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
                vm.RuleActions(priceRuleCriteria, "DELETE", false);
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
                { field: "OwnerName", title: "Owner Name", width: "15%", filterable: { multi: true, search: true } },
                { field: "RuleStage", title: "Rule Stage", filterable: { multi: true, search: true }, template: "<span ng-if='#= RuleStage #'>Approved</span><span ng-if='!#= RuleStage #'>Pending</span>" },
                { field: "IsActive", title: "Status", filterable: { multi: true, search: true }, template: "<span ng-if='#= IsActive #'>Active</span><span ng-if='!#= IsActive #'>Inactive</span>" },
                { field: "IsAutomationIncluded", title: "Automation", filterable: { multi: true, search: true }, template: "<span ng-if='#= IsAutomationIncluded #'>Included</span><span ng-if='!#= IsAutomationIncluded #'>Excluded</span>" },
                { field: "StartDate", title: "Rule Start Date", filterable: { multi: true, search: true } },
                { field: "EndDate", title: "Rule End Date", filterable: { multi: true, search: true } },
                { field: "Notes", title: "Notes", filterable: { multi: true, search: true } },
                { field: "ChangedBy", title: "Updated By", filterable: { multi: true, search: true } }
            ]
        };

        vm.cancel = function () {
            vm.isEditmode = false;
            vm.rule = {};
        }

        vm.saveRule = function (isWithEmail) {
            $rootScope.$broadcast('save-criteria');
            $timeout(function () {
                var requiredFields = [];
                if (vm.rule.Name == null || vm.rule.Name == "")
                    requiredFields.push("</br>Rule name");
                if (vm.rule.OwnerId == null || vm.rule.OwnerId == 0)
                    requiredFields.push("</br>Rule owner");
                if (vm.rule.StartDate == null)
                    requiredFields.push("</br>Start date");
                if (vm.rule.EndDate == null)
                    requiredFields.push("</br>End date");
                if (vm.rule.Criteria.filter(x => x.value != "").length == 0)
                    requiredFields.push("</br>Rule criteria");

                var validationFields = [];
                if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                    var dtEffFrom = new Date(vm.rule.StartDate);
                    var dtEffTo = new Date(vm.rule.EndDate);
                    if (dtEffFrom >= dtEffTo)
                        validationFields.push("</br>Effective from date cannot be greater than effective to date");
                }
                if (vm.rule.OwnerId != undefined && vm.rule.OwnerId != null) {
                    if (vm.ownerDs._data.filter(x => x.EMP_WWID == vm.rule.OwnerId).length == 0)
                        validationFields.push("</br>Owner cannot be invalid");
                }

                if (requiredFields.length > 0 || validationFields.length > 0) {
                    var strAlertMessege = '';
                    if (validationFields.length > 0) {
                        strAlertMessege = "<b>Following scenarios are failed!</b>" + validationFields.join();
                    }
                    if (requiredFields.length > 0) {
                        if (strAlertMessege != '')
                            strAlertMessege += "</br></br>";
                        strAlertMessege += "<b>Please fill the following required fields!</b>" + requiredFields.join();
                    }
                    kendo.alert(strAlertMessege);
                } else {
                    for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                        if (vm.rule.Criteria[idx].type == "list") {
                            vm.rule.Criteria[idx].multiValue = vm.rule.Criteria[idx].value;
                            vm.rule.Criteria[idx].value = "-";
                        } else {
                            vm.rule.Criteria[idx].multiValue = [];
                        }
                    }
                    var priceRuleCriteria = {
                        Id: vm.rule.Id,
                        Name: vm.rule.Name,
                        OwnerId: vm.rule.OwnerId,
                        IsActive: vm.rule.IsActive,
                        IsAutomationIncluded: vm.rule.IsAutomationIncluded,
                        StartDate: vm.rule.StartDate,
                        EndDate: vm.rule.EndDate,
                        RuleStage: vm.rule.RuleStage,
                        Notes: vm.rule.Notes,
                        Criteria: vm.rule.Criteria.filter(x => x.value != ""),
                        ProductCriteria: {}
                    }
                    vm.RuleActions(priceRuleCriteria, (vm.rule.Id != undefined && vm.rule.Id != null && vm.rule.Id > 0 ? "UPDATE" : "CREATE"), isWithEmail);
                }
            });
        }

        vm.addNewRule = function () {
            vm.isEditmode = true;
            vm.rule = {};
            vm.rule.Id = 0;
            vm.rule.IsAutomationIncluded = true;
            vm.rule.IsActive = true;
            vm.rule.StartDate = new Date();
            vm.rule.Criteria = [{ "type": "singleselect", "field": "OBJ_SET_TYPE_CD", "operator": "=", "value": "ECAP" }];
            vm.rule.OwnerId = vm.ownerDs._data.filter(x => x.EMP_WWID == vm.RuleConfig.CurrentUserWWID).length == 0 ? null : vm.RuleConfig.CurrentUserWWID;
        }

        $scope.init();
    }
})();