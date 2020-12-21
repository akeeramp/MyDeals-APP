(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DropdownsController', DropdownsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    DropdownsController.$inject = ['dropdownsService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function DropdownsController(dropdownsService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        vm.dealtypeDataSource = [];
        vm.dealtypes = [];
        vm.onlyAllDeal = [];
        vm.groupsDataSource = [];
        vm.custsDataSource = [];
        vm.nonCorpInheritableValues = [];
        vm.selectedInheritanceGroup = "";
        vm.selectedInheritanceCust = "";
        vm.COMP_ATRB_SIDS = [];
        //Added CONSUMPTION_CUST_RPT_GEO, CONSUMPTION_CUST_PLATFORM, CONSUMPTION_CUST_SEGMENT
        vm.COMP_ATRB_SIDS.push(3456)
        vm.COMP_ATRB_SIDS.push(3457)
        vm.COMP_ATRB_SIDS.push(3458)
        vm.selectedATRB_SID = 0;
        vm.selectedOBJ_SET_TYPE_SID = 0;
        vm.selectedCUST_MBR_SID = 1;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    dropdownsService.getBasicDropdowns(true)
                        .then(function (response) {
                            setNonCorpInheritableValues(response.data);
                            e.success(response.data.filter(checkRestrictions));
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
                        bodyText: 'Entries currently used in a deal should be deactivated, not deleted. If the entry is currently on a deal it will deactivate instead of deleting.'
                        
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
                            logger.success("Dropdown Deleted or Deactivated.");
                            var grid = $("#dropdownGrid").data("kendoGrid");
                            grid.refresh();  
                        }, function (response) {
                            logger.error("Unable to delete Dropdown.", response, response.statusText);
                            cancelChanges();
                        });
                    }, function (response) {
                            cancelChanges();
                    });
                    
                },
                create: function (e) {
                    var IS_MODEL_VALID = true;
                    if (e.data.models[0]) {
                        if (vm.COMP_ATRB_SIDS.indexOf(e.data.models[0].ATRB_SID) > -1) {
                            if (e.data.models[0].DROP_DOWN.length > 40) {
                                logger.warning("Value can not be more than 40 characters long.");
                                IS_MODEL_VALID = false;
                            } else if (e.data.models[0].DROP_DOWN.indexOf(',') > -1) {
                                logger.warning("Value can not have comma (,).");
                                IS_MODEL_VALID = false;
                            }
                            
                        }
                        
                        if (IS_MODEL_VALID) {
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
                        
                    }
                    
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
                        CUST_MBR_SID: { validation: { required: true } },
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
                                },
                                uniquenessvalidation: function (input) {
                                    if (input.is("[name='DROP_DOWN']") && input.val() != "") {
                                        input.attr("data-uniquenessvalidation-msg", "Values must be unique for any given deal type and grouping combination.");
                                        return checkUnique(input.val());
                                    }
                                    return true;
                                }
                            }
                        },
                        ATRB_LKUP_DESC: { validation: { required: false } },
                        ATRB_LKUP_TTIP: { validation: { required: false } },
                        ACTV_IND: { type: "boolean" },
                    }
                }
            }
        });

        function checkRestrictions(dataItem) {
            var Id = (dataItem.dropdownID === undefined) ? dataItem.ATRB_SID : dataItem.dropdownID;
            //var Id = dataItem.dropdownID ?
            var restrictToConsumptionOnly = (usrRole === 'SA' && !isDeveloper);
            var restrictedGroupList = [3456, 3457, 3458];
            if (restrictToConsumptionOnly === false) {
                return true;
            }
            else {
                return restrictedGroupList.includes(Id);
            }

        }

        function getDealtypeDataSource() {
            dropdownsService.getDealTypesDropdowns(true)
                        .then(function (response) {
                            vm.dealtypeDataSource = response.data;
                            vm.dealtypes = response.data;
                            vm.onlyAllDeal = response.data.filter(isAllDeals);
                        }, function (response) {
                            logger.error("Unable to get Deal Type Dropdowns.", response, response.statusText);
                        });
        }
        getDealtypeDataSource();

        function getGroupsDataSource() {
            dropdownsService.getDropdownGroups(true)
                .then(function (response) {
                    vm.groupsDataSource = response.data.filter(checkRestrictions);
                        }, function (response) {
                            logger.error("Unable to get Dropdown Groups.", response, response.statusText);
                        });
        }
        getGroupsDataSource();

        function getCustsDataSource() {
            dropdownsService.getCustsDropdowns(true)
                .then(function (response) {
                    vm.custsDataSource = response.data;
                }, function (response) {
                    logger.error("Unable to get Dropdown Customers.", response, response.statusText);
                });
        }
        getCustsDataSource();

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            //reorderable: true,
            //columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            selectable: true,
            //groupable: true,
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
                if (e.model.isNew() == false) { //edit case: prevent edit of these fields except during creation
                    $('input[name=DROP_DOWN]').parent().html(e.model.DROP_DOWN);
                    $('input[name=OBJ_SET_TYPE_SID]').parent().html(e.model.OBJ_SET_TYPE_CD);
                    $('input[name=CUST_MBR_SID]').parent().html(e.model.CUST_NM);
                    $('input[name=ATRB_SID]').parent().html(e.model.ATRB_CD);
                } else {    //new entry case: all fields are editable
                    $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").select(0);
                    $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").trigger("change");
                    vm.selectedOBJ_SET_TYPE_SID = $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").dataSource.data()[0].dropdownID;
                    $("#CUST_MBR_SID").data("kendoDropDownList").select(0);
                    $("#CUST_MBR_SID").data("kendoDropDownList").trigger("change");
                    vm.selectedCUST_MBR_SID = $("#CUST_MBR_SID").data("kendoDropDownList").dataSource.data()[0].dropdownID;
                    $("#ATRB_SID").data("kendoDropDownList").select(0);
                    $("#ATRB_SID").data("kendoDropDownList").trigger("change");
                    vm.selectedATRB_SID = $("#ATRB_SID").data("kendoDropDownList").dataSource.data()[0].dropdownID;
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
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                        { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                    ],
                    title: "Commands",
                    width: "10%"
                },
                {
                    field: "ACTV_IND",
                    title: "Is Active",
                    width: "8%",
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
                    filterable: {
                        ui: dealtypeFilter,
                        extra: false,
                        operators: {
                            string: {
                                eq: "Is equal to",
                                neq: "Not equal to",
                                //startswith: "Starts with",
                                //endswith: "Ends with",
                                //contains: "Contains",
                                //doesnotcontain: "Does not contain",
                                isempty: "Is empty"
                            }
                        }
                    },
                    sortable: {
                        compare: function (a, b) {
                            return a.OBJ_SET_TYPE_CD.toLowerCase() === b.OBJ_SET_TYPE_CD.toLowerCase() ? 0 : (a.OBJ_SET_TYPE_CD.toLowerCase() > b.OBJ_SET_TYPE_CD.toLowerCase()) ? 1 : -1;
                        }
                    }
                },
                {
                    field: "ATRB_SID", //Dropdown Group
                    title: "Group",
                    editor: function (container) { // use a dropdownlist as an editor
                        // create an input element with id and name set as the bound field (ATRB_SID)
                        var input = $('<input id="ATRB_SID" name="ATRB_SID">');
                        // append to the editor container
                        input.appendTo(container);

                        //new editor, so refresh inheritance group var used for value validation
                        vm.selectedInheritanceGroup = "";

                        // initialize a dropdownlist
                        input.kendoDropDownList({
                            dataTextField: "dropdownName",
                            dataValueField: "dropdownID",
                            dataSource: vm.groupsDataSource, // bind it to the group datasource
                            select: onGroupChange
                        }).appendTo(container);
                    },
                    template: "#= ATRB_CD #",
                    filterable: {
                        ui: groupFilter,
                        extra: false,
                        operators: {
                            string: {
                                eq: "Is equal to",
                                neq: "Not equal to",
                                //startswith: "Starts with",
                                //endswith: "Ends with",
                                //contains: "Contains",
                                //doesnotcontain: "Does not contain",
                                isempty: "Is empty"
                            }
                        }
                    },
                    sortable: {
                        compare: function (a, b) {
                            return a.ATRB_CD.toLowerCase() === b.ATRB_CD.toLowerCase() ? 0 : (a.ATRB_CD.toLowerCase() > b.ATRB_CD.toLowerCase()) ? 1 : -1;
                        }
                    }
                },
                {
                    field: "CUST_MBR_SID", //Dropdown Group
                    title: "Customer",
                    editor: function (container) { // use a dropdownlist as an editor
                        // create an input element with id and name set as the bound field (CUST_MBR_SID)
                        var input = $('<input id="CUST_MBR_SID" name="CUST_MBR_SID">');
                        // append to the editor container
                        input.appendTo(container);

                        // initialize a dropdownlist
                        input.kendoDropDownList({
                            dataTextField: "dropdownName",
                            dataValueField: "dropdownID",
                            dataSource: vm.custsDataSource, // bind it to the dealtype datasource
                            select: onCustChange
                        }).appendTo(container);
                    },
                    template: "#= CUST_NM #",
                    filterable: {
                        ui: custFilter,
                        extra: false,
                        operators: {
                            string: {
                                eq: "Is equal to",
                                neq: "Not equal to",
                                isempty: "Is empty"
                            }
                        }
                    },
                    sortable: {
                        compare: function (a, b) {
                            return a.CUST_NM.toLowerCase() === b.CUST_NM.toLowerCase() ? 0 : (a.CUST_NM.toLowerCase() > b.CUST_NM.toLowerCase()) ? 1 : -1;
                        }
                    }
                },
                {
                    field: "DROP_DOWN",
                    title: "Value",
                    filterable: { multi: true, search: true }
                    //TODO: if user selects noncorp, make this a dropdownlist? allowable values are pre-set anyways... can improve user quality of life
                },
                {
                    field: "ATRB_LKUP_DESC",
                    title: "Description",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "ATRB_LKUP_TTIP",
                    title: "Tooltip",
                    filterable: { multi: true, search: true }
                }]
        }

        function dealtypeFilter(element) {
            element.kendoDropDownList({
                dataTextField: "dropdownName",
                dataValueField: "dropdownID",
                dataSource: vm.dealtypeDataSource
            });
        }

        function groupFilter(element) {
            element.kendoDropDownList({
                dataTextField: "dropdownName",
                dataValueField: "dropdownID",
                dataSource: vm.groupsDataSource
            });
        }

        function custFilter(element) {
            element.kendoDropDownList({
                dataTextField: "dropdownName",
                dataValueField: "dropdownID",
                dataSource: vm.custsDataSource
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

        function checkUnique(val) {
            var gridData = $scope.dropdownGrid.dataSource.data()
            for (var i = 0; i <= gridData.length; i++) {
                if (gridData[i] == null || gridData[i]["ATRB_LKUP_SID"] == null || gridData[i]["ATRB_LKUP_SID"] == "") {
                    //do not compare against objects that have not been created, i.e. have no sid - this includes itself
                    continue;
                } else {
                    if (gridData[i]["OBJ_SET_TYPE_SID"] == vm.selectedOBJ_SET_TYPE_SID &&
                        gridData[i]["CUST_MBR_SID"] == vm.selectedCUST_MBR_SID &&
                        gridData[i]["ATRB_SID"] == vm.selectedATRB_SID &&
                        gridData[i]["DROP_DOWN"] == val) {
                        //if there is an existing basic dropdown with identical deal type, grouping, and value, return false
                        return false;
                    }
                }
            }
            return true;
        }

        function isAllDeals(val) {
            if (val.dropdownName.toLowerCase() == "all deals" || val.dropdownName.toLowerCase() == "all_deals") {   //TODO: should we also be checking for "ALL_TYPES"?
                return true;
            } else {
                return false;
            }
        }

        function onDealTypeChange(e) {
            //TODO: notify user that their choice may set other dropdowns to inactive if there is overlap - should we just refresh the entire grid?
            //Note: kendo select event being called twice? once on click and once on deselect
            vm.selectedOBJ_SET_TYPE_SID = e.dataItem.dropdownID;
        }

        function onCustChange(e) {
            //TODO: notify user that their choice may set other dropdowns to inactive if there is overlap - should we just refresh the entire grid?
            //Note: kendo select event being called twice? once on click and once on deselect
            vm.selectedCUST_MBR_SID = e.dataItem.dropdownID;
        }

        function onGroupChange(e) {
            //Note: kendo select event being called twice? once on click and once on deselect
            if (e.dataItem.allDealFlag == 0) {
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").setDataSource(vm.dealtypes);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").refresh();
            } else {
                //if this case, deal type only has the option of being "All Deals"
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").setDataSource(vm.onlyAllDeal);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").refresh();
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").text(vm.onlyAllDeal[0].dropdownName);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").value(vm.onlyAllDeal[0].dropdownID);
                $("#OBJ_SET_TYPE_SID").data("kendoDropDownList").trigger("change");
                vm.selectedOBJ_SET_TYPE_SID = vm.onlyAllDeal[0].dropdownID;
            }

            vm.selectedATRB_SID = e.dataItem.dropdownID;

            if (e.dataItem.parntAtrbCd != null && e.dataItem.parntAtrbCd != "") {
                vm.selectedInheritanceGroup = e.dataItem.dropdownName;
            } else {
                vm.selectedInheritanceGroup = "";
            }

            //re-trigger validation as a different dropdown group may have different validation rules
            $("[name=DROP_DOWN]").val($("[name=DROP_DOWN]").val()).change();
        }

        function cancelChanges() {
            $scope.dropdownGrid.cancelChanges();
        }

    }
})();