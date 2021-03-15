(function() {
    'use strict';

    angular
        .module('app.admin')
        .controller('dealTypesController', dealTypesController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    dealTypesController.$inject = ['$uibModal', 'DealTypesService', '$scope', 'logger', 'gridConstants', 'confirmationModal']

    function dealTypesController($uibModal, DealTypesService, $scope, logger, gridConstants, confirmationModal) {
        var vm = this;
        //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    DealTypesService.getDealTypes()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get deal types.", response, response.statusText);
                        });
                },
                update: function (e) {
                    DealTypesService.updateDealType(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update role type.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Deal Type ?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        DealTypesService.deleteDealType(e.data.models[0].OBJ_SET_TYPE_SID).then(function (response) {
                            e.success(response.data);
                            logger.success("Delete successful.");
                        }, function (response) {
                            logger.error("Unable to delete Deal Type.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                    });
                },
                create: function (e) {
                    DealTypesService.insertDealType(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('New Deal Type added');
                        }, function (response) {
                            logger.error("Unable to insert Application.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "OBJ_SET_TYPE_SID",
                    fields: {
                        OBJ_SET_TYPE_SID: { editable: false, nullable: true },
                        DEAL_ATRB_SID: { type: "number" , validation: { required: true } },
                        DEAL_TYPE_CD: { validation: { required: true } },
                        DEAL_TYPE_DESC: { validation: { required: true } },
                        TEMPLT_DEAL_SID: {},
                        TEMPLT_DEAL_NBR: { type: "number", validation: { format:"{0:n0}", decimals:0 } },
                        TRKR_NBR_DT_LTR: {},
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
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
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
                field: "OBJ_SET_TYPE_SID",
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
                field: "OBJ_ATRB_SID",
                title: "Obj ATRB ID",
                filterable: { multi: true, search: true }
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Name",
                filterable: { multi: true, search: true }
            }, {
                field: "OBJ_SET_TYPE_DESC",
                title: "Description",
                filterable: { multi: true, search: true }
            }, {
                field: "TEMPLT_DEAL_SID",
                title: "Template Deal ID",
                filterable: { multi: true, search: true }
            }, {
                field: "TEMPLT_DEAL_NBR",
                title: "Template Deal Number",
                filterable: { multi: true, search: true }
            }, {
                field: "TRKR_NBR_DT_LTR",
                title: "TRKR_NBR_DT_LTR",
                filterable: { multi: true, search: true }
            }]
        }

        function cancelChanges() {
            $scope.dealTypesGrid.cancelChanges();
        }
    }
})();