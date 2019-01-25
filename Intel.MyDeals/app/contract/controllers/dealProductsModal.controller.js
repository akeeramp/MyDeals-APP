angular
    .module('app.contract')
    .controller('dealProductsModalCtrl', dealProductsModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

dealProductsModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'objsetService', 'dataService', '$filter'];

function dealProductsModalCtrl($scope, $uibModalInstance, dataItem, objsetService, dataService, $filter) {

    $scope.dataItem = dataItem;

    $scope.showDealProducts = $scope.dataItem.OBJ_SET_TYPE_CD == 'VOL_TIER' || $scope.dataItem.OBJ_SET_TYPE_CD == 'PROGRAM';

    var prdIds = [];

    var prods = $scope.dataItem.PRODUCT_FILTER;

    if ($scope.dataItem._contractPublished !== undefined && $scope.dataItem._contractPublished == 1) {
        prods = $scope.dataItem.products;
        angular.forEach(prods, function (value, key) {
            prdIds.push(value.PRD_MBR_SID);
        });
    } else {
        angular.forEach(prods, function (value, key) {
            prdIds.push(value);
        });
    }

    var prdData = {
        "PrdIds": prdIds
    }

    var copyOfData = [];

    // For VOL_TIER and product if Mydeals product is at higher level > 7007, actual products against which deal are created are in GRP PDL table
    // From deal id get the product and CAP
    function getProductDetailsFromDealId(e) {
        return dataService.get('/api/Products/GetDealProducts/' + $scope.dataItem.DC_ID + '/5/' + $scope.dataItem.CUST_MBR_SID + '/false')
                           .then(function (response) {
                               copyOfData = response.data;
                               e.success(response.data);
                           }, function (response) {
                               logger.error("Unable to get product details.", response, response.statusText);
                           });
    }

    // For ECAP, KIT get product details based on product id
    function getProductDetailsFromProductId(e) {
        dataService.post('/api/Products/GetProductsByIds', prdData)
                          .then(function (response) {
                              e.success(response.data);
                          }, function (response) {
                              logger.error("Unable to get product details", response, response.statusText);
                          });
    }

    $scope.gridOptions = {
        dataSource: {
            transport: {
                read: function (e) {
                    if ($scope.showDealProducts) {
                        getProductDetailsFromDealId(e);
                    } else {
                        getProductDetailsFromProductId(e);
                    }
                }
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
                width: "160px"
            }, {
                field: "CAP",
                title: "CAP-YCP1",
                width: "110px",
                hidden: !$scope.showDealProducts,
                template: function (dataItem) {
                    if (dataItem.CAP == 'No CAP') {
                        return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No CAP</div></div>'
                    }
                    return '<div style="text-align: center;">' + dataItem.CAP + '</div>';
                }
            }, {
                field: "DEAL_PRD_TYPE",
                title: "Product Type",
                width: "110px"
            }, {
                field: "PRD_CAT_NM",
                title: "Product Vertical",
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
                field: "YCS2",
                title: "YCS2",
                width: "110px",
                hidden: !$scope.showDealProducts,
                template: function (dataItem) {
                    if (dataItem.YCS2 == 'No CAP') {
                        return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No YCS2</div></div>'
                    }
                    return '<div style="text-align: center;">' + dataItem.YCS2 + '</div>';
                }
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

    $scope.copyNoCAPProudcts = function (columnValue) {
        if (copyOfData.length == 0) return "";
        var noCAPProducts = copyOfData.filter(function (x) {
            return x.CAP === null || x.CAP == "No CAP";
        });
        if (noCAPProducts.length == 0) {
            return "No prodcuts were found without CAP";
        }
        noCAPProducts = $filter('unique')(noCAPProducts, columnValue)
        var noCAPProdNames = noCAPProducts.map(function (x) {
            return x[columnValue];
        }).join(',');

        return noCAPProdNames;
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

}