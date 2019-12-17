(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleController', RuleController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    RuleController.$inject = ['$rootScope', '$location', 'ruleService', '$scope', '$stateParams', 'logger', '$timeout', 'confirmationModal', 'gridConstants', 'constantsService', '$uibModal', 'rid']

    function RuleController($rootScope, $location, ruleService, $scope, $stateParams, logger, $timeout, confirmationModal, gridConstants, constantsService, $uibModal, rid) {
        var vm = this;
        vm.reloadNotReq = false;
        vm.rid = rid;
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

        vm.openRulesSimulation = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'rulesSimulationModal',
                controller: 'rulesSimulationModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return angular.copy(dataItem);
                    }
                }
            });

            modalInstance.result.then(function (returnData) {
                //if (returnData !== undefined && returnData !== null) {
                //    $scope.context.USR_CUST = returnData;
                //}
            }, function () { });
        }

        $scope.getConstant = function () {
            // If user has closed the banner message he wont see it for the current session again.
            constantsService.getConstantsByName("PRC_RULE_EMAIL").then(function (data) {
                if (!!data.data) {
                    vm.adminEmailIDs = data.data.CNST_VAL_TXT === "NA"
                        ? "" : data.data.CNST_VAL_TXT;
                    vm.isApprovedButtonReq = vm.adminEmailIDs.indexOf(usrEmail) > -1 ? true : false;
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
                }, {
                    "type": "string_with_in",
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
                    "type": "money_with_limited_op",
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
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "numericOrPercentage",
                    "operator": ["=", "<", ">"],
                },
                {
                    "type": "money",
                    "operator": ["=", "!=", "<", "<=", ">", ">="]
                },
                {
                    "type": "money_with_limited_op",
                    "operator": ["=", "<", ">"]
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
                    "operator": ["LIKE", "=", "!=", "IN"]
                },
                {
                    "type": "autocomplete",
                    "operator": ["LIKE", "=", "!="]
                },
                {
                    "type": "list",
                    "operator": ["LIKE", "IN", "="]
                },
                {
                    "type": "bool",
                    "operator": ["=", "!="]
                },
                {
                    "type": "singleselect",
                    "operator": ["="]
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
                type: "string_with_in",
                width: 150
            },
            {
                field: "ECAP_PRICE",
                title: "ECAP (Price)",
                type: "money_with_limited_op",
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
            }
        ];

        vm.editRule = function (id) {
            vm.GetRules(id, "GET_BY_RULE_ID");
        }

        vm.copyRule = function (id) {
            ruleService.copyPriceRule(id).then(function (response) {
                if (response.data > 0) {
                    vm.editRule(response.data);                   
                    logger.success("Rule has been copied");

                } else {
                    logger.error("Unable to copy the rule");
                }
            }, function (response) {
                logger.error("Unable to copy the rule");
            });
        }

        vm.UpdateRuleActions = function (priceRuleCriteria, isSubmit) {
            ruleService.updatePriceRule(priceRuleCriteria, isSubmit).then(function (response) {
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
                            if (vm.rule.Criteria[idx].type === "list" && vm.rule.Criteria[idx].operator != "IN") {
                                vm.rule.Criteria[idx].value = vm.rule.Criteria[idx].values;
                            }
                        }
                        if (vm.Rules.filter(x => x.Id == id).length == 0) {
                            vm.Rules.splice(0, 0, vm.rule);
                            vm.dataSource.read();
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
                        vm.toggleType(vm.rule.IsAutomationIncluded);
                        if (vm.rule.IsActive == true && vm.rule.IsAutomationIncluded == true) {
                            vm.isApprovedButtonReq = true;
                        } else {
                            vm.isApprovedButtonReq = false;
                        }
                    } break;
                    default: {
                        vm.Rules = response.data;
                        vm.isEditmode = false;
                        vm.dataSource.read();
                        //adding filter
                        if (rid != 0) {
                            vm.dataSource.filter({ field: "Id", value: vm.rid == 0 ? null : vm.rid });
                        }

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
        //Remove Filter
        vm.removeFilter = function () {
            vm.dataSource.filter({});
            vm.rid = 0;
            var url = document.location.href;
            var lastLoc = url.lastIndexOf('/');
            url = url.substring(0, lastLoc + 1);
            document.location.href = url;
        }

        vm.UpdateRuleIndicator = function (ruleId, isTrue, strActionName, isEnabled) {
            if (isEnabled && ruleId != null && ruleId > 0) {
                ruleService.updateRuleIndicator(ruleId, isTrue, strActionName).then(function (response) {
                    if (response.data.Id > 0) {
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangedBy = response.data.ChangedBy;
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangeDateTime = response.data.ChangeDateTime;
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangeDateTimeFormat = response.data.ChangeDateTimeFormat;
                        switch (strActionName) {
                            case "STATUS_IND": {
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].IsActive = isTrue;
                                logger.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                            } break;
                            case "APPROVAL_IND": {
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].RuleStage = isTrue;
                                logger.success("Rule has been updated successfully with the stage '" + (isTrue ? "Approved" : "Pending") + "'");
                            } break;
                        }
                        vm.dataSource.read();
                    }
                    else
                        logger.error("Unable to update rule's indicator");
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
        }

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
                    template: "<div class='fl gridStatusMarker centerText #=RuleStage#' style='overflow: none !important' title='#if(RuleStage == true){#Approved#} else {#Pending Approval#}#'>{{ vm.stageOneChar(dataItem.RuleStage) }}</div ><div class='rule'><i title='#if(IsAutomationIncluded == true){#Auto Approval#} else {#Exclusion from Automation#}#' class='rulesGidIcon {{ vm.stageOneCharStatus(dataItem.IsAutomationIncluded) }} dealTools'></i><i role='button' title='Edit' class='rulesGidIcon intelicon-edit dealTools' ng-click='vm.editRule(#= Id #)'></i><i role='button' title='Copy' class='rulesGidIcon intelicon-copy-solid dealTools' ng-click='vm.copyRule(#=Id #)'></i><i role='button' title='Delete' class='rulesGidIcon intelicon-trash-solid dealTools' ng-click='vm.deleteRule(#= Id #)'></i><i ng-if='vm.isApprovedButtonReq && dataItem.IsActive == false' role='button' title='Approve' class='rulesGidIcon intelicon-user-approved-selected-solid dealTools' ng-click='vm.approveRule(#= Id #)'></i></div>"
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
                    title: "Rule Status",
                    filterable: { multi: true, search: true },
                    width: "7%",
                    template: "<div style='#if(IsActive == true){#color: green;#} else {#color: red;#}#'>#if(IsActive == true){#Active#} else {#Inactive#}#</div>"
                    //template: "<toggle class='fl toggle-accept' on='Active' off='Inactive' size='btn-sm' onstyle='btn-success' offstyle='btn-danger' title='#if(IsActive == true){#Active#} else {#Inactive#}#' ng-model='dataItem.IsActive'>dataItem.IsActive</toggle>"
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

        vm.toggleType = function (currentState) {
            // Ganthi - DO NOT REMOVE THIS - IT IS PART OF "US505889 - Price Rules: Exclusions for Automation" requirements, clear out fields and hide if exclusion rule.
            // This hides fields if the rule is an exclusion rule, also clears out unwanted values that shouldn't be part of exclusion rule.
            if (currentState !== true) {
                vm.BlanketDiscountDollor = "";
                vm.BlanketDiscountPercentage = "";

                var sheet = $scope.spreadsheet.activeSheet();
                sheet.range("A0:B199").clear();

                //$('#blanketDiscountSection').hide(); // Hidden due to IsAutomationIncluded
                $('#productCriteria').hide();
                var g = 0;
            } else {
                $('#productCriteria').show();
                //$('#blanketDiscountSection').show(); // Displayed due to IsAutomationIncluded
            }
        }

        vm.cancel = function () {
            $('#productCriteria').hide();
            vm.isEditmode = false;
            vm.rule = {};
            vm.reloadNotReq = false;
        }

        vm.generateProductCriteria = function () {
            var sheet = $scope.spreadsheet.activeSheet();
            vm.ProductCriteria = [];
            var tempRange = sheet.range("A1:B200").values().filter(x => !(x[0] == null && x[1] == null));
            for (var i = 0; i < tempRange.length; i++) {
                var newProduct = {};
                newProduct.ProductName = tempRange[i][0] != null ? jQuery.trim(tempRange[i][0]) : '';
                newProduct.Price = tempRange[i][1] != null ? tempRange[i][1] : 0;
                vm.ProductCriteria.push(newProduct);
            }
        }

        vm.simulate = function () {
            var data = new Array();
            var dataRuleIds = [];
            dataRuleIds.push(parseInt(vm.rule.Id, 10));
            var dataDealsIds = [];

            data.push(dataRuleIds, dataDealsIds);

            ruleService.getRuleSimulationResults(data).then(function (response) {
                if (response.data.length > 0) {
                    var maxSize = 100;
                    var matchedDealsList = response.data.slice(0, maxSize).map(function (data) { return " " + data["WIP_DEAL_SID"] });
                    var ruleType = vm.rule.IsAutomationIncluded === true ? "Approve Deals Rule" : "<b style='color:red;'>Exclude Deals Rule</b>";
                    var postMessage = "<br>" + response.data.length + " deals currently match this rule";
                    if (response.data.length > maxSize) postMessage += ", only the first " + maxSize + " are displayed";
                    kendo.alert("<span style='color: blue;'>Rule <b>" + vm.rule.Name + "</b> (" + ruleType + ") matches these deals: </span><br><br>" + matchedDealsList + "<span style='color: blue;'><br>" + postMessage + "<span>");
                } else {
                    kendo.alert("<b>There are no deals that currently match this rule</b>");
                }
            }, function (response) {
                logger.error("<b style='color:red;'>Error: Unable to Simulate this rule due to system errors</b>");
            });
        }

        vm.AddProduct = function (productName) {
            productName = jQuery.trim(productName).toLocaleLowerCase();
            if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === productName).length === 0) {
                var products = tempProductCriteria.filter(x => x.ProductName.toLowerCase() === productName);
                for (var i = 0; i < products.length; i++) {
                    vm.ProductCriteria.push(products[i]);
                }
            }
        }

        var invalidPrice = [];
        var duplicateProducts = [];
        var invalidProducts = [];
        var tempProductCriteria = [];
        vm.ValidateDuplicateInvalidProducts = function () {
            invalidPrice = [];
            var sheet = $scope.spreadsheet.activeSheet();
            $.each(vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price !== ""), function (index, value) {
                if ($.isNumeric(value.Price) === false || parseFloat(value.Price) <= 0)
                    invalidPrice.push(value.ProductName.toLocaleLowerCase());
            });

            duplicateProducts = [];
            $.each(vm.ProductCriteria.filter(x => x.ProductName !== ""), function (index, value) {
                if (vm.ProductCriteria.filter(x => x.ProductName.toLowerCase() === value.ProductName.toLowerCase()).length > 1)
                    duplicateProducts.push(value.ProductName.toLocaleLowerCase());
            });
            if (invalidProducts.length > 0 || duplicateProducts.length > 0 || invalidPrice.length > 0) {
                tempProductCriteria = vm.ProductCriteria.filter(x => x.ProductName !== "");
                vm.ProductCriteria = [];
                $.each($.unique(invalidProducts), function (index, value) {
                    vm.AddProduct(value);
                });
                $.each($.unique(invalidPrice), function (index, value) {
                    vm.AddProduct(value);
                });
                $.each($.unique(duplicateProducts), function (index, value) {
                    vm.AddProduct(value);
                });
                $.each(tempProductCriteria, function (index, value) {
                    vm.AddProduct(value.ProductName);
                });
                vm.dataSourceSpreadSheet.read();
                vm.DeleteSpreadsheetAutoHeader();
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
                        var isDuplicateOrInvalidProduct = jQuery.inArray(str.toLowerCase(), duplicateProducts) > -1 || jQuery.inArray(str.toLowerCase(), invalidPrice) > -1;
                        var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                        sheet.range("A" + i).color(isDuplicateOrInvalidProduct ? "orange" : (isValid ? "green" : "black"));
                    }
                }
            } else {
                sheet.range("A1:A200").color("green");
            }
            sheet.range("A1:B200").fontSize(12);
            sheet.range("A1:B200").fontFamily("Intel Clear");
        }

        vm.saveRule = function (isSubmit, isProductValidationRequired) {
            if (isProductValidationRequired && vm.rule.IsAutomationIncluded && (isSubmit || (vm.rule.IsActive && vm.rule.RuleStage)))
                vm.validateProduct(false, true, isSubmit);
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
                    if (vm.rule.IsAutomationIncluded && vm.ProductCriteria.filter(x => x.Price !== "" && x.Price > 0 && x.ProductName === "").length > 0)
                        requiredFields.push("A price in product criteria needs a product added");

                    var validationFields = [];
                    if (vm.rule.StartDate != null && vm.rule.EndDate != null) {
                        var dtEffFrom = new Date(vm.rule.StartDate);
                        var dtEffTo = new Date(vm.rule.EndDate);
                        if (dtEffFrom >= dtEffTo)
                            validationFields.push("Rule start date cannot be greater than Rule end date");
                    }
                    if (vm.rule.OwnerId != undefined && vm.rule.OwnerId != null) {
                        if (vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.rule.OwnerId).length === 0)
                            validationFields.push("Owner cannot be invalid");
                    }
                    if (requiredFields.length > 0 || validationFields.length > 0 || (vm.rule.IsAutomationIncluded && ((isSubmit || (vm.rule.IsActive && vm.rule.RuleStage))) && (invalidPrice.length > 0 || duplicateProducts.length > 0 || invalidProducts.length > 0))) {
                        var maxItemsSize = 10;
                        var strAlertMessage = "";
                        if (validationFields.length > 0) {
                            strAlertMessage = "<b>Following scenarios are failed!</b></br>" + validationFields.join("</br>");
                        }

                        if (requiredFields.length > 0) {
                            if (strAlertMessage !== "")
                                strAlertMessage += "</br></br>";
                            strAlertMessage += "<b>Please fill the following required fields!</b></br>" + requiredFields.join("</br>");
                        }

                        if (vm.rule.IsAutomationIncluded && ((isSubmit || (vm.rule.IsActive && vm.rule.RuleStage)))) {
                            // Replaced with a generalized function call and restricted popup size to not flow off bottom
                            strAlertMessage += myFunction(invalidProducts, maxItemsSize, "Invalid products exist, please fix:");

                            strAlertMessage += myFunction(invalidPrice, maxItemsSize, "Below products has invalid price! Please enter valid Price for highlighted products in orange");

                            strAlertMessage += myFunction(duplicateProducts, maxItemsSize, "Duplicate product entries found and highlighted in orange. Please remove duplicates before publishing.");
                        }
                        kendo.alert(jQuery.trim(strAlertMessage));
                    } else {
                        for (var idx = 0; idx < vm.rule.Criteria.length; idx++) {
                            if (vm.rule.Criteria[idx].type === "list" && vm.rule.Criteria[idx].operator != "IN") {
                                vm.rule.Criteria[idx].values = vm.rule.Criteria[idx].value;
                                vm.rule.Criteria[idx].value = "";
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
                            Criterias: { Rules: vm.rule.Criteria.filter(x => x.value !== null), BlanketDiscount: [{ value: vm.rule.IsAutomationIncluded ? vm.BlanketDiscountPercentage : "", valueType: { value: "%" } }, { value: vm.rule.IsAutomationIncluded ? vm.BlanketDiscountDollor : "", valueType: { value: "$" } }] },
                            ProductCriteria: vm.rule.IsAutomationIncluded && vm.ProductCriteria.length > 0 ? vm.ProductCriteria.filter(x => x.ProductName !== "" && x.Price > 0 && x.Price !== "") : []
                        }
                        vm.UpdateRuleActions(priceRuleCriteria, isSubmit);
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
                //var currCell = $('.k-spreadsheet-name-editor .k-input').val(); //This may need in future
                var str = arg.range.value() != null ? jQuery.trim(arg.range.value()) : "";
                if (str !== "") {
                    var isDuplicateOrInvalidProduct = jQuery.inArray(str.toLowerCase(), duplicateProducts) > -1 || jQuery.inArray(str.toLowerCase(), invalidPrice) > -1;
                    var isValid = jQuery.inArray(str.toLowerCase(), vm.ValidProducts) > -1;
                    arg.range.color(isDuplicateOrInvalidProduct ? "orange" : (isValid ? "green" : "black"));
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
                        var maxItemsSize = 10;
                        if (invalidProducts.length > 0 || invalidPrice.length > 0 || duplicateProducts.length > 0) {
                            var strAlertMessage = "";

                            // Replaced with a generalized function call and restricted popup size to not flow off bottom
                            strAlertMessage += myFunction(invalidProducts, maxItemsSize, "Invalid products exist, please fix:");

                            strAlertMessage += myFunction(invalidPrice, maxItemsSize, "Below products has invalid price! Please enter valid Price for highlighted products in orange");

                            strAlertMessage += myFunction(duplicateProducts, maxItemsSize, "Duplicate product entries found and highlighted in orange. Please remove duplicates before publishing.");

                            kendo.alert(jQuery.trim(strAlertMessage));
                        } else if (vm.ValidProducts.filter(x => x !== "").length === vm.LastValidatedProducts.filter(x => x !== "").length)
                            kendo.alert("<b>All Products are Valid</b></br>");
                    }
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
            else {
                invalidPrice = [];
                duplicateProducts = [];
                invalidProducts = [];
                if (isSave) {
                    vm.saveRule(isWithMail, false);
                }
                if (showPopup)
                    kendo.alert("<b>There are no Products to Validate</b></br>");
            }
        }

        function myFunction(itemsList, maxItemsSize, itemsMessage) {
            var retString = "";
            if (itemsList.length > 0) {
                var truncatedMatchedItems = itemsList.slice(0, maxItemsSize).map(function (data) { return " " + data });
                retString += "</br></br>";
                if (truncatedMatchedItems.length < itemsList.length) {
                    retString += "<b>" + itemsMessage + " (top " + maxItemsSize + " of " + itemsList.length + " items)</b></br>" + $.unique(truncatedMatchedItems).join("</br>");
                    retString += "<br>...<br>";
                } else {
                    retString += "<b>" + itemsMessage + "</b></br>" + $.unique(itemsList).join("</br>");
                }
            }
            return retString;
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
        vm.approveRule = function () {
            vm.rule.RuleStage = !vm.rule.RuleStage;
            vm.saveRule(true, true);
        }

        $scope.getConstant();
        $scope.init();
    }
})();