(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('addLegalExceptionController', addLegalExceptionController)

    addLegalExceptionController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$uibModalInstance'];

    function addLegalExceptionController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, $uibModalInstance) {
        
        var vm = this;
        $scope.today = new Date();

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
            "VER_NBR": 1
        }

        vm.noOfCol = 1;

        //Saving and Creating Legal Exception
        vm.save = function () {
            legalExceptionService.createLegalException(vm.legalExceptionData)
                .then(function (response) {
                    logger.success("Legal Exception added.");
                    $scope.ok();
                    e.success(response.data);

                }, function (response) {
                    logger.error("Unable to add new Legal Exception.", response, response.statusText);
                });
        }

        //To close the Add Legal Exception popup 
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }
})();