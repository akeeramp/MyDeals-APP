angular.module('app.securityAttributes')
.controller('applicationsController', function ($uibModal, SecurityActionsFactory, $scope) {
	vm = this;

	// Functions
	vm.addItem = addItem;
	vm.updateItem = updateItem;
	vm.deleteItem = deleteItem
	vm.onChange = onChange;

	// Variables
	vm.selectedItem = null;
	vm.isButtonDisabled = true;
	vm.toolBarTemplate = $("#toolBarTemplate").html();

	vm.dataSource = new kendo.data.DataSource({
		type: "json",
		transport: {
			read: function (e) {
				SecurityActionsFactory.getActions()
					.then(function (data) {
						e.success(data);
					});
			},
			update: function (e) {
				SecurityActionsFactory.updateAction(e.data.models[0])
					.then(function (data) {
						e.success(data);
					});
			},
			destroy: function (e) {
				SecurityActionsFactory.deleteAction(e.data.models[0].ACTN_SID)
					.then(function (data) {
						e.success(data);
					});
			},
			create: function (e) {
				SecurityActionsFactory.insertAction(e.data.models[0])
					.then(function (data) {
						e.success(data);
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
					ACTN_DESC: { validation: { required: true, min: 1 } },
					ACTN_CATGRY_CD: {},
					WFSTG_ACTN_CD: {}
				}
			}
		}
	});

	vm.mainGridOptions = {
		dataSource: vm.dataSource,
		sortable: true,
		selectable: true,
		pageable: true,
		editable: "popup",
		change: vm.onChange,
		toolbar: vm.toolBarTemplate,
		//toolbar: [
		//	"create",
		//	{ name: "customEdit", text: "Edit", imageClass: "k-edit", className: "k-custom-edit btn btn-primary", iconClass: "k-icon" },
		//	{ name: "customDelete", text: "Delete", imageClass: "k-delete", className: "k-custom-delete btn btn-default", iconClass: "k-icon" }
		//],
		columns: [
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
			field: "ACTN_CATGRY_CD",
			title: "Category"
		}, {
			field: "WFSTG_ACTN_CD",
			title: "Stage"
		}]
	}

	// Gets and sets the selected row
	function onChange() {
		vm.selectedItem = $scope.actionsGrid.select();
		if (vm.selectedItem.length == 0) {
			vm.isButtonDisabled = true;
		} else {
			vm.isButtonDisabled = false;
		}
		$scope.$apply();
	}

	function addItem() {
		vm.isButtonDisabled = true;
		$scope.actionsGrid.addRow();
	}
	function updateItem() {
		$scope.actionsGrid.editRow(vm.selectedItem);
	}
	function deleteItem() {
		$scope.actionsGrid.removeRow(vm.selectedItem);
	}

});