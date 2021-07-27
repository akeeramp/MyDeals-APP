(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('CustomerVendorsController', CustomerVendorsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http']; 

    CustomerVendorsController.$inject = ['customerVendorsService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function CustomerVendorsController(customerVendorsService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;


        if (!isCustomerAdmin && window.usrRole != 'SA' && window.usrRole != 'RA' && !window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }

        vm.custsDataSource = [];
        vm.vendorsNamesinfo = [];
        vm.vendorsNamesId = [];
        vm.selectedCUST_MBR_SID = 1;
        vm.selectedVENDOR_SID = 0


        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    customerVendorsService.getCustomerVendors()
                        .then(function (response) {
                            vm.CustvendorsData = response.data;
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Customer Vendors.", response, response.statusText);
                        });
                },
                update: function (e) {
                    if (vm.IsValidCustomerVendorMapping(e.data.models[0])) {
                        customerVendorsService.updateCustomerVendor(e.data.models[0])
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Customer Vendor Updated.");
                            }, function (response) {
                                logger.error("Unable to update Customer Vendor.", response, response.statusText);
                            });
                    }

                },
                create: function (e) {
                    if (e.data.models[0]) {
                        if (vm.IsValidCustomerVendorMapping(e.data.models[0])) {
                            customerVendorsService.insertCustomerVendor(e.data.models[0])
                                .then(function (response) {
                                    e.success(response.data);
                                    logger.success("New Vendor Added.");
                                }, function (response) {
                                    logger.error("Unable to insert Vendor.", response, response.statusText);
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
                        ATRB_SID: { editable: false },
                        OBJ_SET_TYPE_SID: { editable: false },
                        CUST_MBR_SID: { editable: true },                        
                        CUST_NM: { editable: true },
                        DROP_DOWN: {
                            validation: {
                                required: true,
                                uniquenessvalidation: function (input) {
                                    if (input.is("[name='DROP_DOWN']") && input.val() != "") {
                                        input.attr("data-uniquenessvalidation-msg", "Values must be unique for any given Vendor and Customer combination.");
                                        return checkUnique(input.val());
                                    }
                                    return true;
                                }
                            }
                        },
                        ATRB_LKUP_DESC: { editable: true },
                        ACTV_IND: { type: "boolean" },
                        VNDR_ID: { editable: true },
                        BUSNS_ORG_NM: { editable : true },
                        CTRY_CD: { editable: true },
                        CTRY_NM: { editable: true }
                    }
                }
            }

        });

        function getCustomersDataSource() {
            customerVendorsService.getCustomerDropdowns(true)
                .then(function (response) {
                    vm.getCustomersData = response.data;
                }, function (response) {
                    logger.error("Unable to get Dropdown Customers.", response, response.statusText);
                });
        }
        getCustomersDataSource();

        function getVendorsInfoDropdown() {
            customerVendorsService.getVendorsData().then(function (response) {
                vm.vendorsNamesinfo = response.data
            }, function (response) {
                logger.error("Unable to get Dropdown vendors.", response, response.statusText);
            })
        }

        getVendorsInfoDropdown();

        vm.customers = {
            placeholder: "Select Customer..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.getCustomersData);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "CUST_NM",
            dataValueField: "CUST_SID",
            valuePrimitive: true
        }

        vm.vendorsNamesOptions = {
            placeholder: "Select Vendor by Name..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.vendorsNamesinfo);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "BUSNS_ORG_NM",
            dataValueField: "BUSNS_ORG_NM",
            valuePrimitive: true,
            select: onVendorCahnge
        }

        vm.vendorsIdsOptions = {
            placeholder: "Select Vendor by ID..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.vendorsNamesinfo);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "VNDR_ID",
            dataValueField: "VNDR_ID",
            valuePrimitive: true,
            select: onVendorCahnge

        }

        vm.VendorNamesEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.vendorsNamesOptions" id="Vndr_Names" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.VendorIdEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.vendorsIdsOptions" id="Vndr_Ids" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.CustomersEditor = function (container, options) {

            var editor = $('<select kendo-combo-box k-options="vm.customers" name="' + options.field + '" style="width:100%"></select>').appendTo(container);

        }
        vm.CountryEditor = function (container, options) {
            var editor = $('<input type="text" class="k-input k-textbox" name="' + options.field + '" data-bind="value:CTRY_CD" disabled/>').appendTo(container);
        }

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            selectable: true,
            editable: { mode: "inline", confirmation: false },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
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
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" }
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
                    field: "CUST_MBR_SID",
                    title: "Customer",
                    editor: vm.CustomersEditor,
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
                        } }
                },
                {
                    field: "BUSNS_ORG_NM",
                    title: "Settlement Partner Name",
                    editor: vm.VendorNamesEditor,
                    filterable: { multi: true, search: true }

                },
                {
                    field: "DROP_DOWN",
                    title: "Settlement Partner ID",
                    editor: vm.VendorIdEditor,
                    filterable: { multi: true, search: true }
                },
                {
                    field: "CTRY_CD",
                    title: "Country",
                    editor: vm.CountryEditor,
                    filterable: { multi: true, search: true }
                }]

        }

        vm.IsValidCustomerVendorMapping = function (model) {

            var validationMessages = [];
            if (model.CUST_MBR_SID == null || model.CUST_MBR_SID == '' || vm.getCustomersData.filter(x => x.CUST_SID === model.CUST_MBR_SID).length == 0)
                validationMessages.push("Please Select Valid <b>Customer</b>.");
            if (model.BUSNS_ORG_NM == null || model.BUSNS_ORG_NM == '' || vm.vendorsNamesinfo.filter(x => x.BUSNS_ORG_NM === model.BUSNS_ORG_NM).length == 0)
                validationMessages.push("Please Select Valid <b>Settlement Partner</b>.");
            if (model.DROP_DOWN == null || model.DROP_DOWN == '' || vm.vendorsNamesinfo.filter(x => x.VNDR_ID === parseInt(model.DROP_DOWN)).length == 0)
                validationMessages.push("Please Select Valid <b>Settlement Partner ID</b>.");
            if (vm.CustvendorsData != undefined){
                if (vm.CustvendorsData.filter(x => x.CUST_MBR_SID === model.CUST_MBR_SID && x.DROP_DOWN === model.DROP_DOWN.toString()).length == 1 && model.ATRB_LKUP_SID == '') {
                    validationMessages.push("<b>This Combination of Customer & Settlement Partner already exists</b>.");
                }
                else if (vm.CustvendorsData.filter(x => x.CUST_MBR_SID === model.CUST_MBR_SID && x.DROP_DOWN === model.DROP_DOWN.toString() && x.ACTV_IND == model.ACTV_IND).length == 1 && model.ATRB_LKUP_SID != '') {
                    validationMessages.push("<b>This Combination of Customer & Settlement Partner already exists</b>.");
                }
            }
            if (validationMessages.length > 0)
                kendo.alert(validationMessages.join("</br>"));

            return validationMessages.length == 0;
        }


        function checkUnique(val) {
            var gridData = $scope.customerVendorsGrid.dataSource.data()
            for (var i = 0; i <= gridData.length; i++) {
                if (gridData[i] == null || gridData[i]["ATRB_LKUP_SID"] == null || gridData[i]["ATRB_LKUP_SID"] == "") {
                    //do not compare against objects that have not been created, i.e. have no sid - this includes itself
                    continue;
                } else {
                    if (gridData[i]["CUST_MBR_SID"] == vm.selectedCUST_MBR_SID &&
                        gridData[i]["DROP_DOWN"] == val) {
                        //if there is an existing basic dropdown with identical Custome and Vendor return false
                        return false;
                    }
                }
            }
            return true;
        }

        function custFilter(element) {
            element.kendoDropDownList({
                dataTextField: "CUST_NM",
                dataValueField: "CUST_SID",
                dataSource: vm.getCustomersData
            });
        }


        function onVendorCahnge(e) {
            if (e.dataItem != undefined && e.dataItem != null) {
                var selectedVendName = e.dataItem.BUSNS_ORG_NM;
                var selectedVendId = e.dataItem.VNDR_ID;
                var Country = e.dataItem.CTRY_CD;
                var Idscombo = $("#Vndr_Ids").data("kendo-combo-box");
                Idscombo.value(selectedVendId);
                Idscombo.trigger("change");
                var Namecombo = $("#Vndr_Names").data("kendo-combo-box");
                Namecombo.value(selectedVendName);
                Namecombo.trigger("change");
                var Country = $("input[name=CTRY_CD]").val(Country);
                Country.trigger("change");
            }
        }

        function cancelChanges() {
            $scope.CustVendorMapperGrid.cancelChanges();
        }

    }
   
}) ();
