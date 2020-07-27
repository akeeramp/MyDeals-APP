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
            toolbar: [{ name: 'excel', text: '<div class="excelText"><span>Excel<br/>Export</span></div>' }],
            excel: {
                fileName: "CAP Breakup Deatils Export.xlsx",
                filterable: true
            },
            sortable: true,
            resizable: true,
            columns: [
                  { field: "HIER_VAL_NM", title: "Product" },
                  { field: "Level4", title: "Deal Product Name", width: '20%', template: " #= kendo.toString(Level4) #" },
                  { field: "CAP_START", title: "Date Range", width: '24%', template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') # - #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "CUST_MBR_SID1", title: "SOLD TO"},
                  { field: "CAP", title: "CAP" },
                  { field: "CAP_PRC_COND", template: '<input type="checkbox" style="margin-top:2px;" disabled ng-checked="dataItem.CAP_PRC_COND == \'YCP1\'" />', title: 'YCP1' },
            ]
        };

        vm.gridOptionsYCS2 = {
            dataSource: vm.dataSource,
            toolbar: [{ name: 'excel', text: '<div class="excelText"><span>Excel<br/>Export</span></div>' }],
            excel: {
                fileName: "YCS2 Details Export.xlsx",
                filterable: true
            },
            sortable: true,
            resizable: true,
            columns: [
                { field: "YCS2", title: "YCS2", template: "#= isNaN(YCS2) ? YCS2 : kendo.toString(parseFloat(YCS2), 'c') #" },
                { field: "GEO_MBR_SID", title: "GEO" },
                { field: "SOLD_TO_ID", title: "Sold To Id", template: " #= kendo.toString(SOLD_TO_ID) #" },
                { field: "Level4", title: "Deal Product Name", template: " #= kendo.toString(Level4) #" },
                { field: "MTRL_ID", title: "Material Id", template: " #= kendo.toString(MTRL_ID) #" },
                { field: "YCS2_START", title: "Start Date", template: "#= kendo.toString(new Date(YCS2_START), 'M/d/yyyy') #" },
                { field: "YCS2_END", title: "End Date", template: " #= kendo.toString(new Date(YCS2_END), 'M/d/yyyy') #" }
            ]
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        }
    }
})();