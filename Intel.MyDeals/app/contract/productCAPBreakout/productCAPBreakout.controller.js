(function () {
    'use strict';
    angular
       .module('app.admin') //TODO: once we integrate with contract manager change the module to contract
        .controller('ProductCAPBreakoutController', ProductCAPBreakoutController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    ProductCAPBreakoutController.$inject = ['$filter', '$scope', '$uibModalInstance', 'productData', 'priceCondition', 'dataService', 'logger'];

    function ProductCAPBreakoutController($filter, $scope, $uibModalInstance, productData, priceCondition, dataService, logger) {
        var vm = this;
        vm.productData = productData;        
        $scope.priceCondition = priceCondition;
        var data = [];
        data.push(productData);        

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    dataService.post("api/Products/GetProductCAPYCS2Data/" + data[0].getAvailable + "/" +
                        data[0].priceCondition, data).then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get CAP Breakout data.", response, response.statusText);
                        });
                }
            }
        });

        vm.gridOptionsCAP = {
            dataSource: vm.dataSource,
            sortable: true,
            resizable: true,
            columns: [
                  { field: "HIER_VAL_NM", title: "Product" },
                  { field: "CAP_START", title: "Date Range", width: '24%', template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') # - #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "CUST_MBR_SID1", title: "SOLD TO"},
                  { field: "CAP", title: "CAP" },
                  { field: "CAP_PRC_COND", template: '<input type="checkbox" style="margin-top:2px;" disabled ng-checked="dataItem.CAP_PRC_COND == \'YCP1\'" />', title: 'YCP1' },
            ]
        };

        vm.gridOptionsYCS2 = {
            dataSource: vm.dataSource,
            sortable: true,
            resizable: true,
            columns: [
                { field: "YCS2", title: "YCS2", template: "#= isNaN(YCS2) ? YCS2 : kendo.toString(parseFloat(YCS2), 'c') #" },
                { field: "GEO_MBR_SID", title: "GEO" },
                { field: "SOLD_TO_ID", title: "SOLD_TO_ID", template: " #= kendo.toString(SOLD_TO_ID) #" },
                { field: "DEAL_PRD_NM", title: "HIER_VAL_NM", template: " #= kendo.toString(HIER_VAL_NM) #" },
                { field: "MTRL_ID", title: "MTRL_ID", template: " #= kendo.toString(MTRL_ID) #" },
                { field: "YCS2_START", title: "Start Date", template: "#= kendo.toString(new Date(YCS2_START), 'M/d/yyyy') #" },
                { field: "YCS2_END", title: "End Date", template: " #= kendo.toString(new Date(YCS2_END), 'M/d/yyyy') #" }
            ]
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        }
    }
})();