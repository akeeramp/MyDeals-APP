(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductController', ProductController)

    ProductController.$inject = ['productService', '$scope', 'logger', 'gridConstants']

    function ProductController(productService, $scope, logger, gridConstants) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem;
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
                            logger.error("Unable to get Products.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 25,
            schema: {
                model: {
                    fields: {
                        PRD_STRT_DTM: { type: "date" },
                        PRD_END_DTM: { type: "date" }
                    }
                }
            }
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            editable: "popup",
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            change: vm.onChange,
            columns: [
            {
                field: "PRD_MBR_SID",
                title: "Id"
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
                title: "Brand"
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
                title: "Start Date",
                type: "date",
                format: "{0:MM-dd-yyyy}"
            },
            {
                field: "PRD_END_DTM",
                title: "End Date",
                format: "{0:MM-dd-yyyy}"
            },
            {
                field: "ACTV_IND",
                title: "Is Active",
                width: "10%",
                template: gridUtils.boolViewer('ACTV_IND')
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