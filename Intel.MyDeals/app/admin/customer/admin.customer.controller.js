(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('CustomerController', CustomerController)

    CustomerController.$inject = ['$uibModal', 'customerService', '$scope', 'logger']

    function CustomerController($uibModal, customerService, $scope, logger) {
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
                    customerService.getCustomers()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Customers.", response, response.statusText);
                        });
                },
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "CUST_MBR_SID",
                    fields: {
                        CUST_NM: { editable: false, nullable: true },
                        CUST_DIV_NM: { validation: { required: true } },
                        CUST_TYPE: { validation: { required: true } },
                        HOSTED_GEO: { validation: { required: true } },
                        ACTV_IND: { type: "boolean" }
                    }
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
                 field: "CUST_MBR_SID",
                 title: "Customer Name",
                 hidden: true,
            },
            {
                field: "CUST_NM",
                title: "Customer Name",
            },
            {
                field: "CUST_DIV_NM",
                title: "Division Name"
            },
            {
                field: "CUST_TYPE",
                title: "Type"
            },
            {
                field: "HOSTED_GEO",
                title: "Hosted Geo"
            },
            {
                field: "ACTV_IND",
                title: "Is Active"
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.customerGrid.select();
            // TODO: As we need read only grids, disabling the edit and delete buttons.
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.customerGrid.addRow();
        }
        function updateItem() {
            $scope.customerGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.customerGrid.removeRow(vm.selectedItem);
        }
    }
})();