(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('applicationsController', applicationsController)

    applicationsController.$inject = ['$uibModal', 'ApplicationsService', '$scope','logger']

    function applicationsController($uibModal, ApplicationsService, $scope, logger) {
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
                    ApplicationsService.getApplications()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get applications.", response, response.statusText);
                        });
                },
                update: function (e) {
                    ApplicationsService.updateApplication(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update Application.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    ApplicationsService.deleteApplication(e.data.models[0].APPL_SID)
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Delete successful.');
                        }, function (response) {
                            logger.error("Unable to delete Application", response, response.statusText);
                        });
                },
                create: function (e) {
                    ApplicationsService.insertApplication(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('New application added');
                        }, function (response) {
                            logger.error("Unable to insert Application.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "APP_SID",
                    fields: {
                        APP_SID: { editable: false, nullable: true },
                        APP_CD: { validation: { required: true } },
                        APP_DESC: { validation: { required: true } },
                        APP_SUITE: { validation: { required: true } },
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
                field: "APP_SID",
                title: "ID",
            }, {
                field: "APP_CD",
                title: "Name"
            }, {
                field: "APP_DESC",
                title: "Description"
            }, {
                field: "APP_SUITE",
                title: "Suite"
            }, {
                field: "ACTV_IND",
                title: "Active",
                template: gridUtils.boolViewer('ACTV_IND'),
                editor: gridUtils.boolEditor
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.applicationsGrid.select();
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.applicationsGrid.addRow();
        }
        function updateItem() {
            $scope.applicationsGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.applicationsGrid.removeRow(vm.selectedItem);
        }
    }
})();