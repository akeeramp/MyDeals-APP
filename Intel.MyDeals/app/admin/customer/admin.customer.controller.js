(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('CustomerController', CustomerController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    CustomerController.$inject = ['customerService', '$scope', 'logger', 'gridConstants']

    function CustomerController(customerService, $scope, logger, gridConstants) {
        var vm = this;
        //Developer can see the Screen..
        //Added By Bhuvaneswari for US932213
        if (!isCustomerAdmin && window.usrRole != 'SA' && !window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
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
            pageSize: 25,
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
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            editable: "popup",
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            change: vm.onChange,
            toolbar: gridUtils.clearAllFiltersToolbar(),
            columns: [
            {
                 field: "CUST_MBR_SID",
                 title: "Customer Name",
                 hidden: true
            },
            {
                field: "CUST_NM",
                title: "Customer Name"
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
                title: "Is Active",
                width: "10%",
                template: gridUtils.boolViewer('ACTV_IND'),
                attributes: { style: "text-align: center;" }
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