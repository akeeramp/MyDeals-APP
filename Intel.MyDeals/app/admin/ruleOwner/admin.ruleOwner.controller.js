(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('RuleOwnerController', RuleOwnerController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    RuleOwnerController.$inject = ['$scope', 'ruleService', 'logger', '$timeout', 'gridConstants']

    function RuleOwnerController($scope, ruleService, logger, $timeout, gridConstants) {
        var vm = this;
        vm.Rules = [];
        vm.RuleConfig = [];
        vm.SelectedOwnerId = null;
        vm.EditedRuleId = 0;
        vm.spinnerMessageHeader = "Price Rule Owner";
        vm.spinnerMessageDescription = "Please wait while we loading owners..";
        vm.isBusyShowFunFact = true;

        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                vm.RuleConfig = response.data;
                vm.ruleOwnersDdlDataSource.read();
            }, function (response) {
                logger.error("Operation failed");
            });
            vm.GetRules(0, "GET_OWNERS");
        }

        vm.GetRules = function (id, actionName) {
            ruleService.getPriceRules(id, actionName).then(function (response) {
                vm.Rules = response.data;
                vm.ruleOwnerDataSource.read();
            }, function (response) {
                logger.error("Operation failed");
            });
        };

        vm.ruleOwnersDdlDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.RuleConfig.DA_Users);
                }
            }
        });

        vm.ruleOwnerDropDownEditor = function (container, options) {
            vm.EditedRuleId = parseInt(options.model.Id);
            var ownerId = parseInt(options.model.OwnerId);
            vm.SelectedOwnerId = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == ownerId).length > 0 ? ownerId : null;
            var editor = $('<select kendo-combo-box k-options="vm.ownerOptions" k-ng-model="vm.SelectedOwnerId" style= "width:100%" ></select >').appendTo(container);
        }

        vm.ownerOptions = {
            placeholder: "Select owner...",
            dataTextField: "NAME",
            dataValueField: "EMP_WWID",
            template: '<div class="tmpltItem">' +
            '<div class="fl tmpltContract"><div class="tmpltPrimary" style="text-align: left;font-weight:bold;">#: data.LST_NM #, #: data.FRST_NM #</div><div class="tmpltSecondary">#: data.EMAIL_ADDR #</div></div>' +
            '<div class="clearboth"></div>' +
            '</div>',
            footerTemplate: 'Total #: instance.dataSource.total() # DA users found',
            valuePrimitive: true,
            filter: "contains",
            maxSelectedItems: 1,
            autoBind: true,
            dataSource: vm.ruleOwnersDdlDataSource
        };

        vm.ruleOwnerDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Rules);
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: false },
                        OwnerId: { OwnerId: false, nullable: false },
                        Name: { editable: false },
                        OwnerName: { editable: true }
                    }
                }
            },
        });

        vm.UpdateRuleOwner = function () {
            if (vm.SelectedOwnerId != null && vm.Rules.filter(x => x.Id == vm.EditedRuleId)[0].OwnerId != vm.SelectedOwnerId) {
                var priceRuleCriteria = {
                    Id: vm.EditedRuleId,
                    OwnerId: vm.SelectedOwnerId
                }
                vm.spinnerMessageDescription = "Please wait while we updating the owner..";
                ruleService.updatePriceRule(priceRuleCriteria, "UPDATE_OWNER").then(function (response) {
                    if (response.data.Id > 0) {
                        vm.Rules.filter(x => x.Id == vm.EditedRuleId)[0].OwnerId = vm.SelectedOwnerId;
                        var ownerDetail = vm.RuleConfig.DA_Users.filter(x => x.EMP_WWID == vm.SelectedOwnerId)[0];
                        vm.Rules.filter(x => x.Id == vm.EditedRuleId)[0].OwnerName = ownerDetail.LST_NM + ", " + ownerDetail.FRST_NM;
                        vm.ruleOwnerDataSource.read();
                        logger.success("Rule owner has been updated");
                    } else {
                        logger.error("Unable to update the rule owner");
                    }
                }, function (response) {
                    logger.error("Unable to update the rule owner");
                });
            }
        };

        vm.ruleOwnerGridOptions = {
            dataSource: vm.ruleOwnerDataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(true),
            editable: { mode: "inline", confirmation: false },
            save: function (e) {
                vm.UpdateRuleOwner();
            },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            columns: [
                {
                    command: [
                        {
                            name: "edit",
                            template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
                        }
                    ],
                    title: " ",
                    width: "5%"
                },
                { field: "Id", title: "Id", width: "1%", hidden: true },
                { field: "OwnerId", title: "OwnerId", width: "1%", hidden: true },
                { field: "Name", title: "Name", width: "47%", template: "<span>\\#</span><span>#= Id #</span>:&nbsp;<span>#= Name #</span>" },
                { field: "OwnerName", title: "Owner Name", width: "47%", filterable: { multi: true, search: true }, editor: vm.ruleOwnerDropDownEditor }
            ]
        };

        $scope.init();
    }
})();