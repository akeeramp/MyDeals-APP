    angular
        .module('app.admin')
        .controller('rulesSimulationModalCtrl', rulesSimulationModalCtrl)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    rulesSimulationModalCtrl.$inject = ['ruleService', '$scope', '$uibModalInstance', 'dataItem', 'logger', '$timeout', 'gridConstants'];

    function rulesSimulationModalCtrl(ruleService, $scope, $uibModalInstance, dataItem, logger, $timeout, gridConstants) {
        $scope.dealsList = "";
        $scope.selectedIds = [];

        $scope.Rules = [];
        $scope.RuleConfig = [];
        $scope.dataCollection = [];

        $scope.gridOptions = {
            dataSource: new window.kendo.data.DataSource({
                type: "json",
                data: $scope.dataCollection
            }),
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            height: 450,
            columns: [
                {
                    field: "WIP_DEAL_SID",
                    title: "Deal #",
                    width: "80px",
                    filterable: false
                },
                {
                    field: "APRV_RULES",
                    title: "Matching Approval Rules"
                },
                {
                    field: "EXCLD_RULES",
                    title: "Matching Exclusion Rules"
                }]
                //{
                //    field: "OWNER_EMP_WWID",
                //    title: "WWID",
                //    width: "100px"
                //},
                //{
                //    field: "APRV_PRCSS_FLG",
                //    title: "Approved?"
                //}]
        }

        $scope.init = function () {
            ruleService.getPriceRulesConfig().then(function (response) {
                $scope.RuleConfig = response.data;
            }, function (response) {
                logger.error("Operation failed");
            });

            $scope.GetRules(0, "GET_RULES");
        }

        $scope.GetRules = function (id, actionName) {
            ruleService.getPriceRules(0, "GET_RULES").then(function (response) {
                $scope.Rules = response.data;
                $scope.selectOptions.dataSource.read();

            }, function (response) {
                logger.error("Simulation: Loading of Rules Data failed");
            });
        };

        $scope.selectOptions = {
            placeholder: "Select rules to test...",
            dataTextField: "Name",
            dataValueField: "Id",
            autoClose: false,
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success($scope.Rules);
                    } 
                }
            }
        };

        $scope.runSimulation = function () {
            // Makes scope available
            var s = $scope;
            var comboClear = window.$("#someGrid").data("kendoGrid");
            comboClear.dataSource.data([]);

            // Run the simulation now
            var data = new Array();

            var dataRuleIds = $scope.selectedIds;
            //dataRuleIds.push(82);  // Test for multiple, can remove

            var dataDealsIds = [];
            var deals = $scope.dealsList !== undefined? $scope.dealsList.split(","): [];
            for (var j = 0; j < deals.length; j++) {
                var dealId = parseInt(deals[j], 10) || 0; // turn NaN to 0
                if (dealId > 0) {
                    dataDealsIds.push(parseInt(deals[j], 10));
                }
            }

            data.push(dataRuleIds, dataDealsIds);
            ruleService.getRuleSimulationResults(data).then(function (response) {
                if (response.data.length > 0) {
                    var combo = window.$("#someGrid").data("kendoGrid");
                    combo.dataSource.data(response.data);
                } else {
                    window.kendo.alert("<b>This simulation returned no matching rule/deal matches</b>");
                }
            }, function (response) {
                logger.error("<b style='color:red;'>Error: Unable to Simulate the rule due to system error</b>");
            });
        };

        $scope.resetForm = function () {
            var comboClear = window.$("#someGrid").data("kendoGrid");
            comboClear.dataSource.data([]);

            $scope.dealsList = "";
            $scope.selectedIds = [];
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.init();

    }
