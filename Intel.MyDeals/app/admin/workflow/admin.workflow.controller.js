/// <reference path="workflow.service.js" />
(function () {
	'use strict';

	angular
        .module('app.admin')
        .controller('WorkflowController', WorkflowController);

	WorkflowController.$inject = ['$scope', 'dataService', 'workflowService', 'logger', 'confirmationModal','gridConstants'];

	function WorkflowController($scope, dataService, workflowService, logger, confirmationModal, gridConstants) {
	    var wrokFlowAttibutes = '';
	    var vm = this;
	    vm.selectedItem = null;
	    vm.isButtonDisabled = true;
	    vm.onChange = onChange;
	    vm.deleteItem = deleteItem;
	    vm.updateItem = updateItem;
	    vm.addItem = addItem;

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
					workflowService.GetDropDownValues()
                                    .then(function (response) {
                                        e.success(wrokFlowAttibutes = response.data);
                                    }, function (response) {
                                        logger.error("Unable to get Workflow.", response, response.statusText);
                                    });	

				},
				update: function (e) {
				    // HACK: Do actual validation here rather than in kendo's custom validation because of the many
				    // bugs when using kendo custom validation with dependant columns 
				    var isValid = true;

				    // Check validation of all rows and update ui _behavior flags
				    for (var i = 0; i < e.data.length; i++) {
				        if (!isModelValid(e.data[i])) {
				            isValid = false;
				        }
				    }

				    if (isValid) {
				        // Save
				        workflowService.UpdateWorkflow(e.data)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Workflow updated.");
                        }, function (response) {
                            logger.error("Unable to update Workflow.", response, response.statusText);
                        });
				    }
				    else {
				        // Error confirmation dialog
				        var modalOptions = {
				            closeButtonText: 'Okay',
				            hasActionButton: false,
				            headerText: 'Error',
				            bodyText: 'Product Category Name and Deal Product Type are required when the Active Indicator is checked. Please check your input and try again.'
				        };
				        confirmationModal.showModal({}, modalOptions);

				    }

				    
				    
				},
				destroy: function (e) {
				    workflowService.DeleteWorkflow(e.data)
                        .then(function (response) {
                        	e.success(response.data);
                        	logger.success("Workflow Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete Workflow.", response, response.statusText);
                        });
				},
				create: function (e) {
				    workflowService.SetWorkFlows(e.data)
                        .then(function (response) {
                        	e.success(response.data);
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
						ROLE_TIER_CD: { validation: { required: true } },
						DEAL_TYPE_CD: { validation: { required: true } },
						WFSTG_ACTN_CD: { validation: { required: true } },
						WFSTG_CD_SRC: { validation: { required: true } },
						WFSTG_CD_DEST: { validation: { required: true } },
						TRKR_NBR_UPD : { type: "boolean"  },
					}
				}
			},
		});

		vm.gridOptions = {
		    dataSource: vm.dataSource,
		    filterable: true,
		    scrollable: true,
		    sortable: true,
		    pageable: {
		        refresh: true,
		        pageSizes: gridConstants.pageSizes
		    },
		    navigatable: true,
		    resizable: true,
		    reorderable: true,
		    columnMenu: true,
		    toolbar: ["create"],
		    editable: {mode: "inline", confirmation:false },
		    pageable: {
		        refresh: true,
		        pageSizes: gridConstants.pageSizes,
		    },
		    edit: function (e) {
		        var commandCell = e.container.find("td:first");
		        commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
		    },
		    destroy: function (e) {
		        deleteItem();
		    },
		    change: vm.onChange,
		    columns: [
              {
                  command: [
                      //define the commands here
                      { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                      { name: "destroy", template: "<a class='k-grid-delete' ng-click='vm.deleteItem()' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }

                  ],
                  title: " ",
                  width: "90px"
              },              
              { field: "WF_SID", title: "Id", width: "5%"},
              { field: "WF_NAME", title: "WF Name", width: "15%" },
              { field: "ROLE_TIER_CD", title: "Role Tier", width: "10%", editor: roleTierCDDropDownEditor },
              { field: "DEAL_TYPE_CD", title: "Deal Type", width: "10%", editor: dealTypeCDDropDownEditor },
              { field: "WFSTG_ACTN_CD", title: "Action", width: "15%", editor: actionCDDropDownEditor },
              { field: "WFSTG_CD_SRC", title: "Begin Stage", width: "15%", editor: srcCDDropDownEditor },
              { field: "WFSTG_CD_DEST", title: "End Stage", width: "15%", editor: destCDDropDownEditor },
              { field: "TRKR_NBR_UPD", title: "Update Tracker", width: "15%", template: "<div><span ng-if='! #= TRKR_NBR_UPD # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= TRKR_NBR_UPD # ' class='icon-md intelicon-filled-box'></span></div>" },
            ]
		};

		function isModelValid(dataItem) {
		    var isValid = true;
		    if (dataItem['WF_NAME'] == "") {
		        // Display custom validation message
		        flagBehavior(dataItem, "isError", "WF_NAME", true);
		        isValid = false;
		    } else {
		        // Hide flag in case it was invalid previously
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
        
		function roleTierCDDropDownEditor(container, options) {
		    $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Role Tier",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource:
                        {
                            data: wrokFlowAttibutes,
                            filter: [
                                    { field: "ColumnName", operator: "eq", value: "ROLE_TIER_CD" }

                            ]
                        }
                    
                        
                    
                });
		}
		function dealTypeCDDropDownEditor(container, options) {
		    $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Deal Type",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource:
                        {
                            data: wrokFlowAttibutes,
                            filter: [
                                    { field: "ColumnName", operator: "eq", value: "DEAL_TYPE_CD" }
                            ]
                        }
                });
		}
		function actionCDDropDownEditor(container, options) {
		    $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Action",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "ColumnName", operator: "eq", value: "WFSTG_ACTN_CD" }
                        ]
                    }
                });
		}
		function srcCDDropDownEditor(container, options) {
		    $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Source",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "ColumnName", operator: "eq", value: "WFSTG_CD_SRC_DEST" }
                        ]
                    }
                });
		}
		function destCDDropDownEditor(container, options) {
		    $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Destination",
                    autoBind: true,
                    dataTextField: "Key",
                    dataValueField: "Value",
                    dataSource: {
                        data: wrokFlowAttibutes,
                        filter: [
                                { field: "ColumnName", operator: "eq", value: "WFSTG_CD_SRC_DEST" }
                        ]
                    }
                });
		}
		function onChange() {
		    vm.selectedItem = $scope.workflowGrid.select();
			vm.isButtonDisabled = (vm.selectedItem.length == 0) ? true : false;
			$scope.$apply();
		}

		function addItem() {
			vm.isButtonDisabled = true;
			$scope.workflowGrid.addRow();
		}

		function updateItem() {
			var selectedDataItem = $scope.workflowGrid.dataItem(vm.selectedItem);
		    if (!selectedDataItem.WF_SID) {
				logger.warning(selectedDataItem.CNST_NM + " Cannot be updated from UI", null, "Not allowed")
				return;
			}
			$scope.workflowGrid.editRow(vm.selectedItem);
		}

		function deleteItem() {
		        var modalOptions = {
		        closeButtonText: 'Cancel',
		        actionButtonText: 'Delete WorkFlow',
		        hasActionButton: true,
		        headerText: 'Delete confirmation',
		        bodyText: 'Are you sure you would like to Delete this WorkFlow?'
		    };

		    confirmationModal.showModal({}, modalOptions)
				.then(function (result) {
				    $scope.workflowGrid.removeRow(vm.selectedItem);
				});
		}
		function cancelChanges() {
		    $scope.workflowGrid.cancelChanges();
		}

	}
})();