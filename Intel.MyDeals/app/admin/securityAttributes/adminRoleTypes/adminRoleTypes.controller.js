(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('roleTypesController', roleTypesController)

    roleTypesController.$inject = ['$uibModal', 'RoleTypesService', '$scope', 'logger','gridConstants', 'confirmationModal']

    function roleTypesController($uibModal, RoleTypesService, $scope, logger, gridConstants, confirmationModal) {
        var vm = this;

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
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Role Type ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        RoleTypesService.deleteRoleType(e.data.models[0].ROLE_TYPE_SID).then(function (response) {
                            $scope.grid.removeRow();
                            e.success(response.data);
                            logger.success("Delete successful.");
                        }, function (response) {
                            logger.error("Unable to delete Role Type.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
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
                    width: "6%",
                    attributes: { style: "text-align: center;" }
                },
            {
                field: "ROLE_TYPE_SID",
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
                field: "IS_SNGL_SLCT",
                title: "Single Select",
                width: 150,
                template: gridUtils.boolViewer('IS_SNGL_SLCT'),
                editor: gridUtils.boolEditor,
                attributes: { style: "text-align: center;" }
            }, {
                field: "APP_SID",
                title: "Application ID",
                filterable: { multi: true, search: true }
            }, {
                field: "ROLE_TYPE_CD",
                title: "Name",
                filterable: { multi: true, search: true }
            }, {
                field: "ROLE_TYPE_DSPLY_CD",
                title: "Display Name",
                filterable: { multi: true, search: true }
            }, {
                field: "ROLE_TYPE_DESC",
                title: "Description",
                filterable: { multi: true, search: true }
            }, {
                field: "ROLE_TIER_CD",
                title: "Tier",
                filterable: { multi: true, search: true }
            }]
        }

        function cancelChanges() {
            $scope.roleTypesGrid.cancelChanges();
        }
    }
})();