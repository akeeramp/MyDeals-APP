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
        vm.ProductCriteria = [];

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
                        //"IN",
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
                        //"IN",
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
                        //"IN",
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
                        "IN",
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
                field: "PRODUCT_CATEGORIES",
                title: "Product Verticals",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ECAP" }, { Value: "VOL_TIER" }, { Value: "KIT" }, { Value: "PROGRAM" }]
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
                title: "End Date Push Days",
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
                    $('#productCriteria').hide();
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
                        vm.ProductCriteria = vm.rule.ProductCriteria;
                        vm.BlanketDiscountPercentage = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "%").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "%")[0].value : "";
                        vm.BlanketDiscountDollor = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "$").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value == "$")[0].value : "";
                        $('#productCriteria').show();
                        vm.dataSourceSpreadSheet.read();
                        vm.DeleteSpreadsheetAutoHeader();
                        vm.validateProduct(false);
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

        vm.DeleteSpreadsheetAutoHeader = function () {
            var sheet = $scope.spreadsheet.activeSheet();
            sheet.deleteRow(0);
            sheet.range("A1:A200").color("black");
        }

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

        //Take first character of WF_STG_CD
        vm.stageOneChar = function (RULE_STAGE) {
            if (RULE_STAGE == true) {
                return 'A';
            } else {
                return 'P';
            }
        }
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
            sort: { field: "RuleStage", dir: "asc" },
            schema: {
                model: {
                    id: "Id",
                    fields: {
                    }
                }
            },
        });

        vm.gridOptions = {
            toolbar: [
                { text: "", template: kendo.template($("#grid_toolbar_addrulebutton").html()) }
            ],
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
                pageSizes: [25, 100, 500, "all"] //gridConstants.pageSizes
            },
            columns: [
                {
                    width: "100px",
                    template: "<div class='fl gridStatusMarker centerText #=RuleStage#' title='#if(RuleStage == true){#Approved#} else {#Pending Approval#}#'>{{ vm.stageOneChar(dataItem.RuleStage) }}</div > <div class='rule'><i role='button' title='Edit' class='rulesGidIcon intelicon-edit dealTools' ng-click='vm.editRule(#= Id #)'></i><i role='button' title='Copy' class='rulesGidIcon intelicon-copy-solid dealTools' ng-click='vm.copyRule(#=Id #)'></i><i role='button' title='Delete' class='rulesGidIcon intelicon-trash-solid dealTools' ng-click='vm.deleteRule(#= Id #)'></i></div>"
                },
                { field: "Id", title: "Id", width: "5%", hidden: true },
                {
                    title: "Name",
                    field: "Name",
                    template: "<div><a class='ruleName' title='Click to Edit' ng-click='vm.editRule(#= Id #)'>#= Name #</a></div>",
                    width: "20%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "IsActive", title: "Status", filterable: { multi: true, search: true }, width: "7%",
                    template: "<toggle class='fl toggle-accept' size='btn-sm' title='#if(IsActive == true){#Active#} else {#Inactive#}#' ng-model='dataItem.IsActive'>dataItem.IsActive</toggle>"
                },
                {
                    field: "IsAutomationIncluded", title: "Automation", filterable: { multi: true, search: true }, hidden: true,
                    template: "<span ng-if='#= IsAutomationIncluded #'><i class='intelicon-opportunity-target-approved' style=''></i></span><span ng-if='!#= IsAutomationIncluded #'>Excluded</span>"
                },
                {
                    field: "StartDate",
                    title: "Start Date",
                    width: "7%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "EndDate",
                    title: "End Date",
                    width: "7%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "OwnerName",
                    title: "Owner Name",
                    template: "<div title='#=OwnerName#'>#=OwnerName#</div>",
                    width: "8%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "ChangedBy",
                    title: "Updated By",
                    template: "<div title='#=ChangedBy#'>#=ChangedBy#<br><font style='font-size: 10px;'>#=ChangeDateTimeFormat#</font></div>",
                    width: "8%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "Notes",
                    title: "Notes",
                    template: "<div title='#=Notes#'>#=Notes#</div>",
                    width: "15%",
                    filterable: { multi: true, search: false }
                }
            ]
        };

        vm.cancel = function () {
            $('#productCriteria').hide();
            vm.isEditmode = false;
            vm.rule = {};
        }

        vm.generateProductCriteria = function () {
            var sheet = $scope.spreadsheet.activeSheet();
            vm.ProductCriteria = [];
            for (var i = 0; i < sheet.range("A1:B200").values().length; i++) {
                var newProduct = {};
                newProduct.ProductName = sheet.range("A1:B200").values()[i][0] != null ? jQuery.trim(sheet.range("A1:B200").values()[i][0]) : '';
                newProduct.Price = sheet.range("A1:B200").values()[i][1] != null ? sheet.range("A1:B200").values()[i][1] : 0;
                vm.ProductCriteria.push(newProduct);
            }
        }

        vm.simulate = function () {
            var data = [];
            data.push(vm.rule.Id, 0);

            ruleService.getRuleSimulationResults(data).then(function (response) {
                if (response.data.Id > 0) {
                    //if (vm.Rules.filter(x => x.Id == response.data.Id).length > 0) {
                    //    vm.Rules = vm.Rules.filter(x => x.Id != response.data.Id);
                    //}
                    //var updatedRule = response.data;
                    //updatedRule.OwnerName = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == updatedRule.OwnerId)[0].NAME;
                    //vm.Rules.splice(0, 0, updatedRule);
                    //$('#productCriteria').hide();
                    //vm.isEditmode = false;
                    //vm.dataSource.read();
                    //logger.success("Rule has been updated");
                } else {
                    kendo.alert("This rule has no hits.");
                }
            }, function (response) {
                logger.error("Unable to Simulate the rule");
            });
        }

        vm.saveRule = function (isWithEmail) {
            $rootScope.$broadcast('save-criteria');
            $timeout(function () {
                var requiredFields = [];
                vm.generateProductCriteria();
                if (vm.rule.Name == null || vm.rule.Name == "")
                    requiredFields.push("</br>Rule name");
                if (vm.rule.OwnerId == null || vm.rule.OwnerId == 0)
                    requiredFields.push("</br>Rule owner");
                if (vm.rule.StartDate == null)
                    requiredFields.push("</br>Rule start date");
                if (vm.rule.EndDate == null)
                    requiredFields.push("</br>Rule end date");
                if (vm.rule.Criteria.filter(x => x.value == "").length > 0)
                    requiredFields.push("</br>Rule criteria is empty");
                if (vm.ProductCriteria.filter(x => (x.Price == 0 || x.Price == '') && x.ProductName != '').length > 0)
                    requiredFields.push("</br>Product in product criteria needs price");
                if (vm.ProductCriteria.filter(x => x.Price != '' && x.Price > 0 && x.ProductName == '').length > 0)
                    requiredFields.push("</br>Price in product criteria need product");

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

                var invalidPrice = [];
                $.each(vm.ProductCriteria.filter(x => x.ProductName != '' && x.Price != ''), function (index, value) {
                    var rx = new RegExp(regexMoney);
                    if (rx.test(value.Price) == false)
                        invalidPrice.push("</br>" + value.ProductName + " (" + value.Price + ")");
                });

                if (requiredFields.length > 0 || validationFields.length > 0 || invalidPrice.length > 0) {
                    var strAlertMessage = '';
                    if (validationFields.length > 0) {
                        strAlertMessage = "<b>Following scenarios are failed!</b>" + validationFields.join();
                    }
                    if (requiredFields.length > 0) {
                        if (strAlertMessage != '')
                            strAlertMessage += "</br></br>";
                        strAlertMessage += "<b>Please fill the following required fields!</b>" + requiredFields.join();
                    }
                    if (invalidPrice.length > 0) {
                        if (strAlertMessage != '')
                            strAlertMessage += "</br></br>";
                        strAlertMessage += "<b>Below products has invalid price!</b>" + invalidPrice.join();
                    }
                    kendo.alert(strAlertMessage);
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
                        Criterias: { Rules: vm.rule.Criteria.filter(x => x.value != ""), BlanketDiscount: [{ value: vm.BlanketDiscountPercentage, valueType: { value: "%" } }, { value: vm.BlanketDiscountDollor, valueType: { value: "$" } }] },
                        ProductCriteria: vm.ProductCriteria.filter(x => x.ProductName != '' && x.Price > 0 && x.Price != '')
                    }
                    vm.UpdateRuleActions(priceRuleCriteria, isWithEmail);
                }
            });
        }

        var regexMoney = "^[0-9]+(\.[0-9]{1,2})?$";
        $scope.sheets = [{ name: "Sheet1" }];
        $scope.$on("kendoWidgetCreated", function (event, widget) {
            // the event is emitted for every widget; if we have multiple
            // widgets in this controller, we need to check that the event
            // is for the one we're interested in.
            if (widget === $scope.spreadsheet) {
                var sheets = $scope.spreadsheet.sheets();
                $scope.spreadsheet.activeSheet(sheets[0]);
                var sheet = $scope.spreadsheet.activeSheet();
                sheet.setDataSource(vm.dataSourceSpreadSheet, ["ProductName", "Price"]);
                sheet.columnWidth(0, 350);
                sheet.columnWidth(1, 202);
                sheet.deleteRow(0);
                sheet.range("A1:A200").textAlign("left");
                sheet.range("B1:B200").textAlign("right");
                sheet.range("B1:B200").format('$#,##0.00');
                sheet.range("B1:B200").validation({
                    dataType: "custom",
                    from: 'REGEXP_MATCH(B1, "' + regexMoney + '")',
                    allowNulls: true,
                    type: "reject",
                    titleTemplate: "Invalid Price",
                    messageTemplate: "Format of the price is invalid"
                });
                for (var i = 2; i < 50; i++)
                    sheet.hideColumn(i);
                $('#productCriteria').hide();
            }
        });

        $scope.spreadSheetOptions = {
            change: function (arg) {
                var str = arg.range.value() != null ? jQuery.trim(arg.range.value()) : '';
                if (str != '') {
                    var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                    arg.range.color(isValid ? "green" : "black");
                }
            }
        };

        kendo.spreadsheet.defineFunction("IS_PRODUCT_VALID", function (str) {
            str = jQuery.trim(str);
            var isValid = true;
            if (jQuery.inArray(str.toLowerCase(), vm.LastValidatedProducts) > -1) {
                isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
            }
            return isValid;
        }).args([["str", "string"]]);

        vm.ValidateProductSheet = function () {
            var sheet = $scope.spreadsheet.activeSheet();
            sheet.range("A1:A200").validation({
                dataType: "custom",
                from: 'IS_PRODUCT_VALID(A1)',
                allowNulls: true,
                messageTemplate: "Product not found!"
            });
        }

        vm.ValidProducts = [];
        vm.LastValidatedProducts = [];
        vm.validateProduct = function (showPopup) {
            vm.generateProductCriteria();
            if (vm.ProductCriteria.length > 0) {
                vm.LastValidatedProducts = [];
                for (var i = 0; i < vm.ProductCriteria.length; i++) {
                    if (jQuery.inArray(vm.ProductCriteria[i].ProductName.toLowerCase(), vm.LastValidatedProducts) == -1)
                        vm.LastValidatedProducts.push(vm.ProductCriteria[i].ProductName.toLowerCase());
                }
                ruleService.validateProducts(vm.LastValidatedProducts).then(function (response) {
                    vm.ValidProducts = response.data;
                    vm.ValidateProductSheet();
                    if (showPopup) {
                        if (vm.ValidProducts.filter(x => x != '').length == vm.LastValidatedProducts.filter(x => x != '').length)
                            kendo.alert("<b>All Products are Valid</b></br>");
                        //else
                        //    kendo.alert("<b>Invalid Products:</b></br>" + vm.ValidProducts.join(", "));
                    }
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
            else {
                if (showPopup)
                    kendo.alert("<b>There are no Products to Validate</b></br>");
            }
        }

        kendo.spreadsheet.defineFunction("REGEXP_MATCH", function (str, pattern, flags) {
            var rx;
            try {
                rx = flags ? new RegExp(pattern, flags) : new RegExp(pattern);
            } catch (ex) {
                // could not compile regexp, return some error code
                return new kendo.spreadsheet.CalcError("REGEXP");
            }
            return rx.test(str);
        }).args([["str", "string"], ["pattern", "string"], ["flags", ["or", "string", "null"]]]);

        vm.dataSourceSpreadSheet = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.ProductCriteria);
                }
            }
        });

        vm.addNewRule = function () {
            vm.ProductCriteria = [];
            $('#productCriteria').show();
            vm.LastValidatedProducts = [];
            vm.ValidProducts = [];
            vm.dataSourceSpreadSheet.read();
            vm.DeleteSpreadsheetAutoHeader();
            vm.isEditmode = true;
            vm.rule = {};
            vm.rule.Id = 0;
            vm.rule.IsAutomationIncluded = true;
            vm.rule.IsActive = true;
            vm.rule.StartDate = new Date();
            vm.rule.EndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)); // Doesn't seem to be populating new item as expected
            vm.rule.Criteria = [{ "type": "singleselect", "field": "OBJ_SET_TYPE_CD", "operator": "=", "value": "ECAP" }];
            vm.BlanketDiscountPercentage = "";
            vm.BlanketDiscountDollor = "";
            vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.RuleConfig.CurrentUserWWID).length == 0 ? null : vm.RuleConfig.CurrentUserWWID;
        }

        $scope.init();
    }
})();