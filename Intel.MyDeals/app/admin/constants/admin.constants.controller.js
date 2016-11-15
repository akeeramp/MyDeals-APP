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
                        .then(function (data) {
                            e.success(data);
                        });
                },
                update: function (e) {
                    constantsService.updateConstants(e.data)
                        .then(function (data) {
                            e.success(data);
                        });
                },
                destroy: function (e) {
                    constantsService.deleteConstants(e.data)
                        .then(function (data) {
                            e.success(data);
                        });
                },
                create: function (e) {
                    constantsService.insertConstants(e.data)
                        .then(function (data) {
                            e.success(data);
                        });
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "cnst_sid",
                    fields: {
                        cnst_sid: { editable: false, nullable: true },
                        cnst_nm: { validation: { required: true } },
                        cnst_desc: { validation: { required: true } },
                        cnst_val_txt: { validation: { required: true } },
                        ui_updatable: { validation: { required: true }, },
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
              { field: "cnst_sid", title: "Id" },
              { field: "cnst_nm", title: "Name" },
              { field: "cnst_desc", title: "Description" },
              { field: "cnst_val_txt", title: "Value" },
              { field: "ui_updatable", title: "UI Updatable" },
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