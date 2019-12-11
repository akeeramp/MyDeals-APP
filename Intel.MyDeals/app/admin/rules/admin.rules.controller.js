(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleController', RuleController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    RuleController.$inject = ['$rootScope', 'ruleService', '$scope', 'logger', '$timeout', 'confirmationModal', 'gridConstants', 'constantsService']

    function RuleController($rootScope, ruleService, $scope, logger, $timeout, confirmationModal, gridConstants, constantsService) {
        var vm = this;
        vm.ruleId = 0;
        vm.isEditmode = false;
        vm.Rules = [];
        vm.rule = {};
        vm.RuleConfig = [];
        vm.BlanketDiscountDollor = "";
        vm.BlanketDiscountPercentage = "";
        vm.ProductCriteria = [];
        vm.isApprovedButtonReq = true;
        vm.adminEmailIDs = "";
        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                vm.RuleConfig = response.data;
            }, function (response) {
                logger.error("Operation failed");
            });

            vm.GetRules(0, "GET_RULES");
        }

        $scope.getConstant = function () {
            // If user has closed the banner message he wont see it for the current session again.
            constantsService.getConstantsByName("PRC_RULE_EMAIL").then(function (data) {
                if (!!data.data) {
                    vm.adminEmailIDs = data.data.CNST_VAL_TXT === "NA"
                        ? "" : data.data.CNST_VAL_TXT;
                    vm.isApprovedButtonReq = vm.adminEmailIDs.indexOf(usrEmail) > -1 ? false : true;
                }
            });
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
        var allowedRoleForCreatedBy = ['GA', 'FSE'];
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
                    if (vm.Rules.filter(x => x.Id === response.data.Id).length > 0) {
                        vm.Rules = vm.Rules.filter(x => x.Id !== response.data.Id);
                    }
                    var updatedRule = response.data;
                    updatedRule.OwnerName = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === updatedRule.OwnerId)[0].NAME;
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
                        var i;
                        if (availableAttrs.length === 0) {
                            for (i = 0; i < $scope.attributeSettings.length; i++)
                                availableAttrs.push($scope.attributeSettings[i].field);
                        }
                        vm.rule = response.data[0];
                        vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === vm.rule.OwnerId).length === 0 ? null : vm.rule.OwnerId;
                        vm.rule.Criteria = vm.rule.Criterias.Rules.filter(x => availableAttrs.indexOf(x.field) > -1);
                        for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                            if (vm.rule.Criteria[idx].type === "list") {
                                vm.rule.Criteria[idx].value = vm.rule.Criteria[idx].values;
                            }
                        }
                        vm.ProductCriteria = vm.rule.ProductCriteria;
                        vm.BlanketDiscountPercentage = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "%")[0].value : "";
                        vm.BlanketDiscountDollor = vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$").length > 0 ? vm.rule.Criterias.BlanketDiscount.filter(x => x.valueType.value === "$")[0].value : "";
                        $('#productCriteria').show();
                        vm.dataSourceSpreadSheet.read();
                        vm.DeleteSpreadsheetAutoHeader();
                        if (vm.ProductCriteria.length > 198) {
                            var sheet = $scope.spreadsheet.activeSheet();
                            for (i = 198; i <= vm.ProductCriteria.length; i++) {
                                if (vm.ProductCriteria[i - 1].ProductName !== "") {
                                    sheet.range("A" + i).value(vm.ProductCriteria[i - 1].ProductName);
                                    sheet.range("B" + i).value(vm.ProductCriteria[i - 1].Price);
                                }
                            }
                        }
                        vm.validateProduct(false, false, false);
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
            sheet.range("A1:A200").textAlign("left");
            sheet.range("B1:B200").textAlign("right");
            sheet.range("B1:B200").format('$#,##0.00');
            sheet.range("B1:B200").validation({
                dataType: "custom",
                from: 'REGEXP_MATCH(B1)',
                allowNulls: true,
                type: "reject",
                titleTemplate: "Invalid Price",
                messageTemplate: "Format of the price is invalid. This should be greater than zero."
            });
        }

        vm.deleteRule = function (id) {
            kendo.confirm("Are you sure wants to delete?").then(function () {
                ruleService.deletePriceRule(id).then(function (response) {
                    if (response.data > 0) {
                        vm.Rules = vm.Rules.filter(x => x.Id !== response.data);
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
            if (RULE_STAGE === true) {
                return 'A';
            } else {
                return 'P';
            }
        }
        vm.stageOneCharStatus = function (IsAutomationIncluded) {
            if (IsAutomationIncluded === true) {
                return 'intelicon-plus-solid clrGreen';
            } else {
                return 'intelicon-minus-solid clrRed';
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
            scrollable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: [25, 100, 500, "all"] //gridConstants.pageSizes
            },
            columns: [
                {
                    width: "160px",
                    template: "<div class='fl gridStatusMarker centerText #=RuleStage#' style='overflow: none !important' title='#if(RuleStage == true){#Approved#} else {#Pending Approval#}#'>{{ vm.stageOneChar(dataItem.RuleStage) }}</div ><div class='rule'><i title='#if(IsAutomationIncluded == true){#Inclusion Rule#} else {#Exclusion Rule#}#' class='rulesGidIcon {{ vm.stageOneCharStatus(dataItem.IsAutomationIncluded) }} dealTools'></i><i role='button' title='Edit' class='rulesGidIcon intelicon-edit dealTools' ng-click='vm.editRule(#= Id #)'></i><i role='button' title='Copy' class='rulesGidIcon intelicon-copy-solid dealTools' ng-click='vm.copyRule(#=Id #)'></i><i role='button' title='Delete' class='rulesGidIcon intelicon-trash-solid dealTools' ng-click='vm.deleteRule(#= Id #)'></i><i ng-if='vm.isApprovedButtonReq' role='button' title='Approve' class='rulesGidIcon intelicon-user-approved-selected-solid dealTools' ng-click='vm.approveRule(#= Id #)'></i></div>"
                },
                { field: "Id", title: "Id", width: "5%", hidden: true },
                {
                    title: "Name",
                    field: "Name",
                    template: "<div><a class='ruleName' title='Click to Edit' ng-click='vm.editRule(#= Id #)'>#= Name #</a></div>",
                    width: "20%",
                    filterable: { multi: true, search: true },
                    encoded: true
                },
                {
                    field: "RuleStage",
                    title: "RuleStage",
                    width: "1%",
                    hidden: true
                },
                {
                    field: "IsActive",
                    title: "Status",
                    filterable: { multi: true, search: true },
                    width: "7%",
                    template: "<toggle class='fl toggle-accept' on='Active' off='Inactive' size='btn-sm' offstyle = 'btn-danger' title='#if(IsActive == true){#Active#} else {#Inactive#}#' ng-model='dataItem.IsActive'>dataItem.IsActive</toggle>"
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
                    template: "<div title='#=ChangedBy# @#=ChangeDateTimeFormat#'>#=ChangedBy#<br><font style='font-size: 10px;'>#=ChangeDateTimeFormat#</font></div>",
                    width: "8%",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "ChangeDateTime",
                    title: "Updated Date",
                    template: "<div title='#=ChangeDateTime#'>#=ChangeDateTime#</div>",
                    width: "1%",
                    hidden: true
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
            var data = new Array();
            var dataRuleIds = [];
            dataRuleIds.push(parseInt(vm.rule.Id, 10));
            //dataRuleIds.push(65);  // Test for multiple, can remove
            var dataDealsIds = [];

            data.push(dataRuleIds, dataDealsIds);

            ruleService.getRuleSimulationResults(data).then(function (response) {
                if (response.data.length > 0) {
                    var maxSize = 100;
                    var matchedDealsList = response.data.slice(0, maxSize).map(function (data) { return " " + data["WIP_DEAL_SID"] });
                    var ruleType = vm.rule.IsAutomationIncluded === true ? "<b style='color:green;'>Approve Deals Rule</b>" : "<b style='color:red;'>Exclude Deals Rule</b>";
                    var postMessage = "<br>" + response.data.length + " deals matched this rule";
                    if (response.data.length > maxSize) postMessage += ", only the first " + maxSize + " are displayed";
                    kendo.alert("<span style='color: blue;'>Rule <b>" + vm.rule.Name + "</b> (" + ruleType + ") matches these deals: </span><br>" + matchedDealsList + "<span style='color: blue;'>" + postMessage + "<span>");
                } else {
                    kendo.alert("<b>This rule matches no deals presently</b>");
                }
            }, function (response) {
                logger.error("<b style='color:red;'>Error: Unable to Simulate the rule due to system error</b>");
            });
        }
        var invalidPrice = [];
        var duplicateProducts = [];
        var invalidProducts = [];
        vm.ValidateDuplicateInvalidProducts = function () {
            invalidPrice = [];
            $.each(vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price !== ""), function (index, value) {
                if ($.isNumeric(value.Price) === false || parseFloat(value.Price) <= 0)
                    invalidPrice.push(value.ProductName + " (" + value.Price + ")");
            });

            duplicateProducts = [];
            $.each(vm.ProductCriteria.filter(x => x.ProductName !== ""), function (index, value) {
                if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === value.ProductName.toLowerCase()).length > 1)
                    duplicateProducts.push(value.ProductName);
            });
            if (invalidProducts.length > 0) {
                var tempProductCriteria = vm.ProductCriteria.filter(x => x.ProductName !== "");
                vm.ProductCriteria = [];
                $.each($.unique(invalidProducts), function (index, value) {
                    var newProduct = {};
                    newProduct.ProductName = tempProductCriteria.filter(x => x.ProductName.toLowerCase() === value.toLowerCase())[0].ProductName;
                    newProduct.Price = tempProductCriteria.filter(x => x.ProductName.toLowerCase() === value.toLowerCase())[0].Price;
                    vm.ProductCriteria.push(newProduct);
                });
                $.each(tempProductCriteria, function (index, value) {
                    if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === value.ProductName.toLowerCase()).length === 0) {
                        var newProduct = {};
                        newProduct.ProductName = value.ProductName;
                        newProduct.Price = value.Price;
                        vm.ProductCriteria.push(newProduct);
                    }
                });
                vm.dataSourceSpreadSheet.read();
                vm.DeleteSpreadsheetAutoHeader();
                var sheet = $scope.spreadsheet.activeSheet();
                var i;
                if (vm.ProductCriteria.length > 198) {
                    for (i = 198; i <= vm.ProductCriteria.length; i++) {
                        if (vm.ProductCriteria[i - 1].ProductName !== "") {
                            sheet.range("A" + i).value(vm.ProductCriteria[i - 1].ProductName);
                            sheet.range("B" + i).value(vm.ProductCriteria[i - 1].Price);
                        }
                    }
                }
                for (i = 1; i <= vm.ProductCriteria.length; i++) {
                    var str = sheet.range("A" + i).value() != null ? jQuery.trim(sheet.range("A" + i).value()) : "";
                    if (str !== "") {
                        var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                        sheet.range("A" + i).color(isValid ? "green" : "black");
                    }
                }
            }
        }

        vm.saveRule = function (isWithEmail, isProductValidationRequired) {
            if (isProductValidationRequired)
                vm.validateProduct(false, true, isWithEmail);
            else {
                $rootScope.$broadcast('save-criteria');
                $timeout(function () {
                    var requiredFields = [];
                    if (vm.rule.Name == null || vm.rule.Name === "")
                        requiredFields.push("Rule name");
                    if (vm.rule.OwnerId == null || vm.rule.OwnerId === 0)
                        requiredFields.push("Rule owner");
                    if (vm.rule.StartDate == null)
                        requiredFields.push("Rule start date");
                    if (vm.rule.EndDate == null)
                        requiredFields.push("Rule end date");
                    if (vm.rule.Criteria.filter(x => x.value === "").length > 0)
                        requiredFields.push("Rule criteria is empty");
                    if (vm.ProductCriteria.filter(x => x.Price !== "" && x.Price > 0 && x.ProductName === "").length > 0)
                        requiredFields.push("Price in product criteria need product");

                    var validationFields = [];
                    if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                        var dtEffFrom = new Date(vm.rule.StartDate);
                        var dtEffTo = new Date(vm.rule.EndDate);
                        if (dtEffFrom >= dtEffTo)
                            validationFields.push("Rule start date cannot be greater than Rule end date");
                    }
                    if (vm.rule.OwnerId != undefined && vm.rule.OwnerId != null) {
                        if (vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.rule.OwnerId).length == 0)
                            validationFields.push("Owner cannot be invalid");
                    }
                    if (requiredFields.length > 0 || validationFields.length > 0 || invalidPrice.length > 0 || duplicateProducts.length > 0 || invalidProducts.length > 0) {
                        var strAlertMessage = "";
                        if (validationFields.length > 0) {
                            strAlertMessage = "<b>Following scenarios are failed!</b></br>" + validationFields.join("</br>");
                        }

                        if (invalidProducts.length > 0) {
                            if (strAlertMessage !== "")
                                strAlertMessage += "</br></br>";
                            strAlertMessage += "<b>Invalid products exist, please fix:</b></br>" + $.unique(invalidProducts).join("</br>");
                        }

                        if (requiredFields.length > 0) {
                            if (strAlertMessage !== "")
                                strAlertMessage += "</br></br>";
                            strAlertMessage += "<b>Please fill the following required fields!</b></br>" + requiredFields.join("</br>");
                        }
                        if (invalidPrice.length > 0) {
                            if (strAlertMessage !== "")
                                strAlertMessage += "</br></br>";
                            strAlertMessage += "<b>Below products has invalid price!</b></br>" + invalidPrice.join("</br>");
                        }

                        if (duplicateProducts.length > 0) {
                            if (strAlertMessage !== "")
                                strAlertMessage += "</br></br>";
                            strAlertMessage += "<b>Duplicate products found!</b></br>" + $.unique(duplicateProducts).join("</br>");
                        }

                        kendo.alert(strAlertMessage);
                    } else {
                        for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                            if (vm.rule.Criteria[idx].type === "list") {
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
                            Criterias: { Rules: vm.rule.Criteria.filter(x => x.value !== ""), BlanketDiscount: [{ value: vm.BlanketDiscountPercentage, valueType: { value: "%" } }, { value: vm.BlanketDiscountDollor, valueType: { value: "$" } }] },
                            ProductCriteria: vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price > 0 && x.Price !== "")
                        }
                        vm.UpdateRuleActions(priceRuleCriteria, isWithEmail);
                    }
                });
            }
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
                    from: 'REGEXP_MATCH(B1)',
                    allowNulls: true,
                    type: "reject",
                    titleTemplate: "Invalid Price",
                    messageTemplate: "Format of the price is invalid. This should be greater than zero."
                });
                for (var i = 2; i < 50; i++)
                    sheet.hideColumn(i);
                $('#productCriteria').hide();
            }
        });

        $scope.spreadSheetOptions = {
            change: function (arg) {
                var str = arg.range.value() != null ? jQuery.trim(arg.range.value()) : "";
                if (str !== "") {
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
        vm.validateProduct = function (showPopup, isSave, isWithMail) {
            vm.generateProductCriteria();
            if (vm.ProductCriteria.length > 0) {
                vm.LastValidatedProducts = [];
                for (var i = 0; i < vm.ProductCriteria.length; i++) {
                    if (jQuery.inArray(vm.ProductCriteria[i].ProductName.toLowerCase(), vm.LastValidatedProducts) === -1)
                        vm.LastValidatedProducts.push(vm.ProductCriteria[i].ProductName.toLowerCase());
                }
                ruleService.validateProducts(vm.LastValidatedProducts).then(function (response) {
                    vm.ValidProducts = response.data;
                    invalidProducts = [];
                    $.each($.unique($(vm.LastValidatedProducts.filter(x => x !== "")).not(vm.ValidProducts.filter(x => x !== ""))), function (index, value) {
                        invalidProducts.push(value.toLowerCase());
                    });
                    vm.ValidateProductSheet();
                    vm.ValidateDuplicateInvalidProducts();
                    if (isSave) {
                        vm.saveRule(isWithMail, false);
                    }                    
                    if (showPopup) {
                        if (invalidProducts.length > 0 || invalidPrice.length > 0 || duplicateProducts.length > 0) {
                            var strAlertMessage = "";
                            if (invalidProducts.length > 0) {
                                strAlertMessage += "<b>Invalid products exist, please fix:</b></br>" + $.unique(invalidProducts).join("</br>");
                            }
                            if (invalidPrice.length > 0) {
                                if (strAlertMessage !== "")
                                    strAlertMessage += "</br></br>";
                                strAlertMessage += "<b>Below products has invalid price!</b></br>" + invalidPrice.join("</br>");
                            }

                            if (duplicateProducts.length > 0) {
                                if (strAlertMessage !== "")
                                    strAlertMessage += "</br></br>";
                                strAlertMessage += "<b>Duplicate products found!</b></br>" + $.unique(duplicateProducts).join("</br>");
                            }

                            kendo.alert(strAlertMessage);
                        } else if (vm.ValidProducts.filter(x => x !== "").length === vm.LastValidatedProducts.filter(x => x !== "").length)
                            kendo.alert("<b>All Products are Valid</b></br>");
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

        kendo.spreadsheet.defineFunction("REGEXP_MATCH", function (str) {
            return $.isNumeric(str) && parseFloat(str) > 0;
        }).args([["str", "string"]]);

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
            vm.rule.EndDate = vm.RuleConfig.DefaultEndDate;
            vm.rule.Criteria = [{ "type": "singleselect", "field": "OBJ_SET_TYPE_CD", "operator": "=", "value": "ECAP" }];
            vm.BlanketDiscountPercentage = "";
            vm.BlanketDiscountDollor = "";
            vm.rule.OwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID === vm.RuleConfig.CurrentUserWWID).length === 0 ? null : vm.RuleConfig.CurrentUserWWID;
        }

        //Export to Excel
        vm.exportToExcel = function () {
            gridUtils.dsToExcelPriceRule(vm.gridOptions, vm.gridOptions.dataSource, "Price Rule Export.xlsx", false);
        }
        $scope.getConstant();
        $scope.init();
    }
})();