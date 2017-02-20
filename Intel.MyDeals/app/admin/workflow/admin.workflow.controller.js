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
                    var isValid = true;

                    for (var i = 0; i < e.data.length; i++) {
                        if (!isModelValid(e.data[i])) {
                            isValid = false;
                        }
                    }
                    if (isValid) {
                        workflowService.UpdateWorkflow(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Workflow updated.");
                        }, function (response) {
                            logger.error("Unable to update Workflow.", response, response.statusText);
                        });
                    }
                    else {
                        var modalOptions = {
                            closeButtonText: 'Okay',
                            hasActionButton: false,
                            headerText: 'Error',
                            bodyText: 'Unable to update Workflow. Please check your input and try again.'
                        };
                        confirmationModal.showModal({}, modalOptions);
                    }
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
                            e.success(response.data);
                            $(".k-i-reload").trigger('click'); // Refresh the grid to get the Auto Increment ID from DB
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
                        WF_NAME: { validation: { required: true } },
                        ROLE_TIER_NM: { validation: { required: true } },
                        OBJ_TYPE: { validation: { required: true } },
                        OBJ_TYPE_SID: { validation: { required: false } },
                        DEAL_TYPE_CD: { validation: { required: false } },
                        DEAL_TYPE_SID: { validation: { required: false } },
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
            toolbar: ["create"],
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
            destroy: function (e) {
                deleteItem();
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
              { field: "WF_SID", title: "Id", width: "8%" },
              { field: "WF_NAME", title: "WF Name", width: "10%" },
              { field: "ROLE_TIER_NM", title: "Role Tier", width: "10%", editor: roleTierCDDropDownEditor },
              { field: "OBJ_TYPE_SID", template: " #= OBJ_TYPE # ", title: "Obj Type", width: "12%", editor: objTypeCDDropDownEditor },
              { field: "DEAL_TYPE_SID", template: " #= DEAL_TYPE_CD # ", title: "Deal Type", width: "10%", editor: dealTypeCDDropDownEditor },
              { field: "WFSTG_ACTN_SID", template: " #= WFSTG_ACTN_NM # ", title: "Action", width: "10%", editor: actionCDDropDownEditor },
              { field: "WFSTG_MBR_SID", template: " #= WFSTG_CD_SRC # ", title: "Begin Stage", width: "10%", editor: srcCDDropDownEditor },
              { field: "WFSTG_DEST_MBR_SID", template: " #= WFSTG_CD_DEST # ", title: "End Stage", width: "10%", editor: destCDDropDownEditor },
              { field: "TRKR_NBR_UPD", title: "Update Tracker", width: "12%", template: "<div><span ng-if='! #= TRKR_NBR_UPD # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= TRKR_NBR_UPD # ' class='icon-md intelicon-filled-box'></span></div>" },
            ]
        };

        function isModelValid(dataItem) {
            var isValid = true;
            if (dataItem['WF_NAME'] == "") {
                flagBehavior(dataItem, "isError", "WF_NAME", true);
                isValid = false;
            } else {
                flagBehavior(dataItem, "isError", "WF_NAME", false);
            }

            return isValid;
        }

        // Updates the model with the correct _behavior flag
        function flagBehavior(dataItem, $event, field, isTrue) {
            if (dataItem._behaviors === undefined) {
                dataItem._behaviors = {};
            }
            if (dataItem._behaviors['isError'] === undefined) {
                dataItem._behaviors['isError'] = {};
            }
            dataItem._behaviors["isError"][field] = isTrue;
        }

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
                                            { field: "COL_NM", operator: "eq", value: "DEAL_TYPE_CD" }
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
            $('<input id="dealTypeCDDropDownEditor" required name="' + options.field + '" />')
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
                                    { field: "COL_NM", operator: "eq", value: "DEAL_TYPE_CD" }
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