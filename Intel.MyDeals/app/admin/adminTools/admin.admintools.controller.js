(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminToolsController', AdminToolsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    // logger :Injected logger service to for logging to remote database or throwing error on the ui
    // dataService :Application level service, to be used for common api calls, eg: user token, department etc
    AdminToolsController.$inject = ['adminTools', '$scope', 'logger'];

    function AdminToolsController(adminTools, $scope, logger) {
        var vm = this;
        $scope.adminToolsData = {};

        $scope.adminToolsData.MinYear = parseInt(moment().format("YYYY")) - 6;
        $scope.adminToolsData.MaxYear = parseInt(moment().format("YYYY")) + 20;

        $scope.adminToolsData.startYear = parseInt(moment().format("YYYY")) - 1;
        $scope.adminToolsData.endYear = parseInt(moment().format("YYYY")) + 3;

        $scope.adminToolsData.startQtr = moment().quarter();
        $scope.adminToolsData.endQtr = moment().quarter();

        if (!$scope.adminToolsData._behaviors) {
            $scope.adminToolsData['_behaviors'] = {};
        }
        if (!$scope.adminToolsData._behaviors.isError) {
            $scope.adminToolsData._behaviors['isError'] = {};
        }
        if (!$scope.adminToolsData._behaviors.validMsg) {
            $scope.adminToolsData._behaviors['validMsg'] = {};
        }

        function resetErrorMessage() {
            $scope.adminToolsData._behaviors.isError["endYear"] = false;
            $scope.adminToolsData._behaviors.validMsg["endYear"] = "";
            $scope.adminToolsData._behaviors.isError["startYear"] = false;
            $scope.adminToolsData._behaviors.validMsg["startYear"] = "";
            $scope.adminToolsData._behaviors.isError["productIds"] = false;
            $scope.adminToolsData._behaviors.validMsg["productIds"] = "";
        }

        var startYearQuarter = 0;
        var endYearQuarter = 0;

        function validate() {
            resetErrorMessage();
            startYearQuarter = $scope.adminToolsData.startYear + "0" + $scope.adminToolsData.startQtr;
            endYearQuarter = $scope.adminToolsData.endYear + "0" + $scope.adminToolsData.endQtr;
            if (startYearQuarter > endYearQuarter) {
                $scope.adminToolsData._behaviors.isError["startYear"] = true;
                $scope.adminToolsData._behaviors.validMsg["startYear"] = "Start year Quarter cannot be greater than end year quarter";
                return false;
            }
            return true;
        }

        $scope.executeCostFiller = function () {
            var isValid = validate();
            var reg = new RegExp(/^[0-9,]+$/);
            //vm.isFillNullSelected = false;
            $scope.adminToolsData.productIds = $scope.adminToolsData.productIds.replace(/,+/g, ',').trim(' ');
            var isValidProdIds = reg.test($scope.adminToolsData.productIds);
            if (!isValidProdIds) {
                $scope.adminToolsData._behaviors.isError["productIds"] = true;
                $scope.adminToolsData._behaviors.validMsg["productIds"] = "Please enter comma (,) separated L4 product ids only";
            }
            if (isValid && isValidProdIds) {
                adminTools.ExecuteCostGapFiller(startYearQuarter, endYearQuarter, $scope.adminToolsData.productIds, vm.isFillNullSelected).then(function (response) {
                    logger.success("Cost Gap Filler executed succesfully");
                });
            }
        }

        $scope.executePostTest = function () {
            var jsonDataPacket = "{\"header\": {\"source_system\": \"pricing_tenders\",\"target_system\": \"mydeals\",\"action\": \"create\",\"xid\": \"152547827hdhdh\"},\"recordDetails\": {\"SBQQ__Quote__c\": {\"Id\": \"50130000000X14c\",\"Name\": \"Q-02446\",\"Pricing_Folio_ID_Nm__c\": \"\",\"SBQQ__Account__c\": {\"Id\": \"50130000000X14c\",\"Name\": \"Dell\",\"Core_CIM_ID__c\": \"\"},\"Pricing_Deal_Type_Nm__c\": \"ECAP\",\"Pricing_Customer_Nm__c\": \"Facebook\",\"Pricing_Project_Name_Nm__c\": \"FMH\",\"Pricing_ShipmentStDate_Dt__c\": \"02/28/2019\",\"Pricing_ShipmentEndDate_Dt__c\": \"02/28/2019\",\"Pricing_Server_Deal_Type_Nm__c\": \"HPC\",\"Pricing_Region_Nm__c\": \"EMEA\",\"SBQQ__QuoteLine__c\": [{\"Id\": \"001i000001AWbWu\",\"Name\": \"QL-0200061\",\"Pricing_Deal_RFQ_Status_Nm__c\": \"\",\"Pricing_ECAP_Price__c\": \"100\",\"Pricing_Meet_Comp_Price_Amt__c\": \"90\",\"Pricing_Unit_Qty__c\": \"300\",\"Pricing_Deal_RFQ_Id__c\": \"543212\",\"Pricing_Status_Nm__c\": \"\",\"SBQQ__Product__c\": {\"Id\": \"001i000001AWbWu\",\"Name\": \"Intel® Xeon® Processor E7-8870 v4\",\"Core_Product_Name_EPM_ID__c\": \"192283\"},\"Pricing_Competetor_Product__c\": {\"Id\": \"\",\"Name\": \"\"},\"Pricing_Performance_Metric__c\": [{\"Id\": \"001i000001AWbWu\",\"Name\": \"PM-000010\",\"Pricing_Performance_Metric_Nm__c\": \"SpecInt\",\"Pricing_Intel_SKU_Performance_Nbr__c\": \"10\",\"Pricing_Comp_SKU_Performance_Nbr__c\": \"9\",\"Pricing_Weighting_Pct__c\": \"100\"}]}],\"Pricing_Comments__c\": [{\"Id\": \"\",\"Name\": \"\",\"Pricing_Question__c\": \"\",\"Pricing_Answer__c\": \"\"}]}}}";
            adminTools.ExecutePostTest(jsonDataPacket).then(function (response) {
                    logger.success("Post Test executed succesfully");
                });
            }

    }
})();