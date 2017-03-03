(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DropdownsController', DropdownsController)

    DropdownsController.$inject = ['dropdownsService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function DropdownsController(dropdownsService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        // Functions
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dealtypeDataSource = [];
        vm.dealtypes = [];
        vm.onlyAllDeal = [];
        vm.groupsDataSource = [];
        vm.nonCorpInheritableValues = [];
        vm.selectedInheritanceGroup = "";

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    dropdownsService.getBasicDropdowns()
                        .then(function (response) {
                            setNonCorpInheritableValues(response.data);
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
                            if (e.data.models[0].ATRB_CD == "MRKT_SEG_COMBINED") {
                                var indx = vm.nonCorpInheritableValues.indexOf(e.data.models[0].DROP_DOWN);
                                if (indx > -1) {
                                    vm.nonCorpInheritableValues.splice(indx, 1);
                                }
                            }
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
                            vm.selectedInheritanceGroup = "";
                            if (response.data.ATRB_CD == "MRKT_SEG_COMBINED") {
                                vm.nonCorpInheritableValues.push(response.data.DROP_DOWN);
                            }
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
                        DROP_DOWN: {
                            validation: {
                                required: true,
                                inheritancevalidation: function (input) {
                                    if (input.is("[name='DROP_DOWN']") && input.val() != "") {
                                        input.attr("data-inheritancevalidation-msg", "MRKT_SEG_NON_CORP values must match an existing MRKT_SEG_COMBINED value.");
                                        if (vm.selectedInheritanceGroup == "MRKT_SEG_NON_CORP") {
                                            return (vm.nonCorpInheritableValues.indexOf(input.val()) > -1);
                                        }
                                    }
                                    return true;
                                }
                            }
                        },
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
                            vm.onlyAllDeal = [response.data[0]] //Note: this assumes that "All Deals" will always be at the top of the "All Deal Types" category
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
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            selectable: true,
            groupable: true,
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
                if (e.model.isNew() == false) { //prevent edit of these fields except during creation
                    $('input[name=DROP_DOWN]').parent().html(e.model.DROP_DOWN);
                    $('input[name=OBJ_SET_TYPE_SID]').parent().html(e.model.OBJ_SET_TYPE_CD);
                    $('input[name=ATRB_SID]').parent().html(e.model.ATRB_CD);
                } else {
                    $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").select(0);
                    $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").trigger("change");
                    $("#ATRB_SID").data("kendoDropDownList").select(0);
                    $("#ATRB_SID").data("kendoDropDownList").trigger("change");
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
                    field: "ACTV_IND",
                    title: "Is Active",
                    width: "10%",
                    filterable: { multi: true, search: false },
                    template: gridUtils.boolViewer('ACTV_IND'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                },
                {
                    field: "OBJ_SET_TYPE_SID", //Deal Type
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
                    template: "#= OBJ_SET_TYPE_CD #",
                    filterable: { ui: dealtypeFilter }
                },
                {
                    field: "ATRB_SID", //Dropdown Group
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
                    template: "#= ATRB_CD #",
                    filterable: { ui: groupFilter }
                },
                {
                    field: "DROP_DOWN",
                    title: "Value",
                    filterable: { multi: true, search: true }
                    //TODO: if user selects noncorp, make this a dropdownlist? allowable values are pre-set anyways... can improve user quality of life
                }]
        }

        function dealtypeFilter(element) {
            element.kendoComboBox({
                dataTextField: "dropdownName",
                dataValueField: "dropdownID",
                dataSource: vm.dealtypeDataSource,
                optionLabel: "-- Select Value --"
            });
        }

        function groupFilter(element) {
            element.kendoComboBox({
                dataTextField: "dropdownName",
                dataValueField: "dropdownID",
                dataSource: vm.groupsDataSource,
                optionLabel: "-- Select Value --"
            });
        }

        function setNonCorpInheritableValues(data) {
            //list of basic dropdown objects
            for (var i = 0; i <= data.length; i++) {
                if (data[i] != null && data[i].ATRB_CD == "MRKT_SEG_COMBINED") {
                    vm.nonCorpInheritableValues.push(data[i].DROP_DOWN);
                }
            }
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
            //TODO: notify user that their choice may set other dropdowns to inactive if there is overlap - should we just refresh the entire grid?
            //Note: why is this kendo select event being called twice? once on click and once on deselect
        }

        function onGroupChange(e) {
            //Note: why is this kendo select event being called twice? once on click and once on deselect
            if (e.dataItem.allDealFlag == 0) {
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").setDataSource(vm.dealtypes);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").refresh();
            } else {
                //if true, deal type only has the option of being "All Deals"
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").setDataSource(vm.onlyAllDeal);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").refresh();
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").text(vm.onlyAllDeal[0].dropdownName);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").value(vm.onlyAllDeal[0].dropdownId);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").trigger("change");
            }

            if (e.dataItem.parntAtrbCd != null && e.dataItem.parntAtrbCd != "") {
                vm.selectedInheritanceGroup = e.dataItem.dropdownName;
            } else {
                vm.selectedInheritanceGroup = "";
            }
        }

        function clearFilters() {
            $scope.dropdownGrid.dataSource.filter([]);
        }

        function cancelChanges() {
            $scope.dropdownGrid.cancelChanges();
        }

    }
})();