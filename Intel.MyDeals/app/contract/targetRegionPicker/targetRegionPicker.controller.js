(function () {
    'use strict';
    angular
       .module('app.admin')
       .controller('TargetRegionPickerController', TargetRegionPickerController);

    TargetRegionPickerController.$inject = ['$filter', '$scope', '$uibModalInstance', 'targetRegionData', 'dataService', 'logger'];

    function TargetRegionPickerController($filter, $scope, $uibModalInstance, targetRegionData, dataService, logger) {
        var vm = this;
        vm.targetRegionData = targetRegionData;
        console.log("A")
        console.log(targetRegionData.TRGT_RGN)
        //debugger;
        //var data = [];
        //data.push(targetRegionData);

        vm.lookupURLWithGeo = vm.targetRegionData.LOOKUPURL + vm.targetRegionData.GEO_MBR_SID;

        //console.log(targetRegionData.$scope)
        //vm.dataSource = new kendo.data.DataSource({
        //    transport: {
        //        read: function (e) {
        //            dataService.post("api/Products/GetProductCAPYCS2Data/" + data[0].getAvailable + "/" +
        //                data[0].priceCondition, data).then(function (response) {
        //                    e.success(response.data);
        //                }, function (response) {
        //                    logger.error("Unable to get CAP Breakout data.", response, response.statusText);
        //                });
        //        }
        //    }
        //});

        //vm.gridOptionsCAP = {
        //    dataSource: vm.dataSource,
        //    sortable: true,
        //    resizable: true,
        //    columns: [
        //          { field: "HIER_VAL_NM", title: "Product" },
        //          { field: "CAP_START", title: "Date Range", width: '24%', template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') # - #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" },
        //          { field: "GEO_MBR_SID", title: "GEO" },
        //          { field: "CUST_MBR_SID1", title: "SOLD TO" },
        //          { field: "CAP", title: "CAP" },
        //          { field: "CAP_PRC_COND", template: '<input type="checkbox" style="margin-top:2px;" disabled ng-checked="dataItem.CAP_PRC_COND == \'YCP1\'" />', title: 'YCP1' },
        //    ]
        //};

        vm.ok = function () {
            var returnVal = "";
            if (vm.targetRegionData.TRGT_RGN !== undefined) {
                returnVal = vm.targetRegionData.TRGT_RGN;
                //console.log(vm.targetRegionData.TRGT_RGN);
            }

            $uibModalInstance.close(returnVal);
        };

        vm.close = function () {
            $uibModalInstance.dismiss();
        }
    }
})();