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
            $scope.adminToolsData.productIds = $scope.adminToolsData.productIds.replace(/,+/g, ',').trim(' ');
            var isValidProdIds = reg.test($scope.adminToolsData.productIds);
            if (!isValidProdIds) {
                $scope.adminToolsData._behaviors.isError["productIds"] = true;
                $scope.adminToolsData._behaviors.validMsg["productIds"] = "Please enter comma (,) separated L4 product ids only";
            }
            if (isValid && isValidProdIds) {
                adminTools.ExecuteCostGapFiller(startYearQuarter, endYearQuarter, $scope.adminToolsData.productIds).then(function (response) {
                    logger.success("Cost Gap Filler executed succesfully");
                });
            }
        }
    }
})();