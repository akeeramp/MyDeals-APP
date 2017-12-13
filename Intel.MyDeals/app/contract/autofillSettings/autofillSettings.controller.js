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

        if (!!vm.autofillData.DEFAULT.GEO_COMBINED) {
            //add extra tag to GEO_COMBINED so that templates give it multiselect behavior
            autofillData.DEFAULT.GEO_COMBINED["extra"] = true;
        }

        vm.autofillData.DEALTYPE_DISPLAY = vm.autofillData.DEALTYPE.replace("_", "").toUpperCase();

        vm.ok = function () {
            var returnVal = vm.autofillData.DEFAULT;
            $uibModalInstance.close(returnVal);
        };

        vm.close = function () {
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