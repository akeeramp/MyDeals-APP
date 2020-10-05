(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('updateLegalExceptionController', updateLegalExceptionController)

    updateLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModalInstance', 'dataItem'];

    function updateLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModalInstance, dataItem) {

        var vm = this;
        vm.legalExceptionData = dataItem;
        vm.noOfCol = 12 / vm.legalExceptionData.length;

        $scope.today = new Date();

        vm.legalExceptionData.PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
        vm.legalExceptionData.PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
        vm.legalExceptionData.DT_APRV = moment(dataItem.DT_APRV).format("l");
        vm.legalExceptionData.CHG_DTM = moment(dataItem.CHG_DTM).format("l");

        //Saving Legal Exception Data
        vm.save = function (event) {

            if (event == 'Submit') {

                var data = {};
                var data = vm.legalExceptionData;

                legalExceptionService.updateLegalException(data)
                    .then(function (response) {

                        logger.success("Legal Exception was successfully updated.");
                        $scope.ok();
                        e.success(response.data);

                    }, function (response) {
                        logger.error("Unable to update Legal Exception.", response, response.statusText);
                    });
            }

        }

        //To close the Edit Legal Exception popup 
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        
    }
})();