angular.module('app.securityAttributes')
.controller('roleTypesController', function ($uibModal, roleTypesFactory, $scope) {
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
			    RoleTypesFactory.getRoleTypes()
					.then(function (data) {
						e.success(data);
					});
			},
			update: function (e) {
			    RoleTypesFactory.updateRoleType(e.data.models[0])
					.then(function (data) {
						e.success(data);
					});
			},
			destroy: function (e) {
			    RoleTypesFactory.deleteRoleType(e.data.models[0].ROLE_TYPE_SID)
					.then(function (data) {
						e.success(data);
					});
			},
			create: function (e) {
			    RoleTypesFactory.insertRoleType(e.data.models[0])
					.then(function (data) {
						e.success(data);
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
				    APPL_SID: { validation: { required: true } },
				    ROLE_TYPE_CD: { validation: { required: true } },
				    ROLE_TYPE_DSPLY_CD: { validation: { required: true } },
				    ROLE_TYPE_DESC: { validation: { required: true, min: 1 } },
					ROLE_TIER_CD: {},
					IS_SINGLE_SELECT: {},
				    ACTV_IND: {}
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
		    field: "ROLE_TYPE_SID",
		    title: "ID",
		}, {
		    field: "APPL_SID",
		    title: "Application ID"
		}, {
		    field: "ROLE_TYPE_CD",
			title: "Name"
		}, {
		    field: "ROLE_TYPE_DSPLY_CD",
		    title: "Display Name"
		}, {
		    field: "ROLE_TYPE_DESC",
			title: "Description"
		}, {
		    field: "ROLE_TIER_CD",
			title: "Tier"
		}, {
		    field: "IS_SINGLE_SELECT",
		    title: "Single Select"
		}, {
		    field: "ACTV_IND",
		    title: "Active"
		}]
	}

	// Gets and sets the selected row
	function onChange() {
		vm.selectedItem = $scope.roleTypesGrid.select();
		if (vm.selectedItem.length == 0) {
			vm.isButtonDisabled = true;
		} else {
			vm.isButtonDisabled = false;
		}
		$scope.$apply();
	}

	function addItem() {
		vm.isButtonDisabled = true;
		$scope.roleTypesGrid.addRow();
	}
	function updateItem() {
	    $scope.roleTypesGrid.editRow(vm.selectedItem);
	}
	function deleteItem() {
	    $scope.roleTypesGrid.removeRow(vm.selectedItem);
	}

});