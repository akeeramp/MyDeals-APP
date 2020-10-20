(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('viewLegalExceptionDealListController', viewLegalExceptionDealListController)

    viewLegalExceptionDealListController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$uibModalInstance', 'dataItem'];

    function viewLegalExceptionDealListController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, $uibModalInstance, dataItem) {
        var vm = this;
        vm.legalExceptionData = dataItem;
        vm.noOfCol = 12 / vm.legalExceptionData.length;

        //To close the View Legal Exception Deal List popup
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();