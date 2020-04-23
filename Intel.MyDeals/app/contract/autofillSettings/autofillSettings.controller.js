(function () {
    'use strict';
    angular
       .module('app.admin')
        .controller('AutofillSettingsController', AutofillSettingsController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    AutofillSettingsController.$inject = ['$filter', '$scope', '$uibModalInstance', 'autofillData', 'dataService', 'logger'];

    function AutofillSettingsController($filter, $scope, $uibModalInstance, autofillData, dataService, logger) {
        var vm = this;
        vm.autofillData = autofillData;
        vm.rebateTypeTitle = vm.autofillData.ISTENDER ? "Tender Table" : "Pricing Table";
        
        if (!!vm.autofillData.DEFAULT.GEO_COMBINED) {
            //add extra tag to GEO_COMBINED so that templates give it multi-select behavior
            autofillData.DEFAULT.GEO_COMBINED["extra"] = true;
        }

        // If tender... change dropdown url to remove frontend YCS2, if vistex, remove all front ends.
        if (vm.autofillData.ISTENDER) {
            vm.autofillData.DEFAULT.PROGRAM_PAYMENT.opLookupUrl = "/api/Dropdown/GetProgPaymentDropdowns/PROGRAM_PAYMENT";
        }
        // Add back in some day if we decide to make a button bar that can contain only one button.  :)
        //else if (vm.autofillData.isVistexHybrid == 1) {
        //    vm.autofillData.DEFAULT.PROGRAM_PAYMENT.opLookupUrl = "/api/Dropdown/GetHybridPaymentDropdowns/PROGRAM_PAYMENT";
        //}

        vm.autofillData.DEALTYPE_DISPLAY = vm.autofillData.DEALTYPE.replace("_", "").toUpperCase();

        vm.ok = function () {
            vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.validMsg = vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.validMsg = "";
            vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.isError = vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.isError = false;
            if (vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value != null &&
                vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value !== "" &&
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value != null &&
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value !== "") {
                vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.validMsg =
                    "Both Overarching Maximum Dollars and Overarching Maximum Volume cannot be fill out.  Pick one.";
                vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.isError = true;
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.validMsg =
                    "Both Overarching Maximum Volume and Overarching Maximum Dollars cannot be fill out.  Pick one.";
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.isError = true;
            } else if (vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === "0" || vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === 0) {
                vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.validMsg = "Overarching Maximum Dollars must be blank or > 0";
                vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.isError = true;
            } else if (vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === "0" ||
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === 0) {
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.validMsg = "Overarching Maximum Volume must be blank or > 0";
                vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.isError = true;
            } else {
                // Is Tender Rules Force Value Checks
                if (vm.autofillData.ISTENDER === "1") {
                    if (vm.autofillData.DEFAULT.AR_SETTLEMENT_LVL.value !== "Issue Credit to Billing Sold To") { 
                        vm.autofillData.DEFAULT.AR_SETTLEMENT_LVL.value = "Issue Credit to Billing Sold To";
                    }
                    if (vm.autofillData.DEFAULT.PERIOD_PROFILE.value !== "Bi-Weekly (2 weeks)") { 
                        vm.autofillData.DEFAULT.PERIOD_PROFILE.value = "Bi-Weekly (2 weeks)";
                    }
                }
                var returnVal = vm.autofillData.DEFAULT;
                $uibModalInstance.close(returnVal);
            }
            
        };

        vm.close = function () {
            // Clear out values if they need to be
            vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.validMsg = vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.validMsg = "";
            vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.isError = vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.isError = false;

            $uibModalInstance.dismiss(autofillData.DEALTYPE);
        }

        $scope.$watch('vm.autofillData.DEFAULT', function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue === undefined || newValue === undefined) return;

            if (oldValue != null && newValue == null) return;

            if (oldValue == null && newValue != null) {
                return;
            } else {
                if (oldValue["PAYOUT_BASED_ON"].value === "Billings" && newValue["PAYOUT_BASED_ON"].value === "Consumption") {
                    newValue["PROGRAM_PAYMENT"].value = "Backend";
                }
                if (newValue["PROGRAM_PAYMENT"].value.toUpperCase().indexOf("FRONTEND") > -1 && oldValue["PROGRAM_PAYMENT"].value.toUpperCase().indexOf("FRONTEND") === -1) {
                    newValue["PAYOUT_BASED_ON"].value = "Billings";
                }
            }

        }, true);
    }
})();