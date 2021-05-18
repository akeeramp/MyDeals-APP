(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('addLegalExceptionController', addLegalExceptionController)

    addLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$uibModalInstance'];

    function addLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, $uibModalInstance) {
        
        var vm = this;
        $scope.today = new Date();
        var inValidDateFormat = "";
        var inValidData = "false";
        var arrEmptyDatachk = ["VER_NBR", "CHG_EMP_NAME", "CHG_DTM", "DEALS_USED_IN_EXCPT", "USED_IN_DL","CHG_EMP_WWID","MYDL_PCT_LGL_EXCPT_SID"];
        var arrDateFormatCheck = ["DT_APRV", "PCT_LGL_EXCPT_END_DT", "PCT_LGL_EXCPT_STRT_DT"];



        //Input data must be not empty
        function validateEmptyData(data) {
            for (var key in data) {
                if (arrEmptyDatachk.includes(key) == false)
                {
                    if ((data[key] === undefined || data[key] === null || data[key] === "")) {                     
                        inValidData = "true";                       
                    }
                }             
            }

            return inValidData;
        }

        //Date format must be correct
        function validateDateFormat(data) {
            for (var key in data) {
                if ((data[key] === undefined || data[key] === null || data[key] === "") && arrDateFormatCheck.includes(key) == true) {
                    if (moment(key).format('MM-DD-YYYY') != "Invalid Date") {
                        inValidDateFormat = "Invalid Date";
                    }
                }
            }
            return inValidDateFormat;
        }

        vm.legalExceptionData = {
            "ACTV_IND": true,
            "APRV_ATRNY": "",
            "BUSNS_OBJ": "",
            "CHG_DTM": moment($scope.today).format("l"),
            "CHG_EMP_NAME": usrName,
            "CHG_EMP_WWID": undefined,
            "COST": "",
            "CRE_DTM": moment($scope.today).format("l"),
            "CRE_EMP_WWID": moment($scope.today).format("l"),
            "CUST_PRD": "",
            "DT_APRV": moment($scope.today).format("l"),
            "EXCPT_RSTRIC_DURN": "",
            "FRCST_VOL_BYQTR": "",
            "INTEL_PRD": "",
            "IS_DSBL": false,
            "JSTFN_PCT_EXCPT": "",
            "MEET_COMP_PRC": "",
            "MEET_COMP_PRD": "",
            "MYDL_PCT_LGL_EXCPT_SID": undefined,
            "OTHER": "",
            "PCT_EXCPT_NBR": "",
            "PCT_LGL_EXCPT_END_DT": moment($scope.today).format("l"),
            "PCT_LGL_EXCPT_STRT_DT": moment($scope.today).format("l"),
            "PRC_RQST": "",
            "PTNTL_MKT_IMPCT": "",
            "RQST_ATRNY": "",
            "RQST_CLNT": "",
            "SCPE": "",
            "USED_IN_DL": "",
            "VER_CRE_DTM": moment($scope.today).format("l"),
            "VER_NBR": 1,
            "DEALS_USED_IN_EXCPT": ""
        }

        vm.noOfCol = 1;

        //Saving and Creating Legal Exception
        vm.save = function () {

            inValidDateFormat = "";
            inValidData = "false";
            inValidData = validateEmptyData(vm.legalExceptionData);
            inValidDateFormat = validateDateFormat(vm.legalExceptionData);

            if (inValidData != "true") {
                if (inValidDateFormat != "Invalid Date") {
                    legalExceptionService.createLegalException(vm.legalExceptionData)
                        .then(function (response) {
                            logger.success("Legal Exception added.");
                            $scope.ok(true);
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to add new Legal Exception.", response, response.statusText);
                        });
                }
                else {
                    logger.warning("Please check the date format.Unable to add data");
                }

            }
            else {
                logger.warning("Please fill the mandatory fields(*) or check the Date format");
            }
        }

        //To close the Add Legal Exception popup 
        $scope.ok = function (isSaved) {
            $uibModalInstance.close(isSaved);
        };
    }
})();