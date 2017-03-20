/// <reference path="workflow.service.js" />
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('WorkflowController', WorkflowController);

    WorkflowController.$inject = ['$scope', 'dataService', 'workflowService', 'logger', 'confirmationModal', 'gridConstants'];

    function WorkflowController($scope, dataService, workflowService, logger, confirmationModal, gridConstants) {
        var wrokFlowAttibutes = '';
        var vm = this;
        vm.selectedItem = null;
        vm.filters = {};

        // Master DropDown List populate method
        var loadDDLValues = function (e) {
            workflowService.GetDropDownValues()
                .then(
                    function (response) {
                        if (response.statusText == "OK") {
                            wrokFlowAttibutes = response.data;
                        }
                    },
                    function (response) {
                        logger.error("Unable to get Workflow.", response, response.statusText);
                    }
                );
        };

        // declare dataSource bound to backend
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    workflowService.GetWorkFlowItems()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Workflow.", response, response.statusText);
                        });

                },
                update: function (e) {
                    workflowService.UpdateWorkflow(e.data)
                    .then(function (response) {
                        e.success(response.data);
                        logger.success("Workflow updated.");
                    }, function (response) {
                        logger.error("Unable to update Workflow.", response, response.statusText);
                    });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete WorkFlow',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this WorkFlow?'
                    };

                    confirmationModal.showModal({}, modalOptions)
                        .then(
                            function (result) {
                                $scope.workflowGrid.removeRow(vm.selectedItem);
                                workflowService.DeleteWorkflow(e.data)
                                .then(
                                    function (response) {
                                        e.success(response.data);
                                        logger.success("Workflow Deleted.");
                                    },
                                    function (response) {
                                        $scope.workflowGrid.cancelChanges();
                                    });
                            },
                            function (response) {
                                $scope.workflowGrid.cancelChanges();
                            });
                },
                create: function (e) {
                    workflowService.SetWorkFlows(e.data)
                        .then(function (response) {                            
                            e.success(response.data[0]);                            
                            logger.success("New Workflow added.");
                        }, function (response) {
                            logger.error("Unable to insert Workflow.", response, response.statusText);
                        });
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "WF_SID",
                    fields: {
                        WF_SID: {
                            editable: false, nullable: true
                        },
                        WF_NM: { validation: { required: true } },
                        ROLE_TIER_NM: { validation: { required: true } },
                        OBJ_TYPE: { validation: { required: true } },
                        OBJ_TYPE_SID: { validation: { required: false } },
                        OBJ_SET_TYPE_CD: { validation: { required: false } },
                        OBJ_SET_TYPE_SID: { validation: { required: false } },
                        WFSTG_ACTN_NM: { validation: { required: true } },
                        WFSTG_ACTN_SID: { validation: { required: true } },
                        WFSTG_CD_SRC: { validation: { required: true } },
                        WFSTG_MBR_SID: { validation: { required: true } },
                        WFSTG_CD_DEST: { validation: { required: true } },
                        WFSTG_DEST_MBR_SID: { validation: { required: true } },
                        TRKR_NBR_UPD: { type: "boolean" },
                        "_behaviors": { type: "object" }
                    }
                }
            },
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
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            edit: function (e) {
                var OBJ_TYPE = e.model["OBJ_TYPE"];
                if (OBJ_TYPE.toUpperCase() == 'CONTRACT' || OBJ_TYPE.toUpperCase() == 'PRICING STRATEGY' || OBJ_TYPE.toUpperCase() == 'PRICING TABLES') {
                    $("#dealTypeCDDropDownEditor").kendoDropDownList({
                        enable: false,

                    });
                }
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
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
              { field: "WF_SID", title: "Id", width: "6%" },
              { field: "WF_NM", title: "WF Name", width: "10%" },
              { field: "ROLE_TIER_NM", title: "Role Tier", width: "10%", editor: roleTierCDDropDownEditor },
              { field: "OBJ_TYPE_SID", template: " #= OBJ_TYPE # ", title: "Obj Type", width: "13%", editor: objTypeCDDropDownEditor },
              { field: "OBJ_SET_TYPE_SID", template: " #= OBJ_SET_TYPE_CD # ", title: "Object Set Type", width: "10%", editor: dealTypeCDDropDownEditor },
              { field: "WFSTG_ACTN_SID", template: " #= WFSTG_ACTN_NM # ", title: "Action", width: "10%", editor: actionCDDropDownEditor },
              { field: "WFSTG_MBR_SID", template: " #= WFSTG_CD_SRC # ", title: "Begin Stage", width: "11%", editor: srcCDDropDownEditor },
              { field: "WFSTG_DEST_MBR_SID", template: " #= WFSTG_CD_DEST # ", title: "End Stage", width: "11%", editor: destCDDropDownEditor },
              { field: "TRKR_NBR_UPD", title: "Update Tracker", width: "11%", template: gridUtils.boolViewer('TRKR_NBR_UPD'), editor: gridUtils.boolEditor, attributes: { style: "text-align: center;" } }
            ]
        };

        // Populate Role Tier DropDown
        function roleTierCDDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Role Tier",
                    autoBind: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource:
                        {
                            data: wrokFlowAttibutes,
                            filter: [
                                    { field: "COL_NM", operator: "eq", value: "ROLE_TIER_NM" }
                            ]
                        }
                });
        }

        // Populate Obj Type DropDown
        function objTypeCDDropDownEditor(container, options) {
            $('<input id ="objTypeCDDropDownEditor" required name="' + options.field + '" />')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Obj Type",
                    autoBind: true,
                    valuePrimitive: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource:
                        {
                            data: wrokFlowAttibutes,
                            filter: [
                                    { field: "COL_NM", operator: "eq", value: "OBJ_TYPE" }
                            ]
                        },
                    change: function (e) {
                        var valueText = this.text();
                        if (valueText.toUpperCase() == 'CONTRACT' || valueText.toUpperCase() == 'PRICING STRATEGY' || valueText.toUpperCase() == 'PRICING TABLES') {
                            $("#dealTypeCDDropDownEditor").kendoDropDownList({
                                enable: false,
                            });
                            var dealTypeCDDropDownEditor = $("#dealTypeCDDropDownEditor").data("kendoDropDownList");
                            dealTypeCDDropDownEditor.select(1);
                        }
                        else {
                            var dealTypeCDDropDownEditor = $("#dealTypeCDDropDownEditor").data("kendoDropDownList");
                            dealTypeCDDropDownEditor.enable(true);

                            $("#dealTypeCDDropDownEditor").kendoDropDownList({
                                dataSource: {
                                    data: wrokFlowAttibutes,
                                    filter: [
                                            { field: "COL_NM", operator: "eq", value: "OBJ_SET_TYPE_CD" }
                                    ]
                                },
                                dataTextField: "Value",
                                dataValueField: "Key",
                                optionLabel: "Select Deal Type"
                            });
                            var dropdownlist = $("#dropdownlist").data("kendoDropDownList");
                        }
                    }
                });
        }

        // Populate Deal Type DropDown
        function dealTypeCDDropDownEditor(container, options) {
            $('<input id="dealTypeCDDropDownEditor" name="' + options.field + '" />')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Deal Type",
                    autoBind: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource:
                        {
                            data: wrokFlowAttibutes,
                            filter: [
                                    { field: "COL_NM", operator: "eq", value: "OBJ_SET_TYPE_CD" }
                            ]
                        }

                });
        }

        // Populate Action Type DropDown
        function actionCDDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Action",
                    autoBind: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "COL_NM", operator: "eq", value: "WFSTG_ACTN_NM" }
                        ]
                    }
                });
        }

        // Populate SRC DropDown
        function srcCDDropDownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Source",
                    autoBind: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "COL_NM", operator: "eq", value: "WFSTG_CD_SRC_DEST" }
                        ]
                    }
                });
        }

        // Populate DEST DropDown
        function destCDDropDownEditor(container, options) {
            $('<input id="destCDDropDownEditor" required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Destination",
                    autoBind: true,
                    dataTextField: "Value",
                    dataValueField: "Key",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "COL_NM", operator: "eq", value: "WFSTG_CD_SRC_DEST" }
                        ]
                    }
                });
        }

        // Fetching all the Master Dropdown Values
        loadDDLValues();
    }
})();