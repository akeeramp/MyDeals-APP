angular
    .module('app.contract')
    .controller('MeetCompController', MeetCompController)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
MeetCompController.$inject = ['$scope', '$uibModalStack', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger', '$uibModal', '$timeout', 'contractData', 'parentScope','PRC_ST_OBJ_SID'];

function MeetCompController($scope, $uibModalStack, $state, $stateParams, $filter, objsetService, confirmationModal, dataService, logger, $uibModal, $timeout, contractData, parentScope, PRC_ST_OBJ_SID) {

    $scope.contractData = contractData;
    $scope.parent = parentScope;
    $scope.PRC_ST_OBJ_SID = PRC_ST_OBJ_SID;
    $scope.OBJ_SID = contractData.DC_ID;
    $scope.forceRun = function () {
        var data = $scope.contractData.PRC_ST;
        if (data !== undefined) {
            for (var d = 0; d < data.length; d++) {
                if (data[d].MEETCOMP_TEST_RESULT === "" || data[d].MEETCOMP_TEST_RESULT === "Not Run Yet") return true;
                if (data[d].COST_TEST_RESULT === "" || data[d].COST_TEST_RESULT === "Not Run Yet") return true;
            }
        }
        return false;       
    }

    $scope.refreshContractData = function () {        
        objsetService.readContract($scope.contractData.DC_ID).then(function (data) {
            $scope.contractData = $scope.initContract(data);
            $scope.contractData.CUST_ACCNT_DIV_UI = "";

            // if the current strategy was changed, update it
            $scope.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, dataItem.PRC_ST_OBJ_SID);
            $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, $scope.curPricingStrategy.PRC_TBL[0].DC_ID);

            $scope.$broadcast('refreshContractDataComplete');

            $timeout(function () {
                $scope.$apply();
            });
            
        });
    }

    $scope.dismissPopup = function () {
        $uibModalStack.dismissAll();
    }

    $scope.resetDirty = function () {
        //return $scope.parent.resetDirty();
    }

}