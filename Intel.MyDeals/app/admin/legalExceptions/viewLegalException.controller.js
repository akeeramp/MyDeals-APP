(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('viewLegalExceptionController', viewLegalExceptionController)
    
    viewLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModalInstance', 'dataItem'];

    function viewLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModalInstance, dataItem) {
        var vm = this;
        vm.legalExceptionData = dataItem;
        vm.noOfCol = 12 / vm.legalExceptionData.length;

        $scope.today = new Date();

        vm.legalExceptionData.PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
        vm.legalExceptionData.PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
        vm.legalExceptionData.DT_APRV = moment(dataItem.DT_APRV).format("l");
        vm.legalExceptionData.CHG_DTM = moment(dataItem.CHG_DTM).format("l");

        //To close the View Legal Exception popup 
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();