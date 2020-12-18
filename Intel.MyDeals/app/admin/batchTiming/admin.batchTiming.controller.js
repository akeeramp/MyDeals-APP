(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('batchTimingController', batchTimingController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    batchTimingController.$inject = ['$uibModal', 'batchTimingService', '$scope', 'logger', 'gridConstants'];

    function batchTimingController($uibModal, batchTimingService, $scope, logger, gridConstants) {
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
                    batchTimingService.getBatchJobTiming('BTCH_JOB_DTL')
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Batch Job Time.", response, response.statusText);
                        });
                },
            },
            batch: true,
            pageSize: 25,
            schema: {
                model: {
                    //id: "BTCH_JOB_NM",
                    fields: {
                        BTCH_TYPE: { type: "string" },
                        BTCH_JOB_NM: { type: "string" },
                        BTCH_JOB_SCH_TM: { type: "string" },
                        BTCH_JOB_STS: { type: "string" },
                        BTCH_JOB_EXEC_DTM: { type: "string" },
                        ERR_MSG: {type: "string"}
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
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.clearAllFiltersToolbar(),
            editable: "popup",
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: vm.onChange,
            columns: [
                {
                    field: "BTCH_TYPE",
                    title: "Batch Type",
                    width: 170
                   
                },
                {
                    field: "BTCH_JOB_NM",
                    title: "Batch Job Name ",
                    width: 170
                },
                {
                    field: "BTCH_JOB_SCH_TM",
                    title: "Batch Job Schedule Time (in PST)",
                     width: 300
                },
                {
                    field: "BTCH_JOB_STS",
                    title: "Batch Job Status",
                    width: 170
                },
                {
                    field: "BTCH_JOB_EXEC_DTM",
                    title: "Batch Job Last Execution Date",
                    width: 200                  
                    
                },{
                    field: "ERR_MSG",
                    title: "Error Message",
                     width: 200
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