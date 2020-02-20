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
        vm.rid = rid;
        vm.ruleId = 0;
        vm.Rules = [];
        vm.rule = {};
        vm.RuleConfig = [];
        vm.isElligibleForApproval = false;
        vm.adminEmailIDs = "";
        vm.spinnerMessageHeader = "Price Rule";
        vm.spinnerMessageDescription = "Please wait while we loading page";
        vm.isBusyShowFunFact = true;
        if (window.usrRole == 'DA' || window.usrRole == 'SA') {
            vm.toolKitHidden = false;
        } else {
            vm.toolKitHidden = true;
        }
        vm.productPresent = true;
        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                vm.RuleConfig = response.data;
            }, function (response) {
                logger.error("Operation failed");
            });
            vm.GetRules(0, "GET_RULES");
        }

        $scope.$on('UpdateSpinnerDescription', function (event, strDescription) {
            vm.spinnerMessageDescription = strDescription;
        });

        $scope.$on('UpdateRuleClient', function (event, updatedRule) {
            vm.RefreshGrid(updatedRule);
        });

        vm.RefreshGrid = function (updatedRule) {
            if (vm.Rules.filter(x => x.Id === updatedRule.Id).length > 0) {
                vm.Rules = vm.Rules.filter(x => x.Id !== updatedRule.Id);
            }
            vm.Rules.splice(0, 0, updatedRule);
            vm.dataSource.read();
            //vm.rid = updatedRule.Id;
            //vm.dataSource.filter({ field: "Id", value: updatedRule.Id });
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
            if (window.usrRole != 'DA' && window.usrRole != 'SA') {
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

        vm.editRule = function (dataItem, isCopy) {
            vm.spinnerMessageDescription = "Please wait while we loading the rule..";
            //vm.GetRules(id, "GET_BY_RULE_ID"); 
            if (dataItem.id) {
                dataItem.isCopy = isCopy;
                vm.openRuleDetailsModal(dataItem);
            } else {
                var tempDataItem = {
                    "id": dataItem, "isCopy": isCopy
                };
                vm.openRuleDetailsModal(tempDataItem);
            }
        }

        vm.copyRule = function (id) {
            ruleService.copyPriceRule(id).then(function (response) {
                if (response.data > 0) {
                    vm.editRule(response.data, true);
                    logger.success("Rule has been copied");

                } else {
                    logger.error("Unable to copy the rule");
                }
            }, function (response) {
                logger.error("Unable to copy the rule");
            });
        }

        vm.GetRules = function (id, actionName) {
            vm.spinnerMessageDescription = "Please wait while we loading the " + (actionName == "GET_BY_RULE_ID" ? "rule" : "rules") + "..";
            ruleService.getPriceRules(id, actionName).then(function (response) {
                vm.Rules = response.data;
                vm.dataSource.read();
                //adding filter
                if (rid != 0) {
                    vm.dataSource.filter({ field: "Id", value: vm.rid });
                    vm.editRule(rid, false);
                }
            }, function (response) {
                logger.error("Operation failed");
            });
        };

        vm.deleteRule = function (id) {
            kendo.confirm("Are you sure want to delete this rule?").then(function () {
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
                vm.spinnerMessageDescription = "Please wait while we are updating the rule..";
                var priceRuleCriteria = { Id: ruleId }
                switch (strActionName) {
                    case "UPDATE_ACTV_IND": {
                        priceRuleCriteria.IsActive = isTrue;
                    } break;
                    case "UPDATE_STAGE_IND": {
                        priceRuleCriteria.RuleStage = isTrue;
                        priceRuleCriteria.IsActive = isTrue; // also make it active now
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
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].IsActive = isTrue;
                                vm.Rules.filter(x => x.Id == response.data.Id)[0].RuleStatusLabel = isTrue ? "Active" : "Inactive";
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
                                vm.rule.IsActive = !isTrue;
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
                            vm.rule.IsActive = !isTrue;
                        } break;
                    }
                    logger.error("Operation failed");
                });
            }
        }
        

        $scope.detailInit = function (parentDataItem) {
            var columns = [];
            //If Rule Descripsion Present
            if (parentDataItem.RuleDescription.length > 0) {
                columns.push({
                    field: "RuleDescription",
                    title: "Rule Description",
                    template: "<div>#=RuleDescription#</div>",
                    width: "50%",
                    filterable: { multi: true, search: false }
                });
            }
            //If Peoduct Present
            if (parentDataItem.ProductDescription.length > 0) {
                columns.push({
                    field: "ProductDescription",
                    title: "Product Description",
                    template: "<div>#=ProductDescription#</div>",
                    width: "50%",
                    filterable: false
                });
            }
            
            return {
                dataSource: {
                    transport: {
                        read: function (e) {                            
                            e.success(parentDataItem);                                                        
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
                                    nullable: true
                                },
                                RuleDescription: { type: "string" },
                                ProductDescription: { type: "string" }
                            }
                        }
                    },
                },
                filterable: false,
                sortable: true,                
                resizable: true,
                reorderable: false,                
                columns: columns
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
            reorderable: true,
            scrollable: true,
            //columnMenu: true, // Remove the three dots and more importantly, the selection of column items
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
                    + "<i role='button' title='Edit' class='rulesGidIcon intelicon-edit dealTools' ng-click='vm.editRule(#= Id #,false)'></i>"
                    + "<i role='button' title='Copy' class='rulesGidIcon intelicon-copy-solid dealTools' ng-click='vm.copyRule(#=Id #)'></i>"
                    + "<i role='button' title='Delete' class='rulesGidIcon intelicon-trash-solid dealTools' ng-click='vm.deleteRule(#= Id #)'></i>"
                    + "<i ng-if='(vm.isElligibleForApproval && #= !IsActive # && #= IsAutomationIncluded # && #= RuleStage == false #)' role='button' title='Approve' class='rulesGidIcon intelicon-user-approved-selected-solid dealTools' ng-click='vm.UpdateRuleIndicator(#= Id #, true,\"UPDATE_STAGE_IND\",true)'></i>"
                    + "</div>",
                    hidden: vm.toolKitHidden,
                    attributes: {
                        style: "padding-top: 5px"
                    }
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

        vm.addNewRule = function () {
            //Call up Popup
            vm.editRule(0, false);
        }

        //Export to Excel
        vm.exportToExcel = function () {
            gridUtils.dsToExcelPriceRule(vm.gridOptions, vm.gridOptions.dataSource, "Price Rule Export.xlsx", false);
        }

        $scope.getConstant();
        if (window.usrRole == 'DA' || window.usrRole == 'SA') {
            $scope.init();
        }
    }
})();