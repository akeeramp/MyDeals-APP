(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('updateLegalExceptionController', updateLegalExceptionController)

    updateLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModalInstance', 'dataItem'];

    function updateLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModalInstance, dataItem) {

        var vm = this;
        vm.legalExceptionData = dataItem;
        var inValidDateFormat = "";
        var invalidData = "false";
        vm.noOfCol = 12 / vm.legalExceptionData.length;
        var arrEmptyDatachk = ["VER_NBR", "CHG_EMP_NAME", "CHG_DTM", "DEALS_USED_IN_EXCPT","USED_IN_DL"];
        var arrDateFormatCheck = ["DT_APRV", "PCT_LGL_EXCPT_END_DT", "PCT_LGL_EXCPT_STRT_DT"];

        $scope.today = new Date();

        vm.legalExceptionData.PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
        vm.legalExceptionData.PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
        vm.legalExceptionData.DT_APRV = moment(dataItem.DT_APRV).format("l");
        vm.legalExceptionData.CHG_DTM = moment(dataItem.CHG_DTM).format("l");

        //Input data must be not empty
        function validateEmptyData(data) {
            for (var key in data) {
                if (arrEmptyDatachk.includes(key) == false) {
                    if ((data[key] === undefined || data[key] === null || data[key] === "")) {
                        invalidData = "true";
                    }
                }
            }

            return invalidData;
        }

        //Date format must be correct
        function validateDateFormat(data)
        {
            for (var key in data) {
                if ((data[key] === undefined || data[key] === null || data[key] === "") && arrDateFormatCheck.includes(key) == true)
                {
                    if (moment(key).format('MM-DD-YYYY') != "Invalid Date")
                    {
                        inValidDateFormat = "Invalid Date";
                    }                    
                }
            }
            return inValidDateFormat;          
        }

        //Saving Legal Exception Data
        vm.save = function (event)
        {
            if (event == 'Submit')
            {             
                var data = {};
                inValidDateFormat = "";
                invalidData = "false";
                invalidData = validateEmptyData(vm.legalExceptionData);
                inValidDateFormat=validateDateFormat(vm.legalExceptionData);
                           
                if (invalidData != "true" ) {
                    if (inValidDateFormat != "Invalid Date") {
                        var data = vm.legalExceptionData;
                        legalExceptionService.updateLegalException(data)
                            .then(function (response) {

                                logger.success("Legal Exception was successfully updated.");
                                $scope.ok(response.data);
                                e.success(response.data);

                            }, function (response) {
                                logger.error("Unable to update Legal Exception.", response, response.statusText);
                            });

                    }
                    else
                    {
                        logger.warning("Please check the date format.Unable to Update data");
                    }
                    
                }
                else {
                    logger.warning("Please fill the mandatory fields(*) or check the Date format");
                }
            }

        }

        //To close the Edit Legal Exception popup 
        $scope.ok = function (data) {
            $uibModalInstance.close(data);
        };
        
    }
})();