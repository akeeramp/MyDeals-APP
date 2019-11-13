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
        vm.isRuleTypeLoaded = false;
        vm.ruleTypeId = 0;

        $scope.init = function () {
            ruleService.getRuleTypes().then(function (response) {
                vm.RuleTypes = response.data;
                vm.isRuleTypeLoaded = true;
                vm.LoadRuleType();
                vm.ruleTypeId = response.data[0].Value;
                vm.GetRules(vm.ruleTypeId, "GET_BY_RULE_TYPE_ID");
            }, function (response) {
                logger.error("Unable to get rule type.", response, response.statusText);
            });
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

        vm.LoadRuleType = function () {
            vm.ruleTypeOptions = {
                placeholder: "Select a Rule Type...",
                dataTextField: "Text",
                dataValueField: "Value",
                autoBind: false,
                dataSource: {
                    type: "json",
                    serverFiltering: true,
                    transport: {
                        read: function (e) {
                            e.success(vm.RuleTypes);
                        }
                    }
                },
                change: function (e) {
                    vm.ruleTypeId = this.value();
                }
            };
        }

        vm.Rules = [];

        vm.rule = {};

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
            dataSource: vm.ownerDs,
            change: function (e) {
                vm.rule.OwnerId = this.value();
            }
        };

        $scope.attributeSettings = [
            {
                "field": "CRE_EMP_NAME",
                "title": "Created by name",
                "type": "autocomplete",
                "width": 150.0,
                "filterable": null,
                "lookupText": "Text",
                "lookupValue": "Value",
                "lookupUrl": "",
                "lookups": [
                    {
                        "Value": "/api/Rules/GetSuggestion/CRE_EMP_NAME",
                        "Text": "/api/Rules/GetSuggestion/CRE_EMP_NAME"
                    }
                ],
                "template": null,
                "dimKey": 0,
                "format": null
            },
            {
                "field": "OBJ_SET_TYPE_CD",
                "title": "Deal Type",
                "type": "list",
                "width": 150.0,
                "filterable": null,
                "lookupText": "Text",
                "lookupValue": "Value",
                "lookupUrl": "",
                "lookups": [
                    {
                        "Value": "ECAP",
                        "Text": "ECAP"
                    },
                    {
                        "Value": "KIT",
                        "Text": "KIT"
                    }
                ],
                "template": null,
                "dimKey": 0,
                "format": null
            },
            {
                "field": "CUST_NM",
                "title": "Customer",
                "type": "singleselect",
                "width": 150.0,
                "filterable": null,
                "lookupText": "CUST_NM",
                "lookupValue": "CUST_NM",
                "lookupUrl": "/api/Customers/GetMyCustomersNameInfo",
                "lookups": [],
                "template": null,
                "dimKey": 0,
                "format": null
            },
            {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string",
                width: 140
            }, {
                field: "GEO_COMBINED",
                title: "Geo",
                type: "string",
                width: 100
            }, {
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 400,
                dimKey: 20,
                filterable: "objFilter",
                template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
            }, {
                field: "CUST_ACCNT_DIV",
                title: "Division",
                type: "string",
                width: 140
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
            }
        ];

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
                vm.Rules = response.data;
                vm.isEditmode = false;
                vm.dataSource.read();
                if (actionName == "GET_BY_RULE_ID") {
                    vm.rule = vm.Rules.filter(function (x) {
                        return x.Id == id
                    })[0];
                    vm.isEditmode = true;
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
                { field: "IsActive", title: "IsActive", filterable: { multi: true, search: true } },
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
                if (vm.ruleTypeId == null || vm.ruleTypeId == 0)
                    requiredFields.push("Rule type");
                if (vm.rule.Name == null || vm.rule.Name == "")
                    requiredFields.push("Rule name");
                if (vm.rule.OwnerId == null || vm.rule.OwnerId == 0)
                    requiredFields.push("Rule owner");
                if (vm.rule.StartDate == null)
                    requiredFields.push("Start date");
                if (vm.rule.EndDate == null)
                    requiredFields.push("End date");
                if (vm.rule.Criteria.filter(x => x.value != "").length == 0)
                    requiredFields.push("Rule criteria");
                if (requiredFields.length > 0) {
                    alert("Please fill the required fields!\n" + requiredFields.join());
                } else {
                    var priceRuleCriteria = {
                        Id: vm.rule.Id,
                        RuleTypeId: vm.ruleTypeId,
                        Name: vm.rule.Name,
                        OwnerId: vm.rule.OwnerId,
                        IsActive: vm.rule.IsActive,
                        StartDate: vm.rule.StartDate,
                        EndDate: vm.rule.EndDate,
                        RuleStatus: false,
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
        }

        vm.sendEmail = function () {
            alert('Todo: TADA!!')
        }

        $scope.init();
    }
})();