angular
    .module('app.contract')
    .controller('dealProductsModalCtrl', dealProductsModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

dealProductsModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'objsetService'];

function dealProductsModalCtrl($scope, $uibModalInstance, dataItem, objsetService) {

    $scope.dataItem = dataItem;

    var prdIds = [];
    var prods = $scope.dataItem.PRODUCT_FILTER;
    angular.forEach(prods, function (value, key) {
        prdIds.push(value);
    });

    $scope.gridOptions = {
        dataSource: {
            transport: {
                read: "/api/Products/GetProductsByIds/" + prdIds.join(',')
            }
        },
        toolbar: [{ name: 'excel', text: '<div class="excelText"><span>Excel<br/>Export</span></div>' }],
        excel: {
            fileName: "Deal " + $scope.dataItem.DC_ID + " Product Export.xlsx",
            filterable: true
        },
        sortable: true,
        scrollable: true,
        resizable: true,
        columns: [
            {
                field: "HIER_VAL_NM",
                title: "Product",
                width: "110px"
            }, {
                field: "DEAL_PRD_TYPE",
                title: "Product Type",
                width: "110px"
            }, {
                field: "PRD_CAT_NM",
                title: "Product Category",
                width: "110px"
            }, {
                field: "BRND_NM",
                title: "Brand",
                width: "110px"
            }, {
                field: "FMLY_NM",
                title: "Family",
                width: "110px"
            }, {
                field: "PCSR_NBR",
                title: "Processor",
                width: "110px"
            }, {
                field: "MTRL_ID",
                title: "Material Id",
                width: "110px"
            }, {
                field: "MM_MEDIA_CD",
                title: "Media Code",
                width: "110px"
            }, {
                field: "PRD_STRT_DTM",
                title: "Prod Start Date",
                width: "110px"
            }, {
                field: "PRD_END_DTM",
                title: "Prod End Date",
                width: "110px"
            }, {
                field: "SKU_NM",
                title: "Sku Name",
                width: "110px"
            }, {
                field: "CPU_CACHE",
                title: "CPU Cache",
                width: "110px"
            }, {
                field: "CPU_PACKAGE",
                title: "CPU Package",
                width: "110px"
            }, {
                field: "CPU_PROCESSOR_NUMBER",
                title: "CPU Processor",
                width: "110px"
            }, {
                field: "CPU_VOLTAGE_SEGMENT",
                title: "CPU Voltage",
                width: "110px"
            }, {
                field: "CPU_WATTAGE",
                title: "CPU Wattage",
                width: "110px"
            }
        ]
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

}