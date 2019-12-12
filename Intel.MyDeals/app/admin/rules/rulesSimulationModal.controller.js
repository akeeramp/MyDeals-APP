    angular
        .module('app.admin')
        .controller('rulesSimulationModalCtrl', rulesSimulationModalCtrl)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    rulesSimulationModalCtrl.$inject = ['ruleService', '$scope', '$uibModalInstance', 'dataItem', 'logger', '$timeout', 'gridConstants'];

    function rulesSimulationModalCtrl(ruleService, $scope, $uibModalInstance, dataItem, logger, $timeout, gridConstants) {
        $scope.Rules = [];
        $scope.dealsList = "";
        $scope.RuleConfig = [];
        $scope.selectedIds = "123";
        $scope.selectedIds = [];
        $scope.dataCollection = [];

        $scope.gridOptions = {
            dataSource: new kendo.data.DataSource({
                type: "json",
                data: $scope.dataCollection
            }),
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            height: 450,
            columns: [
                {
                    field: "WIP_DEAL_SID",
                    title: "1"
                },
                {
                    field: "APRV_RULES",
                    title: "2"
                },
                {
                    field: "EXCLD_RULES",
                    title: "3"
                },
                {
                    field: "OWNER_EMP_WWID",
                    title: "4"
                },
                {
                    field: "APRV_PRCSS_FLG",
                    title: "Hosted Geo"
                }]
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



        $scope.ok = function() {
            // Save the selected customers list here.
            var s = $scope;
            var saveIds = [];
            var saveNames = [];

            // Run the simulation now
            var data = new Array();
            var dataRuleIds = [];
            //dataRuleIds.push(parseInt(vm.rule.Id, 10));
            dataRuleIds.push(82);  // Test for multiple, can remove
            var dataDealsIds = [];

            data.push(dataRuleIds, dataDealsIds);
            ruleService.getRuleSimulationResults(data).then(function (response) {
                if (response.data.length > 0) {
                    var j = 1;
                    var combo = $("#someGrid").data("kendoGrid");
                    combo.dataSource.data(response.data);
                    var blah = 0;
                    // Display data here
                } else {
                    kendo.alert("<b>This rule matches no deals presently</b>");
                }
            }, function (response) {
                logger.error("<b style='color:red;'>Error: Unable to Simulate the rule due to system error</b>");
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

        $scope.init();

    }
