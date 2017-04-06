(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ConstantsController', ConstantsController);

    ConstantsController.$inject = ['$scope', 'dataService', 'constantsService', 'logger', 'gridConstants', 'confirmationModal', '$rootScope'];

    function ConstantsController($scope, dataService, constantsService, logger, gridConstants, confirmationModal, $rootScope) {
        var vm = this;

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
                            updateBannerMessage(e.data);
                            logger.success("Constant updated.");
                        }, function (response) {
                            logger.error("Unable to update constant.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Constant',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Constant ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        constantsService.deleteConstants(e.data).then(function (response) {
                            $scope.constantsGrid.removeRow();
                            e.success(response.data);
                            logger.success("Constant Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete constant.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                    });
                },
                create: function (e) {
                    constantsService.insertConstants(e.data)
                        .then(function (response) {
                            updateBannerMessage(e.data);
                            e.success(response.data);
                            logger.success("New constant added.");
                        }, function (response) {
                            logger.error("Unable to insert constant.", response, response.statusText);
                        });
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "CNST_SID",
                    fields: {
                        CNST_SID: { editable: false, nullable: true },
                        CNST_NM: { validation: { required: true } },
                        CNST_DESC: { validation: { required: true } },
                        CNST_VAL_TXT: { validation: { required: true } },
                        UI_UPD_FLG: { type: "boolean" },
                    }
                }
            },
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: { mode: "inline", confirmation: false },
            dataBound: dataBound,
            edit: function (e) {
                if (e.model.isNew() == false) {
                    // Don't even show the input field, put the parent html values
                    $(e.container).find('input[name="CNST_NM"]').parent().html(e.model.CNST_NM)
                }
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
                    width: "7%"
                },
              { field: "CNST_SID", title: "Id", width: "5%", hidden: true },
              { field: "CNST_NM", title: "Name", width: "15%", filterable: { multi: true, search: true } },
              { field: "CNST_DESC", title: "Description", filterable: { multi: true, search: true } },
              { field: "CNST_VAL_TXT", title: "Value", filterable: { multi: true, search: true } },
              {
                  field: "UI_UPD_FLG",
                  title: "UI Updatable",
                  width: "10%",
                  template: gridUtils.boolViewer('UI_UPD_FLG'),
                  editor: gridUtils.boolEditor,
                  attributes: { style: "text-align: center;" }
              }
            ]
        };

        function cancelChanges() {
            $scope.constantsGrid.cancelChanges();
        }

        function dataBound() {
            var grid = this;
            var model;

            // Do not show edit/delete button for the rows where UI_UPD_FLG is false
            grid.tbody.find("tr[role='row']").each(function () {
                model = grid.dataItem(this);
                if (model.UI_UPD_FLG !== true) {
                    $(this).find(".k-grid-edit").remove();
                    $(this).find(".k-grid-delete").remove();
                }
            });
        }

        function updateBannerMessage(constant) {
            if (constant.CNST_NM == 'ADMIN_MESSAGE') {
                $rootScope.adminBannerMessage = constant.CNST_VAL_TXT == 'NA'
                                ? "" : constant.CNST_VAL_TXT;
            }
        }
    }
})();