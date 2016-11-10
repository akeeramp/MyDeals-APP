angular.module('app.securityAttributes')
.controller('applicationsController', function ($uibModal, ApplicationsFactory, $scope) {
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
                ApplicationsFactory.getApplications()
					.then(function (data) {
					    e.success(data);
					});
            },
            update: function (e) {
                ApplicationsFactory.updateApplication(e.data.models[0])
					.then(function (data) {
					    e.success(data);
					});
            },
            destroy: function (e) {
                ApplicationsFactory.deleteApplication(e.data.models[0].APPL_SID)
					.then(function (data) {
					    e.success(data);
					});
            },
            create: function (e) {
                ApplicationsFactory.insertApplication(e.data.models[0])
					.then(function (data) {
					    e.success(data);
					});
            }
        },
        batch: true,
        pageSize: 20,
        schema: {
            model: {
                id: "APPL_SID",
                fields: {
                    APPL_SID: { editable: false, nullable: true },
                    APPL_CD: { validation: { required: true } },
                    APPL_DESC: { validation: { required: true} },
                    APPL_SUITE: { validation: { required: true } },
                    ACTV_IND: { type: "boolean" }
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
		    field: "APPL_SID",
		    title: "ID",
		}, {
		    field: "APPL_CD",
		    title: "Name"
		}, {
		    field: "APPL_DESC",
		    title: "Description"
		}, {
		    field: "APPL_SUITE",
		    title: "Suite"
		}, {
		    field: "ACTV_IND",
		    title: "Active"
		}]
    }

    // Gets and sets the selected row
    function onChange() {
        vm.selectedItem = $scope.applicationsGrid.select();
        if (vm.selectedItem.length == 0) {
            vm.isButtonDisabled = true;
        } else {
            vm.isButtonDisabled = false;
        }
        $scope.$apply();
    }

    function addItem() {
        vm.isButtonDisabled = true;
        $scope.applicationsGrid.addRow();
    }
    function updateItem() {
        $scope.applicationsGrid.editRow(vm.selectedItem);
    }
    function deleteItem() {
        $scope.applicationsGrid.removeRow(vm.selectedItem);
    }

});