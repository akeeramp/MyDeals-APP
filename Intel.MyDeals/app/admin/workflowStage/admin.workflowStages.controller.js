/// <reference path="workflow.service.js" />
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('WorkflowStageController', WorkflowStageController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    WorkflowStageController.$inject = ['$scope', 'dataService', 'workflowStageService', 'logger', 'confirmationModal', 'gridConstants'];

    function WorkflowStageController($scope, dataService, workflowStagesService, logger, confirmationModal, gridConstants) {
        var vm = this;
        var WorkFlowStageAttribute = '';
        vm.selectedItem = null;

        // Master DropDown List populate method
        var loadDDLValues = function (e) {
            workflowStagesService.GetWFStgDDLValues()
                .then(
                    function (response) {
                        if (response.statusText == "OK") {
                            WorkFlowStageAttribute = response.data;
                        }
                    },
                    function (response) {
                        logger.error("Unable to get Workflow stages", response, response.statusText);
                    }
                );
        };

        // declare dataSource bound to backend
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    workflowStagesService.GetWorkFlowStages()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Workflow Stages.", response, response.statusText);
                        });
                },
                update: function (e) {
                    workflowStagesService.UpdateWorkflowStages(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Workflow Stage successfully updated.");
                        }, function (response) {
                            logger.error("Unable to update Workflow Stage.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete WorkFlow',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this WorkFlow Stage?'
                    };

                    confirmationModal.showModal({}, modalOptions)
                        .then(function (result) {
                            $scope.workflowGrid.removeRow(vm.selectedItem);
                            workflowStagesService.DeleteWorkflowStages(e.data)
                            .then(
                                function (response) {
                                    e.success(response.data);
                                    logger.success("Workflow Stage Deleted.");
                                },
                                function (response) {
                                    $scope.workflowGrid.cancelChanges();
                                }
                            );
                        }, function (response) {
                            $scope.workflowGrid.cancelChanges();
                        });
                },
                create: function (e) {
                    workflowStagesService.SetWorkflowStages(e.data)
                        .then(function (response) {
                            e.success(response.data[0]);                            
                            logger.success("New Workflow Stage successfully added.");
                        }, function (response) {
                            logger.error("Unable to insert Workflow Stage.", response, response.statusText);
                        });
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "WFSTG_MBR_SID",
                    fields: {
                        WFSTG_MBR_SID: { editable: false, nullable: true },
                        WFSTG_ATRB_SID: { validation: { required: true } },
                        WFSTG_NM: { validation: { required: true } },
                        WFSTG_DESC: { validation: { required: true } },
                        ROLE_TIER_NM: { validation: { required: true } },
                        WFSTG_LOC: { validation: { required: true } },
                        WFSTG_ORD: { type: "number", format: "#", decimals: 0, validation: { required: true, min: 1 } },
                        ALLW_REDEAL: { type: "boolean" },
                    }
                }
            }
        });

        vm.gridOptions = {
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
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
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
                        { name: "destroy", template: "<a class='k-grid-delete' ng-click='vm.deleteItem()' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                    ],
                    title: " ",
                    width: "6%"
                },
              { field: "WFSTG_MBR_SID", title: "Id", width: "7%" },
              { field: "WFSTG_NM", title: "Stage Code", width: "10%" },
              { field: "WFSTG_DESC", title: "Stage Description", width: "20%" },
              { field: "ROLE_TIER_NM", title: "Role Tier", width: "15%", editor: roleTierCDDropDownEditor, filterable: { multi: true, search: true } },
              { field: "WFSTG_LOC", title: "Location", width: "10%", editor: locationDropDownEditor, filterable: { multi: true, search: true } },
              { field: "WFSTG_ORD", title: "Order By", width: "10%", filterable: { multi: true, search: true } },
              { field: "ALLW_REDEAL", title: "Allow Redeal", width: "10%", template: gridUtils.boolViewer('ALLW_REDEAL'), editor: gridUtils.boolEditor, attributes: { style: "text-align: center;" } }
            ]
        };

        // Populate Role Tier
        function roleTierCDDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Role Tier",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource: {
                        data: WorkFlowStageAttribute,
                        filter: [{ field: "COL_NM", operator: "eq", value: "ROLE_TIER_NM" }]
                    }
                });
        }

        // Populate Location
        function locationDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Location",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource:
                        {
                            data: WorkFlowStageAttribute,
                            filter: [
                                    { field: "COL_NM", operator: "eq", value: "WFSTG_LOC" }
                            ]
                        }
                });
        }

        // Fetching all the Master Dropdown Values
        loadDDLValues();
    }
})();