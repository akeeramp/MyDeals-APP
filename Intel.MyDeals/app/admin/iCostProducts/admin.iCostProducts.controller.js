(function () {
    'use strict';
    angular
		.module('app.admin')
		.controller('iCostProductsController', iCostProductsController)

    iCostProductsController.$inject = ['iCostProductService', 'logger', '$scope', 'gridConstants', '$state', '$linq', 'pctRulesDrpDownValues']

    function iCostProductsController(iCostProductService, logger, $scope, gridConstants, $state, $linq, pctRulesDrpDownValues) {
        var vm = this;
        vm.isButtonDisabled = true;
        vm.updateItem = updateItem;
        vm.addItem = addItem;

        vm.manageRules = false;
        vm.ProductType = [];
        vm.costTestProductType = pctRulesDrpDownValues.costTestProductType;
        vm.conditionCriteria = pctRulesDrpDownValues.conditionCriteria;

        vm.selectedProductType = null;
        vm.selectedProductVertical = null;
        vm.selectedCostTestType = vm.costTestProductType[0];
        vm.selectedConditionCriteria = vm.conditionCriteria[0];

        vm.showQueryBuilder = false;
        vm.disableVertical = true;
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

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            reorderable: true,
            columnMenu: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: onChange,
            columns: [
              { field: "DEAL_PRD_TYPE", title: "Product Type", width: "15%" },
              { field: "PRD_CAT_NM", title: "Vertical", width: "10%" },
              { field: "COST_TEST_TYPE", title: "Cost Test Type", width: "10%" },
              { field: "CRITERIA", title: "Criteria", width: "10%" },
              { field: "CONDITION", title: "Condition" },
            ]
        };

        vm.filter = { "group": { "operator": "AND", "rules": [] } };

        function onChange() {
            vm.selectedItem = $scope.rulesGrid.select();
            vm.isButtonDisabled = (vm.selectedItem.length == 0) ? true : false;
            $scope.$apply();
        }

        function updateItem() {
           // TODO: Add update changes
        }

        function addItem() {
            getProductTypeMapping();
        }

        function getProductTypeMapping() {
            iCostProductService.getProductTypeMappings().then(function (response) {
                vm.ProductType = response.data;
                vm.manageRules = true;
                $state.go('admin.costtest.icostproducts.manage')
            });
        }

        $scope.$watch('vm.selectedProductType',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;
                vm.selectedProductVertical = '';
                vm.disableVertical = false;
                initQueryBuilder(false);
            }, true
        );

        $scope.$watch('vm.selectedProductVertical',
           function (newValue, oldValue, el) {
               if (oldValue === newValue) return;
               if (newValue.VERTICAL_SID > 0) {
                   getProductAttributeValues(newValue.VERTICAL_SID);
               }
           }, true
       );

        function getProductAttributeValues(verticalId) {
            iCostProductService.getProductAttributeValues(verticalId).then(function (response) {
                vm.leftValues = response.data;
                initQueryBuilder(true);
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

        function savePCTRules() {
            var pctRule = {};
            pctRule.ProductTypeSid = vm.selectedProductType.PRD_TYPE_SID;
            pctRule.VeticalSid = vm.selectedProductType.VERTICAL_SID;
            pctRule.CostTestType = vm.selectedCostTestType.name;
            pctRule.Criteria = vm.selectedConditionCriteria.name;
            pctRule.Condition = vm.output == '()' ? "" : vm.output;
            pctRule.jsonTxt = vm.filter;

            iCostProductService.savePCTRules(pctRule).then(function (response) {
                // TODO: Add save related changes
                cancel();
            });
        }

        function cancel() {
            vm.manageRules = false;
            $state.go('admin.costtest.icostproducts')
        }

        $scope.$watch('vm.filter', function (newValue) {
            vm.output = computed(newValue.group);
        }, true);
    }
})();