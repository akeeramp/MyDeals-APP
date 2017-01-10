(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('roleTypesController', roleTypesController)

    roleTypesController.$inject = ['$uibModal', 'RoleTypesService', '$scope', 'logger']

    function roleTypesController($uibModal, RoleTypesService, $scope, logger) {
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
                    RoleTypesService.getRoleTypes()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get role types.", response, response.statusText);
                        });
                },
                update: function (e) {
                    RoleTypesService.updateRoleType(e.data.models[0])
                         .then(function (response) {
                         	e.success(response.data);
                             logger.success('Update successful.');
                         }, function (response) {
                             logger.error("Unable to update Role Type.", response, response.statusText);
                         });
                },
                destroy: function (e) {
                    RoleTypesService.deleteRoleType(e.data.models[0].ROLE_TYPE_SID)
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Delete successful.');
                        }, function (response) {
                            logger.error("Unable to delete Role Type", response, response.statusText);
                        });
                },
                create: function (e) {
                    RoleTypesService.insertRoleType(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('New Role Type added');
                        }, function (response) {
                            logger.error("Unable to insert Role Type.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "ROLE_TYPE_SID",
                    fields: {
                        ROLE_TYPE_SID: { editable: false, nullable: true },
                        APP_SID: { type: "number", validation: { format: "{0:n0}", decimals: 0, required: true } },
                        ROLE_TYPE_CD: { validation: { required: true } },
                        ROLE_TYPE_DSPLY_CD: { validation: { required: true } },
                        ROLE_TYPE_DESC: { validation: { required: true } },
                        ROLE_TIER_CD: { validation: { required: true } },
                        IS_SNGL_SLCT: { type: "boolean" },
                        ACTV_IND: { type: "boolean" }
                    }
                }
            }
        });

        vm.mainGridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            selectable: true,
            pageable: true,
            editable: "popup",
            change: vm.onChange,
            //toolbar: [
            //	"create",
            //	{ name: "customEdit", text: "Edit", imageClass: "k-edit", className: "k-custom-edit btn btn-primary", iconClass: "k-icon" },
            //	{ name: "customDelete", text: "Delete", imageClass: "k-delete", className: "k-custom-delete btn btn-default", iconClass: "k-icon" }
            //],
            columns: [
            {
                field: "ROLE_TYPE_SID",
                title: "ID",
            }, {
                field: "APP_SID",
                title: "Application ID"
            }, {
                field: "ROLE_TYPE_CD",
                title: "Name"
            }, {
                field: "ROLE_TYPE_DSPLY_CD",
                title: "Display Name"
            }, {
                field: "ROLE_TYPE_DESC",
                title: "Description"
            }, {
                field: "ROLE_TIER_CD",
                title: "Tier"
            }, {
                field: "IS_SNGL_SLCT",
                title: "Single Select"
            }, {
                field: "ACTV_IND",
                title: "Active"
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.roleTypesGrid.select();
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.roleTypesGrid.addRow();
        }
        function updateItem() {
            $scope.roleTypesGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.roleTypesGrid.removeRow(vm.selectedItem);
        }

    }
})();