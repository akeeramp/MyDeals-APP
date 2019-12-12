angular
    .module('app.admin')
    .controller('rulesSimulationModalCtrl', rulesSimulationModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

rulesSimulationModalCtrl.$inject = ['ruleService', '$scope', '$uibModalInstance', 'dataItem', 'logger', '$timeout'];

function rulesSimulationModalCtrl(ruleService, $scope, $uibModalInstance, dataItem, logger, $timeout) {
    $scope.Rules = [];
    $scope.DealsList = "";
    $scope.RuleConfig = [];
    $scope.selectedIds = "123";

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
            $scope.dataSource.read();
        }, function (response) {
            logger.error("Simulation: Loading of Rules Data failed");
        });
    };




    $scope.selectOptions = {
        change: function () {
            $scope.$apply(function () {
                if ($scope.selectedIds.length > 0) { // Safety check for empty list
                    var lastSelected = $scope.selectedIds[$scope.selectedIds.length - 1];
                    if (lastSelected.CUST_NM === 'All Customers') // If they just selected All Custs, clear out their list and leave only this one.
                    {
                        $scope.selectedIds = [];
                        $scope.selectedIds.push(lastSelected);
                    }
                    else if ($scope.selectedIds[0].CUST_NM === 'All Customers') {
                        $scope.selectedIds = [];
                        $scope.selectedIds.push(lastSelected);
                    }
                }
            });
        },
        placeholder: "Select customers...",
        dataTextField: "CUST_NM",
        dataValueField: "CUST_NM_SID",
        valuePrimitive: false, // false makes us go to object, not ID only
        autoClose: false,
        dataSource: $scope.custdataSource
    };


    $timeout(function () {
         //Set active indicator filter to default = true
        $("#grdDisplaySimulationResults").data("kendoGrid").dataSource.filter({
            field: "ACTV_IND",
            operator: "eq",
            value: true
        });

        // If this page passes a WWID, Force filter upon that WWID.
        //if ($location.search().id !== undefined) {
        //    $("#grdDisplaySimulationResults").data("kendoGrid").dataSource.filter({
        //        field: "EMP_WWID",
        //        operator: "eq",
        //        value: $location.search().id
        //    });
        //}
    }, 50);


    $scope.LST_NM = "Ho";
    $scope.FRST_NM = "Bart";

    $scope.ok = function() {
        // Save the selected customers list here.
        var saveIds = [];
        var saveNames = [];
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

    $scope.init();

}
