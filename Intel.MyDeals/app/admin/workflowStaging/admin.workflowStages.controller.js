/// <reference path="workflow.service.js" />
(function () {
	'use strict';

	angular
        .module('app.admin')
        .controller('WorkflowStagesController', WorkflowStagesController);

	WorkflowStagesController.$inject = ['$scope', 'dataService', 'workflowStagesService', 'logger', 'confirmationModal', 'gridConstants'];

	function WorkflowStagesController($scope, dataService, workflowStagesService, logger, confirmationModal, gridConstants) {
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
                        	logger.success("Workflow Stage updated.");
                        }, function (response) {
                            logger.error("Unable to update Workflow Stage.", response, response.statusText);
                        });
				},
				destroy: function (e) {
				    workflowStagesService.DeleteWorkflowStages(e.data)
                        .then(function (response) {
                        	e.success(response.data);
                        	logger.success("Workflow Stage Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete Workflow Stage.", response, response.statusText);
                        });
				},
				create: function (e) {
				    workflowStagesService.SetWorkflowStages(e.data)
                        .then(function (response) {
                        	e.success(response.data);
                        	logger.success("New Workflow Stage added.");
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
					    WFSTG_CD: { validation: { required: true } },
						WFSTG_DESC: { validation: { required: true } },
						ROLE_TIER_CD: { validation: { required: true } },
						WFSTG_LOC: { validation: { required: true } },
						WFSTG_STS: { validation: { required: true } },
						WFSTG_ORD: { validation: { required: true } },
						ALLOW_REDEAL: { validation: { required: true } },
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
			editable: { mode: "popup", confirmation: false },
			pageable: {
				refresh: true,
				pageSizes: gridConstants.pageSizes,
			},
			change: vm.onChange,
			columns: [
              { field: "WFSTG_MBR_SID", title: "Id", width: "10%"},
              { field: "WFSTG_CD", title: "Stage Code", width: "20%" },
              { field: "WFSTG_DESC", title: "Stage Description", width: "20%" },
              { field: "ROLE_TIER_CD", title: "Stage Tier", width: "15%" },
              { field: "WFSTG_LOC", title: "Location", width: "15%" },
              { field: "WFSTG_ORD", title: "Order By", width: "10%" },
              { field: "ALLOW_REDEAL", title: "Allow Redeal", width: "10%" },
         
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
		    if (!selectedDataItem.WFSTG_MBR_SID) {
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