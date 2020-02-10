(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexcustomermappingController', VistexcustomermappingController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];
    VistexcustomermappingController.$inject['vistexcustomermappingService', '$scope', 'logger', 'gridConstants']

    function VistexcustomermappingController(vistexcustomermappingService, $scope, logger, gridConstants) {

        var vm = this;

        // Functions
        //vm.addItem = addItem;
        //vm.updateItem = updateItem;
        //vm.deleteItem = deleteItem
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    vistexcustomermappingService.getVistexCustomersMapList()
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
                        VISTEX_CUST_FLAG: { type: "boolean" }
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
                    field: "VISTEX_CUST_FLAG",
                    title: "Is Vistex Customer",
                    width: "10%",
                    template: gridUtils.boolViewer('VISTEX_CUST_FLAG'),
                    attributes: { style: "text-align: center;" }
                }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.vistexcustomerGrid.select();
            // TODO: As we need read only grids, disabling the edit and delete buttons.
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }
    }
})();