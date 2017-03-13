(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('iCostProductsController', iCostProductsController);

    iCostProductsController.$inject = ['iCostProductService', 'logger', '$scope', 'gridConstants', '$state', '$linq', 'pctRulesDrpDownValues', 'confirmationModal', '$filter'];

    function iCostProductsController(iCostProductService, logger, $scope, gridConstants, $state, $linq, pctRulesDrpDownValues, confirmationModal, $filter) {
        var vm = this;

        vm.updateItem = updateItem;
        vm.addItem = addItem;
        vm.deleteItem = deleteItem;

        vm.form = { 'isValid': false };
        vm.validationMessage = "";
        vm.isButtonDisabled = true;
        var isEditMode = false;

        vm.manageRules = false;
        vm.ProductType = [];
        vm.costTestProductType = pctRulesDrpDownValues.costTestProductType;
        vm.conditionCriteria = pctRulesDrpDownValues.conditionCriteria;

        vm.pctRule = {
            'CONDITION': '',
            'COST_TEST_TYPE': '',
            'CRITERIA': '',
            'DEAL_PRD_TYPE_SID': '',
            'PRD_CAT_NM_SID': '',
            'JSON_TXT': ''
        }

        vm.showCommentbar = false;
        vm.dealPrdTypeNm = function () {
            vm.showCommentbar = (vm.pctRule.DEAL_PRD_TYPE_SID !== "" && vm.pctRule.PRD_CAT_NM_SID !== "");
            var found = $filter('filter')(vm.ProductType, { PRD_TYPE_SID: vm.pctRule.DEAL_PRD_TYPE_SID }, true);
            if (found.length) {
                return found[0].PRD_TYPE;
            }
            return "unknown";
        }

        vm.dealPrdVerticalNm = function () {
            vm.showCommentbar = (vm.pctRule.DEAL_PRD_TYPE_SID !== "" && vm.pctRule.PRD_CAT_NM_SID !== "");
            var found = $filter('filter')(vm.ProductType, { VERTICAL_SID: vm.pctRule.PRD_CAT_NM_SID }, true);
            if (found.length) {
                return found[0].VERTICAL;
            }
            return "unknown";
        }

        vm.pctRule.COST_TEST_TYPE = vm.costTestProductType[0].name;
        vm.pctRule.CRITERIA = vm.conditionCriteria[0].name;

        vm.showQueryBuilder = false;
        vm.leftValues = [];
        vm.savePCTRules = savePCTRules;

        vm.cancel = cancel;

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    iCostProductService.getProductCostTestRules()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get product cost test rules.", response, response.statusText);
                        });
                }
            },
            pageSize: 25
        });
        vm.dataSource.group([{ field: "DEAL_PRD_TYPE" }, { field: "PRD_CAT_NM" }]);
        vm.dataSource.sort({ field: "COST_TEST_TYPE", dir: "asc" });
        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            sortable: false,
            selectable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: onChange,
            columns: [
              { field: "DEAL_PRD_TYPE", title: "Product Type", width: "15%", filterable: { multi: true, search: true } },
              { field: "PRD_CAT_NM", title: "Vertical", width: "10%", filterable: { multi: true, search: true } },
              { field: "COST_TEST_TYPE", title: "Cost Test Type", width: "10%", filterable: { multi: true, search: true } },
              { field: "CRITERIA", title: "Criteria", width: "10%", filterable: { multi: true, search: true } },
              { field: "CONDITION", title: "Condition" },
            ]
        };

        vm.filter = { "group": { "operator": "AND", "rules": [] } };

        function onChange() {
            vm.selectedItem = $scope.rulesGrid.select();
            vm.isButtonDisabled = (vm.selectedItem.length == 0) ? true : false;
            $scope.$apply();
        }

        var isEditLoading = false;
        function updateItem() {
            isEditLoading = isEditMode = true;
            vm.selectedItem = $scope.rulesGrid.select();
            vm.pctRule = $scope.rulesGrid.dataItem(vm.selectedItem);
            vm.filter = vm.pctRule.JSON_TXT == "" ? vm.filter : JSON.parse(vm.pctRule.JSON_TXT);
            getProductTypeMapping();
        }

        function addItem() {
            isEditMode = false;
            getProductTypeMapping();
        }

        function deleteItem() {
            isEditLoading = isEditMode = true;
            vm.selectedItem = $scope.rulesGrid.select();
            var pctRule = $scope.rulesGrid.dataItem(vm.selectedItem);

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Rule',
                hasActionButton: true,
                headerText: 'Delete confirmation',
                bodyText: 'Are you sure you would like to Delete this Product Cost Test Rule ?'
            };

            confirmationModal.showModal({}, modalOptions).then(function (result) {
                iCostProductService.deletePCTRule(pctRule).then(function (response) {
                    $scope.rulesGrid.removeRow(vm.selectedItem);
                    vm.isButtonDisabled = true;
                    logger.success("Delete Successful.");
                }, function (response) {
                    logger.error("Unable to delete product cost test rule.", response, response.statusText);
                });
            }, function (response) {
                //
            });
        }

        function getProductTypeMapping() {
            iCostProductService.getProductTypeMappings().then(function (response) {
                vm.ProductType = response.data;
                vm.manageRules = true;
                $state.go('admin.costtest.icostproducts.manage')
            });
        }

        $scope.$watch('vm.pctRule.DEAL_PRD_TYPE_SID',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;
                if (!isEditLoading) {
                    if (newValue > 0) {
                        var verticals = $filter('where')(vm.ProductType, { 'PRD_TYPE_SID': newValue });
                        vm.pctRule.PRD_CAT_NM_SID = verticals.length == 1 ? verticals[0].VERTICAL_SID : '';
                    } else {
                        vm.pctRule.PRD_CAT_NM_SID = '';
                    }
                    vm.form.isValid = false;
                    initQueryBuilder(false);
                }
            }, true
        );

        $scope.$watch('vm.pctRule.PRD_CAT_NM_SID',
           function (newValue, oldValue, el) {
               if (oldValue === newValue) return;
               if (newValue > 0) {
                   getProductAttributeValues(newValue);
               }
           }, true
       );

        function getProductAttributeValues(verticalId) {
            iCostProductService.getProductAttributeValues(verticalId).then(function (response) {
                vm.leftValues = response.data;
                if (!isEditLoading) {
                    initQueryBuilder(true);
                } else {
                    vm.showQueryBuilder = true;
                }
                // edit loading is finished reset the flag
                isEditLoading = false;
            });
        }

        function initQueryBuilder(showQryBuilder) {
            vm.filter = { "group": { "operator": "AND", "rules": [] } };
            vm.showQueryBuilder = showQryBuilder;
        }

        function computed(group) {
            var test = JSON.stringify(group);

            if (!group) return "";
            for (var str = "(", i = 0; i < group.rules.length; i++) {
                i > 0 && (str += " " + group.operator + " ");
                str += group.rules[i].group ?
                    computed(group.rules[i].group) :
                    group.rules[i].criteria + " " + group.rules[i].condition + " " + getFormatedValue(group.rules[i].condition, group.rules[i].data);
            }

            return str + ")";
        }

        function getFormatedValue(condition, value) {
            if (value == "") return "";
            var formatedValue = "";
            if (condition == 'LIKE') {
                formatedValue = "\'%" + value + "%\'";
            } else {
                formatedValue = "\'" + value + "\'";
            }
            return formatedValue;
        }

        function isRuleExistForVertical() {
            var isInvalid = false;
            var rules = $scope.rulesGrid._data;
            var existingRule = $linq.Enumerable().From(rules)
            .Where(function (x) {
                return (x.DEAL_PRD_TYPE_SID == vm.pctRule.DEAL_PRD_TYPE_SID
                    && x.PRD_CAT_NM_SID == vm.pctRule.PRD_CAT_NM_SID
                    && x.COST_TEST_TYPE == vm.pctRule.COST_TEST_TYPE)
            }).ToArray();

            var rows = isEditMode ? 1 : 0;
            if (existingRule.length > rows) {
                vm.validationMessage = "Product Cost Test Rule exists for selected Product Type, Vertical and Level";
                isInvalid = true;
            }
            return isInvalid;
        }

        function savePCTRules() {
            if (isRuleExistForVertical()) return;

            vm.pctRule.JSON_TXT = JSON.stringify(vm.filter);

            if (!isEditMode) {
                iCostProductService.createPCTRules(vm.pctRule).then(function (response) {
                    logger.success("Save Successful.");
                    cancel();
                }, function (response) {
                    logger.error("Unable to create product cost test rule.", response, response.statusText);
                });
            } else {
                iCostProductService.updatePCTRule(vm.pctRule).then(function (response) {
                    logger.success("Update Successful.");
                    cancel();
                }, function (response) {
                    logger.error("Unable to update product cost test rule.", response, response.statusText);
                });
            }
        }

        function cancel() {
            vm.manageRules = false;
            vm.pctRule = {
                'CONDITION': '',
                'COST_TEST_TYPE': '',
                'CRITERIA': '',
                'DEAL_PRD_TYPE_SID': '',
                'PRD_CAT_NM_SID': '',
                'JSON_TXT': ''
            }
            initQueryBuilder(false);
            $state.go('admin.costtest.icostproducts');
            $(".k-i-reload").trigger('click');
            vm.pctRule.COST_TEST_TYPE = vm.costTestProductType[0].name;
            vm.pctRule.CRITERIA = vm.conditionCriteria[0].name;
            isEditLoading = isEditMode = false;
            vm.isButtonDisabled = true;
            vm.validationMessage = "";
        }

        $scope.$watch('vm.filter', function (newValue) {
            var output = computed(newValue.group);
            vm.pctRule.CONDITION = output == '()' ? "" : output;
        }, true);
    }
})();