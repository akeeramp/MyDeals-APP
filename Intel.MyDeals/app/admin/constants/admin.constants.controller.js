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
                        });
                },
                update: function (e) {
                    constantsService.updateConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
                        });
                },
                destroy: function (e) {
                    constantsService.deleteConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
                        });
                },
                create: function (e) {
                    constantsService.insertConstants(e.data)
                        .then(function (response) {
                            e.success(response.data);
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
                        UI_UPD_FLG: { validation: { required: true }, },
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
            $scope.constantsGrid.editRow(vm.selectedItem);
        }

        function deleteItem() {
            $scope.constantsGrid.removeRow(vm.selectedItem);
        }
    }
})();