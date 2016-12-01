(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ConstantsController', ConstantsController);

    ConstantsController.$inject = ['$scope', 'dataService', 'constantsService', 'logger', '$uibModal'];

    function ConstantsController($scope, dataService, constantsService, logger, $uibModal) {
        var vm = this;
        vm.selectedItem = null;
        vm.isButtonDisabled = true;
        vm.onChange = onChange;
        vm.deleteItem = deleteItem;
        vm.updateItem = updateItem;
        vm.addItem = addItem;

        // declare dataSource bound to backend
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    constantsService.getConstants()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get constants.", response, response.statusText);
                        });
                },
                update: function (e) {
                    constantsService.updateConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Constant updated.");
                        }, function (response) {
                            logger.error("Unable to update constant.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    constantsService.deleteConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Constant added.");
                        }, function (response) {
                            logger.error("Unable to delete constant.", response, response.statusText);
                        });
                },
                create: function (e) {
                    constantsService.insertConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("New constant added.");
                        }, function (response) {
                            logger.error("Unable to insert get constant.", response, response.statusText);
                        });
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "CNST_SID",
                    fields: {
                        CNST_SID: { editable: false, nullable: true },
                        CNST_NM: { validation: { required: true } },
                        CNST_DESC: { validation: { required: true } },
                        CNST_VAL_TXT: { validation: { required: true } },
                        UI_UPD_FLG: { type: "boolean"  },
                    }
                }
            },
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            selectable: true,
            pageable: true,
            editable: "popup",
            change: vm.onChange,
            columns: [
              { field: "CNST_SID", title: "Id" },
              { field: "CNST_NM", title: "Name" },
              { field: "CNST_DESC", title: "Description" },
              { field: "CNST_VAL_TXT", title: "Value" },
              { field: "UI_UPD_FLG", title: "UI Updatable" },
            ]
        };

        function onChange() {
            vm.selectedItem = $scope.constantsGrid.select();
            vm.isButtonDisabled = (vm.selectedItem.length == 0) ? true : false;
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.constantsGrid.addRow();
        }

        function updateItem() {
            //Do not allow user to update the constants from UI where UI_UPD_FLG is false
            var selectedDataItem = $scope.constantsGrid.dataItem(vm.selectedItem);
            if (!selectedDataItem.UI_UPD_FLG) {
                logger.warning(selectedDataItem.CNST_NM + " Cannot be updated from UI", null, "Not allowed")
                return;
            }
            $scope.constantsGrid.editRow(vm.selectedItem);
        }

        function deleteItem() {
            $scope.constantsGrid.removeRow(vm.selectedItem);
        }
    }
})();