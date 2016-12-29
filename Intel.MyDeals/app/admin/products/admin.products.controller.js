(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductController', ProductController)

    ProductController.$inject = ['$uibModal', 'productService', '$scope', 'logger']

    function ProductController($uibModal, productService, $scope, logger) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    productService.getProducts()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Geos.", response, response.statusText);
                        });
                },
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                }
            }
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            selectable: true,
            pageable: true,
            editable: "popup",
            change: vm.onChange,
            toolbar: vm.toolBarTemplate,
            columns: [
            {
                field: "PRD_MBR_SID",
                title: "Id",
            },
            {
                field: "DEAL_PRD_TYPE",
                title: "Type"
            },
            {
                field: "PRD_CATGRY_NM",
                title: "Category"
            },
            {
                field: "BRND_NM",
                title: "Brand",
            },
            {
                field: "FMLY_NM",
                title: "Family"
            },
            {
                field: "PRCSSR_NBR",
                title: "Processor Number"
            },
            {
                field: "DEAL_PRD_NM",
                title: "Name"
            },
            {
                field: "MTRL_ID",
                title: "Material Id"
            },
            {
                field: "PRD_STRT_DTM",
                title: "Start Date"
            },
            {
                field: "PRD_END_DTM",
                title: "End Date"
            },
            {
                field: "ACTV_IND",
                title: "Is Active"
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.grid.select();
            //As we need read only grids., disabling the edit and delete buttons
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.grid.addRow();
        }
        function updateItem() {
            $scope.grid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.grid.removeRow(vm.selectedItem);
        }
    }
})();