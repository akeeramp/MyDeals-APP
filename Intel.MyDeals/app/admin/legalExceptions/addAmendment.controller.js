(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('addAmendmentController', addAmendmentController)

    addAmendmentController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModalInstance', 'dataItem'];

    function addAmendmentController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModalInstance, dataItem) {
        var vm = this;
        var data = {};
        vm.legalExceptionData = dataItem;
        vm.noOfCol = 12 / vm.legalExceptionData.length;
              

        vm.save = function (event) {

            if (event =='Submit')
            {
                var data = {};
                $scope.today = new Date();
                vm.legalExceptionData[0]['VER_NBR'] = vm.legalExceptionData[0]['VER_NBR'] + 1;
                vm.legalExceptionData[0]['VER_CRE_DTM'] = moment($scope.today).format("l");
                vm.legalExceptionData[0]['CHG_EMP_NAME']=usrName;
                var data = vm.legalExceptionData[0];

                legalExceptionService.updateLegalException(data)
                    .then(function (response) {
                        
                        logger.success("Legal exception were successfully updated.");                       
                        e.success(response.data);

                    }, function (response) {
                        logger.error("Unable to update Legal exception.", response, response.statusText);
                    });
            }
           
        }

        //To close the popup 
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();