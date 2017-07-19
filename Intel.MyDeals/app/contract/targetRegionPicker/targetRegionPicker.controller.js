(function () {
    'use strict';
    angular
       .module('app.admin')
       .controller('TargetRegionPickerController', TargetRegionPickerController);

    TargetRegionPickerController.$inject = ['$filter', '$scope', '$uibModalInstance', 'targetRegionData', 'dataService', 'logger'];

    function TargetRegionPickerController($filter, $scope, $uibModalInstance, targetRegionData, dataService, logger) {
        var vm = this;
        vm.targetRegionData = targetRegionData;

        vm.lookupURLWithGeo = vm.targetRegionData.LOOKUPURL + vm.targetRegionData.GEO_MBR_SID;


        vm.ok = function () {
            var returnVal = "";
            if (vm.targetRegionData.TRGT_RGN !== undefined) {
                returnVal = vm.targetRegionData.TRGT_RGN;
            }

            $uibModalInstance.close(returnVal);
        };

        vm.close = function () {
            $uibModalInstance.dismiss();
        }
    }
})();