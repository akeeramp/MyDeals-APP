(function () {
    'use strict';
    angular
       .module('app.admin') //TODO: once we integrate with contract manager change the module to contract
       .controller('ProductCAPBreakoutController', ProductCAPBreakoutController);

    ProductCAPBreakoutController.$inject = ['$filter', '$scope', '$uibModalInstance', 'productData', 'dataService', 'contractData', 'logger'];

    function ProductCAPBreakoutController($filter, $scope, $uibModalInstance, productData, dataService, contractData, logger) {
        var vm = this;
        vm.productData = productData;
        vm.contractData = contractData;

        var data = [{
            'CUST_MBR_SID': vm.contractData.CUST_MBR_SID,
            'PRD_MBR_SID': vm.productData.PRD_MBR_SID,
            'GEO_MBR_SID': vm.contractData.GEO_MBR_SID.toString(),
            'DEAL_STRT_DT': vm.contractData.START_DT,
            'DEAL_END_DT': vm.contractData.END_DT,
            'getAvailable': 'N',
            'priceCondition': vm.productData.CAP_PRC_COND
        }];

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    dataService.post("api/Products/GetProductCAPYCS2Data/" + data[0].getAvailable + "/" +
                        data[0].priceCondition, data).then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get data.", response, response.statusText);
                        });
                }
            }
        });

        vm.gridOptionsCAP = {
            dataSource: vm.dataSource,
            sortable: true,
            filterable: true,
            resizable: true,
            columns: [
                  { field: "HIER_VAL_NM", title: "Product" },
                  { field: "CAP_START_DATE", title: "Date Range", width: '24%', template: "#= kendo.toString(new Date(CAP_START_DATE), 'M/d/yyyy') # - #= kendo.toString(new Date(CAP_END_DATE), 'M/d/yyyy') #" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "CUST_MBR_SID1", title: "SOLD TO" },
                  { field: "CAP", title: "CAP" },
                  { field: "CAP_PRC_COND", template: '<input type="checkbox" style="margin-top:2px;" disabled ng-checked="dataItem.CAP_PRC_COND == \'YCP1\'" />', title: 'YCP1' },
            ]
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        }
    }
})();