(function () {
    'use strict';
    angular
       .module('app.admin')
       .controller('AutofillSettingsController', AutofillSettingsController);

    AutofillSettingsController.$inject = ['$filter', '$scope', '$uibModalInstance', 'autofillData', 'dataService', 'logger'];

    function AutofillSettingsController($filter, $scope, $uibModalInstance, autofillData, dataService, logger) {
        var vm = this;
        vm.autofillData = autofillData;

        if (!!vm.autofillData.DEFAULT.GEO_COMBINED) {
            //add extra tag to GEO_COMBINED so that templates give it multiselect behavior
            autofillData.DEFAULT.GEO_COMBINED["extra"] = true;
        }

        vm.autofillData.DEALTYPE = vm.autofillData.DEALTYPE.replace("_", "").toUpperCase();
        
        vm.ok = function () {
            var returnVal = vm.autofillData.DEFAULT;
            $uibModalInstance.close(returnVal);
        };

        vm.close = function () {
            $uibModalInstance.dismiss();
        }
    }
})();