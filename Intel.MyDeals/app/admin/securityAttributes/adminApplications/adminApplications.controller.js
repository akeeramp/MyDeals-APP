(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('applicationsController', applicationsController)

    applicationsController.$inject = ['$uibModal', 'ApplicationsService', '$scope', 'logger', 'gridConstants', 'confirmationModal']

    function applicationsController($uibModal, ApplicationsService, $scope, logger, gridConstants, confirmationModal) {
        var vm = this;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    ApplicationsService.getApplications()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Applications Suites", response, response.statusText);
                        });
                },
                update: function (e) {
                    ApplicationsService.updateApplication(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update Application Suite.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Application',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Application Suite ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                    	ApplicationsService.deleteApplication(e.data.models[0].APP_SID).then(function (response) {
                            e.success(response.data);
                            logger.success("Delete successful.");
                        }, function (response) {
                            logger.error("Unable to delete Application Suite", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                    });
                },
                create: function (e) {
                    ApplicationsService.insertApplication(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('New application added');
                        }, function (response) {
                            logger.error("Unable to insert Application Suite.", response, response.statusText);
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
                        APP_NM: { validation: { required: true } },
                        APP_DESC: { validation: { required: true } },
                        APP_SUITE: { validation: { required: true } },
                        ACTV_IND: { type: "boolean" }
                    }
                }
            }
        });

        vm.mainGridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            destroy: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-delete" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            cancel: function (e) {
                vm.validationMessage = '';
            },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                        { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                    ],
                    title: " ",
                    width: "6%",
                    attributes: { style: "text-align: center;" }
                },
            {
                field: "APP_SID",
                title: "ID",
                hidden: true
            }, {
                field: "ACTV_IND",
                title: "Active",
                width: 120,
                template: gridUtils.boolViewer('ACTV_IND'),
                editor: gridUtils.boolEditor,
                attributes: { style: "text-align: center;" }
            }, {
                field: "APP_NM",
                title: "Name",
                filterable: { multi: true, search: true }
            }, {
                field: "APP_DESC",
                title: "Description",
                filterable: { multi: true, search: true }
            }, {
                field: "APP_SUITE",
                title: "Suite",
                filterable: { multi: true, search: true }
            }]
        }

        function cancelChanges() {
            $scope.applicationsGrid.cancelChanges();
        }
    }
})();