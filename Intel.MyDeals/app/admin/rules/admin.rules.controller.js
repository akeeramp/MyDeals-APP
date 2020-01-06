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
        vm.isElligibleForApproval = false;
        vm.adminEmailIDs = "";
        vm.spinnerMessageHeader = "Price Rule";
        vm.spinnerMessageDescription = "Please wait while we loading page";
        vm.isBusyShowFunFact = true;
        vm.toolKitHidden = window.usrRole == 'DA' ? false : true;
        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                vm.RuleConfig = response.data;
            }, function (response) {
                logger.error("Operation failed");
            });
            vm.GetRules(0, "GET_RULES");
        }
        vm.openRuleDetailsModal = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/admin/rules/ruleDetailsModal.html',
                controller: 'RuleModalController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdSelector-modal-window',
                resolve: {
                    RuleConfig: ['ruleService', function () {
                        return ruleService.getPriceRulesConfig().then(function (response) {
                            return response;
                        });
                    }],
                    dataItem: function () {
                        return angular.copy(dataItem);
                    }
                }
            });

            modalInstance.result.then(function (returnData) {
                vm.cancel();
            }, function () { });
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
                    vm.adminEmailIDs = data.data.CNST_VAL_TXT === "NA" ? "" : data.data.CNST_VAL_TXT;
                    vm.isElligibleForApproval = vm.adminEmailIDs.indexOf(usrEmail) > -1;
                }
            });
            if (window.usrRole != 'DA') {
                constantsService.getConstantsByName("PRC_RULE_READ_ACCESS").then(function (data) {
                    if (!!data.data) {
                        var prcAccess = data.data.CNST_VAL_TXT === "NA" ? "" : data.data.CNST_VAL_TXT;
                        vm.toolKitHidden = prcAccess.indexOf(window.usrRole) > -1;
                        if (vm.toolKitHidden) {
                            $scope.init();
                        } else {
                            document.location.href = "/Dashboard#/portal";
                        }
                        
                    }
                });
            }
            
        }
                
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
            }
        ];

        vm.editRule = function (dataItem) {
            //vm.GetRules(id, "GET_BY_RULE_ID"); 
            if (dataItem.id) {
                vm.openRuleDetailsModal(dataItem);
            } else {
                var tempDataItem = { "id": dataItem };
                vm.openRuleDetailsModal(tempDataItem);
            }            
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

        vm.UpdatePriceRule = function (priceRuleCriteria, strActionName) {
            ruleService.updatePriceRule(priceRuleCriteria, strActionName).then(function (response) {
                if (response.data.Id > 0) {
                    if (vm.Rules.filter(x => x.Id == response.data.Id).length > 0) {
                        vm.Rules = vm.Rules.filter(x => x.Id != response.data.Id);
                    }
                    var updatedRule = response.data;
                    updatedRule.OwnerName = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == updatedRule.OwnerId).length > 0 ? vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == updatedRule.OwnerId)[0].NAME : (updatedRule.OwnerId == vm.RuleConfig.CurrentUserWWID ? vm.RuleConfig.CurrentUserName : "NA");
                    updatedRule.RuleStatusLabel = updatedRule.IsActive ? "Active" : "Inactive";
                    updatedRule.RuleStageLabel = updatedRule.RuleStage ? "Approved" : "Pending Approval";
                    updatedRule.RuleAutomationLabel = updatedRule.IsAutomationIncluded ? "Auto Approval" : "Exclusion Rule";
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
            vm.spinnerMessageDescription = "Please wait while we loading the " + (actionName == "GET_BY_RULE_ID" ? "rule" : "rules") + "..";
            ruleService.getPriceRules(id, actionName).then(function (response) {
                vm.Rules = response.data;
                vm.isEditmode = false;
                vm.dataSource.read();
                //adding filter
                if (rid != 0) {
                    vm.dataSource.filter({ field: "Id", value: vm.rid });
                    vm.editRule(rid);
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
                vm.spinnerMessageDescription = "Please wait while we updating the rule..";
                var priceRuleCriteria = { Id: ruleId }
                switch (strActionName) {
                    case "UPDATE_ACTV_IND": {
                        priceRuleCriteria.IsActive = isTrue;
                    } break;
                    case "UPDATE_STAGE_IND": {
                        priceRuleCriteria.RuleStage = isTrue;
                    } break;
                }
                ruleService.updatePriceRule(priceRuleCriteria, strActionName).then(function (response) {
                    if (response.data.Id > 0) {
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangedBy = response.data.ChangedBy;
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangeDateTime = response.data.ChangeDateTime;
                        vm.Rules.filter(x => x.Id == response.data.Id)[0].ChangeDateTimeFormat = response.data.ChangeDateTimeFormat;
                        switch (strActionName) {
                            case "UPDATE_ACTV_IND": {
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].IsActive = isTrue;
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
                                logger.success("Rule has been updated successfully with the status '" + (isTrue ? "Active" : "Inactive") + "'");
                            } break;
                            case "UPDATE_STAGE_IND": {
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].RuleStage = isTrue;
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].RuleStageLabel = isTrue ? "Approved" : "Pending Approval";
                                logger.success("Rule has been updated successfully with the stage '" + (isTrue ? "Approved" : "Pending") + "'");
                            } break;
                        }
                        vm.dataSource.read();
                    }
                    else {
                        switch (strActionName) {
                            case "UPDATE_ACTV_IND": {
                                vm.rule.IsActive = !isTrue;
                            } break;
                            case "UPDATE_STAGE_IND": {
                                vm.rule.RuleStage = !isTrue;
                            } break;
                        }
                        logger.error("Unable to update rule's indicator");
                    }
                }, function (response) {
                    switch (strActionName) {
                        case "UPDATE_ACTV_IND": {
                            vm.rule.IsActive = !isTrue;
                        } break;
                        case "UPDATE_STAGE_IND": {
                            vm.rule.RuleStage = !isTrue;
                        } break;
                    }
                    logger.error("Operation failed");
                });
            }
        }
        $scope.detailInit = function (parentDataItem) {
            return {
                dataSource: {
                    transport: {
                        read: function (e) {
                            e.success(parentDataItem);
                            vm.productPresent = parentDataItem.ProductDescription.length;
                        },
                        create: function (e) {
                        }
                    },
                    pageSize: 1,
                    serverPaging: false,
                    serverFiltering: false,
                    serverSorting: false,                    
                    schema: {
                        model: {
                            id: "ID",
                            fields: {
                                ID: {
                                    editable: false, nullable: true
                                },
                                RuleDescription: { editable: false, type: "string" },
                                ProductDescription: { editable: false, type: "string" }
                            }
                        }
                    },
                },
                filterable: false,
                sortable: true,
                navigatable: true,
                resizable: true,
                reorderable: false,
                columnMenu: false,
                groupable: false,                             
                pageable: false,                
                columns: [
                    {
                        field: "RuleDescription",
                        title: "Rule Description",
                        template: "<div>#=RuleDescription#</div>",
                        width: "50%",
                        filterable: { multi: true, search: false }
                    },
                    {
                        field: "ProductDescription",
                        title: "Product Description",
                        template: "<div>#=ProductDescription#</div>",
                        width: "50%",
                        filterable: { multi: true, search: false },
                        hidden: vm.productPresent > 0 ? false : true                        
                    }                   
                    
                ]
            };
        };
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
            detailTemplate: "<div class='childGrid opUiContainer md k-grid k-widget' kendo-grid k-options='detailInit(dataItem)'></div>",
            pageable: {
                refresh: true,
                pageSizes: [25, 100, 500, "all"] //gridConstants.pageSizes
            },
            columns: [
                {
                    width: "160px",
                    template: "<div class='fl gridStatusMarker centerText #=RuleStage#' style='overflow: none !important' title='#if(RuleStage == true){#Approved#} else {#Pending Approval#}#'>{{ vm.stageOneChar(dataItem.RuleStage) }}</div>"
                    + "<div class='rule'>"
                    + "<i title='#if(IsAutomationIncluded == true){#Auto Approval#} else {#Exclusion from Automation#}#' class='rulesGidIcon {{ vm.stageOneCharStatus(dataItem.IsAutomationIncluded) }} dealTools'></i>"
                    + "<i role='button' title='Edit' class='rulesGidIcon intelicon-edit dealTools' ng-click='vm.editRule(#= Id #)'></i>"
                    + "<i role='button' title='Copy' class='rulesGidIcon intelicon-copy-solid dealTools' ng-click='vm.copyRule(#=Id #)'></i>"
                    + "<i role='button' title='Delete' class='rulesGidIcon intelicon-trash-solid dealTools' ng-click='vm.deleteRule(#= Id #)'></i>"
                    + "<i ng-if='(vm.isElligibleForApproval && #= IsActive # && #= IsAutomationIncluded # && #= RuleStage == false #)' role='button' title='Approve' class='rulesGidIcon intelicon-user-approved-selected-solid dealTools' ng-click='vm.UpdateRuleIndicator(#= Id #, true,\"UPDATE_STAGE_IND\",true)'></i>"
                        + "</div>",
                    hidden: vm.toolKitHidden
                },
                { field: "Id", title: "Id", width: "5%", hidden: true },
                {
                    title: "Name",
                    field: "Name",
                    template: "<div ng-if='vm.toolKitHidden'> #= Name #</div><div ng-if='!vm.toolKitHidden'><a  class='ruleName' title='Click to Edit' ng-click='vm.editRule(dataItem)'><span>\\#</span><span>#= Id #</span>:&nbsp;<span>#= Name #</span></a></div>",
                    width: "20%",
                    filterable: { multi: true, search: true },
                    encoded: true
                },
                {
                    field: "RuleStageLabel",
                    title: "Rule Stage",
                    filterable: { multi: true, search: true },
                    width: "1%",
                    hidden: true,
                    template: "<div style='#if(RuleStage == true){#color: green;#} else {#color: red;#}#'>#= RuleStageLabel #</div>"
                },
                {
                    field: "RuleStatusLabel",
                    title: "Rule Status",
                    filterable: { multi: true, search: true },
                    width: "7%",
                    template: "<div style='#if(IsActive == true){#color: green;#} else {#color: red;#}#'>#= RuleStatusLabel #</div>"
                    //template: "<toggle class='fl toggle-accept' on='Active' off='Inactive' size='btn-sm' onstyle='btn-success' offstyle='btn-danger' title='#if(IsActive == true){#Active#} else {#Inactive#}#' ng-model='dataItem.IsActive'>dataItem.IsActive</toggle>"
                },
                {
                    field: "RuleAutomationLabel", title: "Automation", filterable: { multi: true, search: true }, hidden: true,
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
                    width: "10%",
                    filterable: { multi: true, search: false }
                },
                {
                    field: "RuleDescription",
                    title: "Rule Description",
                    template: "<div class='btnHandle classToggle'>#=RuleDescription#</div>",
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
        
        vm.dataSourceSpreadSheet = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.ProductCriteria);
                }
            }
        });

        vm.addNewRule = function () {            
            //Call up Popup
            vm.editRule(0);
        }

        //Export to Excel
        vm.exportToExcel = function () {
            gridUtils.dsToExcelPriceRule(vm.gridOptions, vm.gridOptions.dataSource, "Price Rule Export.xlsx", false);
        }
        vm.approveRule = function () {
            vm.rule.RuleStage = !vm.rule.RuleStage;
            vm.UpdateRuleIndicator(vm.rule.Id, vm.rule.RuleStage, "UPDATE_STAGE_IND", true);
        }

        $scope.getConstant();
        if (window.usrRole == 'DA') {
            $scope.init();
        }
        
    }
})();