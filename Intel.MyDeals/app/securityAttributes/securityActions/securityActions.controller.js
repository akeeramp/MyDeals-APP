(function() {
    'use strict';
    angular
        .module('app.securityAttributes')
        .controller('securityActionsController',securityActionsController)

    securityActionsController.$inject = ['$uibModal', 'SecurityActionsService', '$scope', 'logger'];

    function securityActionsController($uibModal, SecurityActionsService, $scope, logger) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;
        vm.toolBarTemplate = $("#toolBarTemplate").html();

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    SecurityActionsService.getActions()
                         .then(function (response) {
                             e.success(response.data);
                         }, function (response) {
                             logger.error("Unable to get Security Actions.", response, response.statusText);
                         });
                },
                update: function (e) {
                    SecurityActionsService.updateAction(e.data.models[0])
                        .then(function (data) {
                            e.success(data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update Security Actions.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    SecurityActionsService.deleteAction(e.data.models[0].ACTN_SID)
                        .then(function (data) {
                            e.success(data);
                            logger.success('Delete successful.');
                        }, function (response) {
                            logger.error("Unable to delete Security Actions.", response, response.statusText);
                        });
                },
                create: function (e) {
                    SecurityActionsService.insertAction(e.data.models[0])
                        .then(function (data) {
                            e.success(data);
                            logger.success('New Security Actions added');
                        }, function (response) {
                            logger.error("Unable to insert Security Actions.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "ACTN_SID",
                    fields: {
                        ACTN_SID: { editable: false, nullable: true },
                        ACTN_CD: { validation: { required: true } },
                        ACTN_DESC: { validation: { required: true } },
                        ACTN_CAT_CD: { validation: { required: true } },
                        WFSTG_ACTN_CD: {}
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
            toolbar: vm.toolBarTemplate,
            //toolbar: [
            //	"create",
            //	{ name: "customEdit", text: "Edit", imageClass: "k-edit", className: "k-custom-edit btn btn-primary", iconClass: "k-icon" },
            //	{ name: "customDelete", text: "Delete", imageClass: "k-delete", className: "k-custom-delete btn btn-default", iconClass: "k-icon" }
            //],
            columns: [
            {
                field: "ACTN_SID",
                title: "ID",
            }, {
                field: "ACTN_CD",
                title: "Name"
            }, {
                field: "ACTN_DESC",
                title: "Description"
            }, {
                field: "ACTN_CAT_CD",
                title: "Category"
            }, {
                field: "WFSTG_ACTN_CD",
                title: "Stage"
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.actionsGrid.select();
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.actionsGrid.addRow();
        }
        function updateItem() {
            $scope.actionsGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.actionsGrid.removeRow(vm.selectedItem);
        }

    }
})();