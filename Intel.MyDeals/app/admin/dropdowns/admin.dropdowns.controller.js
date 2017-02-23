(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DropdownsController', DropdownsController)

    DropdownsController.$inject = ['dropdownsService', '$scope', 'logger', 'gridConstants']

    function DropdownsController(dropdownsService, $scope, logger, gridConstants) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem;
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    dropdownsService.getBasicDropdowns()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Dropdowns.", response, response.statusText);
                        });
                },
                update: function (e) {
                    dropdownsService.updateBasicDropdowns(e.data.models[0])
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Dropdown Updated.");
                        }, function (response) {
                            logger.error("Unable to update Dropdown.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    dropdownsService.deleteBasicDropdowns(e.data.models[0].ATRB_LKUP_SID)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Dropdown Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete Dropdown.", response, response.statusText);
                        });
                },
                create: function (e) {
                    dropdownsService.insertBasicDropdowns(e.data.models[0])
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("New Dropdown Added.");
                        }, function (response) {
                            logger.error("Unable to insert Dropdown.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 25,
            schema: {
                model: {
                    id: "ATRB_LKUP_SID",
                    fields: {
                        ATRB_LKUP_SID: { editable: false },
                        OBJ_SET_TYPE_SID: { validation: { required: true } },
                        OBJ_SET_TYPE_CD: { validation: { required: true } },
                        CUST_NM: { validation: { required: true } },
                        ATRB_SID: { validation: { required: true } },
                        ATRB_CD: { validation: { required: true } },
                        ORD: { validation: { required: true } },
                        DROP_DOWN: { validation: { required: true } },
                        ACTV_IND: { type: "boolean" },
                        DROP_DOWN_DB: { validation: { required: true } }
                    }
                }
            }
        });

        vm.dealtypeDataSource = [];
        function getDealtypeDataSource() {
            dropdownsService.getDealTypesDropdowns()
                        .then(function (response) {
                            vm.dealtypeDataSource = response.data;
                        }, function (response) {
                            logger.error("Unable to get Deal Type Dropdowns.", response, response.statusText);
                        });
        }
        getDealtypeDataSource();

        vm.groupsDataSource = [];
        function getGroupsDataSource() {
            dropdownsService.getDropdownGroups()
                        .then(function (response) {
                            vm.groupsDataSource = response.data;
                        }, function (response) {
                            logger.error("Unable to get Dropdown Groups.", response, response.statusText);
                        });
        }
        getGroupsDataSource();

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            editable: "popup",
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: vm.onChange,
            toolbar: vm.toolBarTemplate,
            columns: [
                {
                    field: "ATRB_LKUP_SID",
                    title: "ID",
                    width: "10%",
                },
                //{
                //    field: "OBJ_SET_TYPE_SID",
                //    title: "Deal Type SID",
                //    hidden: true,
                //},
                {
                    field: "OBJ_SET_TYPE_SID", //OBJ_SET_TYPE_CD
                    title: "Deal Type",
                    editor: function (container) { // use a dropdownlist as an editor
                        // create an input element with id and name set as the bound field (OBJ_SET_TYPE_SID)
                        var input = $('<input id="OBJ_SET_TYPE_SID" name="OBJ_SET_TYPE_SID">');
                        // append to the editor container
                        input.appendTo(container);

                        // initialize a dropdownlist
                        input.kendoDropDownList({
                            dataTextField: "dropdownName",
                            dataValueField: "dropdownID",
                            dataSource: vm.dealtypeDataSource // bind it to the dealtype datasource
                        }).appendTo(container);
                    },
                    //template: dealtypeName("#= ATRB_SID #")
                    template: "#= OBJ_SET_TYPE_CD #"
                },
                //{
                //    field: "ATRB_SID",
                //    title: "Dropdown Group SID",
                //    hidden: true,
                //},
                {
                    field: "ATRB_SID", //ATRB_CD
                    title: "Dropdown",
                    editor: function (container) { // use a dropdownlist as an editor
                        // create an input element with id and name set as the bound field (ATRB_SID)
                        var input = $('<input id="ATRB_SID" name="ATRB_SID">');
                        // append to the editor container
                        input.appendTo(container);

                        // initialize a dropdownlist
                        input.kendoDropDownList({
                            dataTextField: "dropdownName",
                            dataValueField: "dropdownID",
                            dataSource: vm.groupsDataSource // bind it to the group datasource
                        }).appendTo(container);
                    },
                    //template: groupName("#= ATRB_SID #")
                    template: "#= ATRB_CD #"
                },
                {
                    field: "DROP_DOWN",
                    title: "Value"
                },
                {
                    field: "ACTV_IND",
                    title: "Is Active",
                    width: "10%",
                    template: "<div><span ng-if='! #= ACTV_IND # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= ACTV_IND # ' class='icon-md intelicon-filled-box'></span></div>"
                }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.dropdownGrid.select();
            console.log(vm.selectedItem)
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.dropdownGrid.addRow();
        }
        function updateItem() {
            $scope.dropdownGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.dropdownGrid.removeRow(vm.selectedItem);
        }

    }
})();