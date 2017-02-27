(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('securityActionsController',securityActionsController)

    securityActionsController.$inject = ['$uibModal', 'SecurityActionsService', '$scope', 'logger', 'gridConstants', 'confirmationModal']

    function securityActionsController($uibModal, SecurityActionsService, $scope, logger, gridConstants, confirmationModal) {
        var vm = this;

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
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update Security Actions.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Security Action ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        SecurityActionsService.deleteAction(e.data.models[0].ACTN_SID).then(function (response) {
                            $scope.grid.removeRow();
                            e.success(response.data);
                            logger.success("Delete successful.");
                        }, function (response) {
                            logger.error("Unable to delete Security Action.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                    });
                },
                create: function (e) {
                    SecurityActionsService.insertAction(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
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
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
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
                    width: "6%"
                },
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

        function cancelChanges() {
            $scope.actionsGrid.cancelChanges();
        }
    }
})();