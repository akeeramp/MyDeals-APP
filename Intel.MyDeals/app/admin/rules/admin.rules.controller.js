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
        vm.BlanketDiscountDollor = "";
        vm.BlanketDiscountPercentage = "";

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
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.RuleConfig.DA_Users);
                    }
                }
            },
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
                lookupValue: "EMP_WWID",
                lookupUrl: "/api/Employees/GetUsrProfileRole"
            },
            {
                field: "WIP_DEAL_OBJ_SID",
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
                lookupValue: "CUST_SID",
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
                title: "Deal Geo",
                type: "list",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Worldwide" }, { Value: "APAC" }, { Value: "PRC" }, { Value: "ASMO" }, { Value: "EMEA" }]
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
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ECAP", Value: "VOL_TIER", Value: "KIT", Value: "PROGRAM" }]
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

        vm.editRule = function (id) {
            vm.GetRules(id, "GET_BY_RULE_ID");
        }

        vm.copyRule = function (id) {
            ruleService.copyPriceRule(id).then(function (response) {
                if (response.data > 0) {
                    var sourceRule = vm.Rules.filter(x => x.Id == id)[0];
                    var copiedRule = {};
                    copiedRule.Id = response.data;
                    copiedRule.Name = sourceRule.Name + " (Copy)";
                    copiedRule.RuleStage = false;
                    copiedRule.ChangeDateTime = new Date();
                    copiedRule.ChangedBy = vm.RuleConfig.CurrentUserName;
                    copiedRule.IsActive = sourceRule.IsActive;
                    copiedRule.IsAutomationIncluded = sourceRule.IsAutomationIncluded;
                    copiedRule.StartDate = sourceRule.StartDate;
                    copiedRule.EndDate = sourceRule.EndDate;
                    copiedRule.Notes = sourceRule.Notes;
                    copiedRule.OwnerName = sourceRule.OwnerName;
                    vm.Rules.splice(0, 0, copiedRule);
                    vm.dataSource.read();
                    logger.success("Rule has been copied");
                    vm.editRule(copiedRule.Id);
                } else {
                    logger.error("Unable to copy the rule");
                }
            }, function (response) {
                logger.error("Unable to copy the rule");
            });
        }

        vm.UpdateRuleActions = function (priceRuleCriteria, isWithEmail) {
            ruleService.updatePriceRule(priceRuleCriteria, isWithEmail).then(function (response) {
                if (response.data.Id > 0) {
                    if (vm.Rules.filter(x => x.Id == response.data.Id).length > 0) {
                        vm.Rules = vm.Rules.filter(x => x.Id != response.data.Id);
                    }
                    var updatedRule = response.data;
                    updatedRule.OwnerName = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == updatedRule.OwnerId)[0].NAME;
                    vm.Rules.splice(0, 0, updatedRule);
                    vm.isEditmode = false;
                    vm.dataSource.read();                    
                    logger.success("Rule has been updated");
                } else {
                    kendo.alert("This rule name already exists in another rule.");
                }
            }, function (response) {
                logger.error("Unable to update the rule");
            });
        };

        vm.EditBlanketDiscountPercentage = function () {
            vm.BlanketDiscountDollor = "";
        };

        vm.EditBlanketDiscountDollor = function () {
            vm.BlanketDiscountPercentage = "";
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
                        vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.rule.OwnerId).length == 0 ? null : vm.rule.OwnerId;
                        vm.rule.Criteria = vm.rule.Criterias.Rules.filter(x => availableAttrs.indexOf(x.field) > -1);
                        for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                            if (vm.rule.Criteria[idx].type == "list") {
                                vm.rule.Criteria[idx].value = vm.rule.Criteria[idx].values;
                            }
                        }
                        vm.BlanketDiscountPercentage = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "%").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "%")[0].value : "";
                        vm.BlanketDiscountDollor = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "$").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "$")[0].value : "";
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
                ruleService.deletePriceRule(id).then(function (response) {
                    if (response.data > 0) {
                        vm.Rules = vm.Rules.filter(x => x.Id != response.data);
                        vm.dataSource.read();
                        logger.success("Rule has been deleted");
                    }
                }, function (response) {
                    logger.error("Unable to delete the rule");
                });
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
                    requiredFields.push("</br>Rule start date");
                if (vm.rule.EndDate == null)
                    requiredFields.push("</br>Rule end date");
                if (vm.rule.Criteria.filter(x => x.value != "").length == 0)
                    requiredFields.push("</br>Rule criteria");

                var validationFields = [];
                if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                    var dtEffFrom = new Date(vm.rule.StartDate);
                    var dtEffTo = new Date(vm.rule.EndDate);
                    if (dtEffFrom >= dtEffTo)
                        validationFields.push("</br>Rule start date cannot be greater than Rule end date");
                }
                if (vm.rule.OwnerId != undefined && vm.rule.OwnerId != null) {
                    if (vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.rule.OwnerId).length == 0)
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
                            vm.rule.Criteria[idx].values = vm.rule.Criteria[idx].value;
                            vm.rule.Criteria[idx].value = "-";
                        } else {
                            vm.rule.Criteria[idx].values = [];
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
                        Criterias: { Rules: vm.rule.Criteria.filter(x => x.value != ""), BlanketDiscount: [{ value: vm.BlanketDiscountPercentage, valueType: { value: "%" } }, { value: vm.BlanketDiscountDollor, valueType: { value: "$" } }] }
                    }
                    vm.UpdateRuleActions(priceRuleCriteria, isWithEmail);
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
            vm.BlanketDiscountPercentage = "";
            vm.BlanketDiscountDollor = "";
            vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.RuleConfig.CurrentUserWWID).length == 0 ? null : vm.RuleConfig.CurrentUserWWID;
        }

        $scope.init();
    }
})();