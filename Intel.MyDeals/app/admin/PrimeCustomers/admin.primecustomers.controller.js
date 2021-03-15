(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PrimeCustomersController', PrimeCustomersController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    PrimeCustomersController.$inject = ['PrimeCustomersService', 'dataService', 'dropdownsService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$uibModal'];

    function PrimeCustomersController(PrimeCustomersService, dataService, dropdownsService, $scope, logger, confirmationModal, gridConstants, $uibModal) {
        $scope.accessAllowed = true;
        var vm = this;
        vm.countries = [];
        vm.primeCustomers = [];

        vm.initiateDropdown = function () {
            PrimeCustomersService.getCountries().then(function (response) {
                vm.countries = response.data
            }, function (response) {
                logger.error("Unable to get Countries", response, response.statusText);
            });

            PrimeCustomersService.getPrimeCustomers().then(function (response) {
                vm.primeCustomers = response.data;
            }, function (response) {
                logger.error("Unable to get Prime Customers", response, response.statusText);
            });
        }


        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    PrimeCustomersService.GetPrimeCustomerDetails().then(function (response) {
                        e.success(response.data);
                        vm.PrimeCustomersData = response.data;
                        vm.initiateDropdown();
                    }, function (response) {
                        logger.error("Unable to get prime customers.", response, response.statusText);
                    });
                },
                update: function (e) {
                    if (vm.IsvalidPrimeCustomer(e.data)) {
                        PrimeCustomersService.UpdatePrimeCustomer(e.data)
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Prime customer updated.");
                            }, function (response) {
                                logger.error("Unable to update prime customer.", response, response.statusText);
                            });
                    }
                },
                create: function (e) {
                    if (vm.IsvalidPrimeCustomer(e.data)) {
                        PrimeCustomersService.SetPrimeCustomers(e.data)
                            .then(function (response) {
                                e.success(response.data[0]);
                                logger.success("New Prime customer added.");
                            }, function (response) {
                                logger.error("Unable to insert prime customer.", response, response.statusText);
                            });
                    }
                }

            },
            pageSize: 25,
            schema: {
                model: {
                    id: "PRIME_SID",
                    fields: {

                        PRIME_MBR_SID: { editable: true },
                        PRIME_CUST_NM: { editable: true },
                        PRIME_CUST_COUNTRY: { editable: true },
                        RPL_STATUS: { editable: true },
                        IS_ACTIVE: { editable: true },
                        PRIME_LVL_SID: { editable: true },
                        PRIME_LVL_NM: { editable: false },
                        PRIME_SID: { editable: false }
                    }
                }
            }
        })

        vm.IsvalidPrimeCustomer = function (model) {
            var validationMessages = [];
            var isPrimeexist = vm.PrimeCustomersData.filter(x => x.PRIME_MBR_SID === parseInt(model.PRIME_MBR_SID) && x.PRIME_LVL_SID === parseInt(model.PRIME_LVL_SID));
            if (model.PRIME_MBR_SID == null || model.PRIME_MBR_SID == '')
                validationMessages.push("Please provide Valid ID");
            if (model.PRIME_CUST_NM == null || model.PRIME_CUST_NM == '')
                validationMessages.push("Please Provide Valid Prime Customer Name");
            if (isPrimeexist.length > 1)
                validationMessages.push("This Combination of Prime Custmer ID and Leve 2 ID is already exists")
            if (model.PRIME_CUST_COUNTRY == null || model.PRIME_CUST_COUNTRY == '' || vm.countries.filter(x => x.CTRY_NM === model.PRIME_CUST_COUNTRY).length == 0)
                validationMessages.push("Please Select Valid Country.")
            if (validationMessages.length > 0)
                kendo.alert(validationMessages.join("</br>"));

            return validationMessages.length == 0;

        }

        vm.PrimeCustNames = {
            placeholder: "Select Customer Name..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.primeCustomers);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "PRIME_CUST_NM",
            dataValueField: "PRIME_CUST_NM",
            valuePrimitive: true

        }




        vm.PrimeCustCountry = {
            placeholder: "Select Customer Country..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.countries);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "CTRY_NM",
            dataValueField: "CTRY_NM",
            valuePrimitive: true

        }

        vm.PrimeCustNamesEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustNames" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.PrimeCustCountryEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustCountry" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.PrimeIDEditor = function (container, options) {
            // hard coded value on editor to display all -1 default options as blank. Gets converted back to -1 on save
            if (options.model.DFLT_LOOKBACK_PERD === -1) {
                options.model.DFLT_LOOKBACK_PERD = "";
            }
            var PrimeEditor = $('<input id="Prime_IDEditor' + options.field + '" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "#",
                    decimals: 0,
                    spinners: false

                });
        }

        vm.PrimeIDL2Editor = function (container, options) {
            // hard coded value on editor to display all -1 default options as blank. Gets converted back to -1 on save
            if (options.model.DFLT_LOOKBACK_PERD === -1) {
                options.model.DFLT_LOOKBACK_PERD = "";
            }
            var PrimeL2Editor = $('<input id="PrimeID_L2Editor' + options.field + '" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "#",
                    decimals: 0,
                    spinners: false
                });
        }

        vm.gridOptions = {

            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: { mode: "inline", confirmation: false },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span title="Save" class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span title="Cancel" class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>" }
                       

                    ],
                    title: "Commands",
                    width: "100px"
                },
                {
                    field: "PRIME_SID",
                    title: "Customer ID",
                    hidden: true
                },

                {
                    field: "IS_ACTIVE",
                    title: "Is Active",
                    width: "7%",
                    filterable: { multi: true, search: false },
                    template: gridUtils.boolViewer('IS_ACTIVE'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                },

                {
                    field: "PRIME_MBR_SID",
                    title: "Prime ID",
                    width: "200px",
                    editor: vm.PrimeIDEditor

                },
                {
                    field: "PRIME_CUST_NM",
                    title: "Prime Customer Name",
                    width: "230px",
                    //filterable: { multi: true, search: true },
                    //editor: cusNameDropDownEditor
                    editor: vm.PrimeCustNamesEditor
                },

                {
                    field: "PRIME_LVL_SID",
                    title: "Prime L2 ID",
                    width: "200px",
                    editor: vm.PrimeIDL2Editor
                },
                {
                    field: "PRIME_LVL_NM",
                    title: "Prime L2 Customer Name",
                    width: "230px"
                },
                {
                    field: "PRIME_CUST_COUNTRY",
                    title: "Prime Country",
                    width: "200px",
                    editor: vm.PrimeCustCountryEditor
                },
                {
                    field: "RPL_STATUS",
                    title: "RPL STATUS",
                    width: "200px"
                }

            ]


        }
        // Populate CustomerName DropDown
        //function cusNameDropDownEditor(container, options) {
        //    $('<input required name="' + options.field + '"/>')
        //        .appendTo(container)
        //        .kendoDropDownList({
        //            optionLabel: "Select Customer Name1",
        //            autoBind: true,
        //            dataTextField: "PRIME_CUST_NM",
        //            dataValueField: "PRIME_CUST_NM",
        //            dataSource:
        //            {
        //                data: vm.PrimeCustomersData,
        //                //filter: [
        //                //    { field: "PRIME_CUST_NM", operator: "eq", value: "PRIME_CUST_NM" }
        //                //]
        //            }


        //        });
        //}


    }

})();
