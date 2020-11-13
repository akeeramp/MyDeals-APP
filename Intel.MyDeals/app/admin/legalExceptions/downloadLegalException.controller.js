(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('downloadLegalExceptionController', downloadLegalExceptionController)

    downloadLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$uibModalInstance', 'dataItem'];

    function downloadLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, $uibModalInstance, dataItem) {
        var vm = this;
        vm.legalExceptionData = dataItem;
        vm.chkData = {};
        vm.chkData.PreviousVersion = false;
        vm.chkData.DealList = false;
        

        vm.download = function (event)
        {           
            vm.data = {};
            var arr = [];            
            for (var j = 0; j < vm.legalExceptionData.length; j++)
            {
                arr.push(vm.legalExceptionData[j]['MYDL_PCT_LGL_EXCPT_SID']);
            }                                  
            var pctExceptionList = arr.join();
            var chkPreviousVersion = vm.chkData.PreviousVersion;
            var chkDealList=vm.chkData.DealList;
            if (pctExceptionList != "")
            { 
                legalExceptionService.getDownloadLegalException(pctExceptionList, chkPreviousVersion, chkDealList)
                    .then(function (response) {
                        var grid = $("#grid").data("kendoGrid");                   
                        gridUtils.dsToExcelLegalException(grid, response.data, "Legal Exception Export.xlsx", false, chkDealList);                    
                        $scope.ok();
                        e.success(response.data);

                    }, function (response) {
                        logger.error("Unable to download PCT Legal exception.", response, response.statusText);
                    });
            }
        }
        
        //To close the Download popup
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();