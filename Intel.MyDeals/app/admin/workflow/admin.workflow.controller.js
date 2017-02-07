/// <reference path="workflow.service.js" />
(function () {
	'use strict';

	angular
        .module('app.admin')
        .controller('WorkflowController', WorkflowController);

	WorkflowController.$inject = ['$scope', 'dataService', 'workflowService', 'logger', 'confirmationModal','gridConstants'];

	function WorkflowController($scope, dataService, workflowService, logger, confirmationModal, gridConstants) {
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
						WF_SID: { editable: false, nullable: true },
						WF_NAME: { validation: { required: true } },
						ROLE_TIER_CD: { validation: { required: true } },
						DEAL_TYPE_CD: { validation: { required: true } },
						WFSTG_MBR_SID: { validation: { required: true } },
						TRKR_NBR_UPD : { type: "boolean"  },
					}
				}
			},
		});

		vm.gridOptions = {
		    dataSource: vm.dataSource,
		    filterable: gridConstants.filterable,
		    sortable: true,
		    selectable: true,
		    resizable: true,
		    groupable: true,
		    editable: {mode: "popup", confirmation:false },
		    pageable: {
		        refresh: true,
		        pageSizes: gridConstants.pageSizes,
		    },
		    change: vm.onChange,
		    columns: [
              { field: "WF_SID", title: "Id", width: "5%"},
              { field: "WF_NAME", title: "WF Name", width: "15%" },
              { field: "ROLE_TIER_CD", title: "Role Tier", width: "10%" },
              { field: "DEAL_TYPE_CD", title: "Deal Type", width: "10%" },              
              { field: "WFSTG_ACTN_CD", title: "Action", width: "15%" },
              { field: "WFSTG_CD_SRC", title: "Begin Stage", width: "15%" },
              { field: "WFSTG_CD_DEST", title: "End Stage", width: "15%" },
              { field: "TRKR_NBR_UPD", title: "Update Tracker", width: "15%", template: "<div><span ng-if='! #= TRKR_NBR_UPD # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= TRKR_NBR_UPD # ' class='icon-md intelicon-filled-box'></span></div>" },
            ]
		};

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