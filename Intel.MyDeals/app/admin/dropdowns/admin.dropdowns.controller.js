(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DropdownsController', DropdownsController)

    DropdownsController.$inject = ['dropdownsService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function DropdownsController(dropdownsService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem;
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dealtypeDataSource = [];
        vm.dealtypes = [];
        vm.onlyAllDeal = [];
        vm.groupsDataSource = [];

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
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Dropdown',
                        hasActionButton: true,
                        headerText: 'Delete Confirmation',
                        bodyText: 'Are you sure you would like to Delete this Dropdown Item?'
                    };

                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        dropdownsService.deleteBasicDropdowns(e.data.models[0].ATRB_LKUP_SID)
                        .then(function (response) {
                            e.success(response.data);
                            logger.success("Dropdown Deleted.");
                        }, function (response) {
                            logger.error("Unable to delete Dropdown.", response, response.statusText);
                            cancelChanges();
                        });
                    }, function (response) {
                        cancelChanges();
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

        function getDealtypeDataSource() {
            dropdownsService.getDealTypesDropdowns()
                        .then(function (response) {
                            vm.dealtypeDataSource = response.data;
                            vm.dealtypes = response.data;
                            vm.onlyAllDeal = [response.data[0]] //this assumes that "All Deals" will always be at the top of the "All Deal Types" category
                        }, function (response) {
                            logger.error("Unable to get Deal Type Dropdowns.", response, response.statusText);
                        });
        }
        getDealtypeDataSource();

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
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
                if (e.model.isNew() == false) { //prevent edit of these fields except during creation
                    $('input[name=DROP_DOWN]').parent().html(e.model.DROP_DOWN);
                    $('input[name=OBJ_SET_TYPE_SID]').parent().html(e.model.OBJ_SET_TYPE_CD);
                    $('input[name=ATRB_SID]').parent().html(e.model.ATRB_CD);
                }
            },
            destroy: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: vm.onChange,
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                        { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                    ],
                    title: "Commands",
                    width: "8%"
                },
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
                            dataSource: vm.dealtypeDataSource, // bind it to the dealtype datasource
                            select: onDealTypeChange
                        }).appendTo(container);
                    },
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
                            dataSource: vm.groupsDataSource, // bind it to the group datasource
                            select: onGroupChange
                        }).appendTo(container);
                    },
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
                    template: gridUtils.boolViewer('ACTV_IND'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.dropdownGrid.select();
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function onDealTypeChange(e) {
            //TODO: notify user that if they select "All Deals", it may set other dropdowns to inactive? need to clarify with Doug. would also need to potentially refresh the entire grid?
            //TODO: why is this kendo select event being called twice? change event only happens once. 2nd select occurs when deselecting...
        }

        function onGroupChange(e) {
            //TODO: if user selects a group marked as subsegment, deal type dropdown must be set to "All Deals"
            //TODO: why is this kendo select event being called twice? change event only happens once. 2nd select occurs when deselecting...
            //TODO: logic below works except the dealtype dropdownlist does not refresh as I initially expected.  need to figure out why
            if (e.dataItem.isSubSegment == 0) {
                vm.dealtypeDataSource = vm.dealtypes;
            } else {
                vm.dealtypeDataSource = vm.onlyAllDeal;
            }
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
        function cancelChanges() {
            $scope.dropdownGrid.cancelChanges();
        }

    }
})();