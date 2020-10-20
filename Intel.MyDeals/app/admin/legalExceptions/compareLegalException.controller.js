(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('compareController', compareController)

    compareController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModalInstance', 'dataItem'];

    function compareController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModalInstance, dataItem) {
        var vm = this;
        vm.legalExceptionData = dataItem;
        vm.noOfCol = 12 / vm.legalExceptionData.length;


        //To close the compare popup 
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();