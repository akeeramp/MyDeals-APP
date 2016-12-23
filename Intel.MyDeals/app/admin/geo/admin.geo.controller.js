(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('GeoController', GeoController)

    GeoController.$inject = ['$uibModal', 'geoService', '$scope', 'logger']

    function GeoController($uibModal, geoService, $scope, logger) {
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
                    geoService.getGeos()
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
                    id: "GEO_MBR_SID",
                    fields: {
                        GEO_NM: { editable: false, nullable: true },
                        RGN_NM: { validation: { required: true } },
                        CTRY_NM: { validation: { required: true } },
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
                 field: "GEO_MBR_SID",
                 title: "Id",
             },
            {
                field: "GEO_NM",
                title: "Name",
            },
            {
                field: "RGN_NM",
                title: "Region"
            },
            {
                field: "CTRY_NM",
                title: "Category"
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