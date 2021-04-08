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
                                vm.dataSource.read();
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
                                //vm.dataSource.read();
                            }, function (response) {
                                logger.error("Unable to insert prime customer.", response, response.statusText);
                            });
                    }
                }

            },
            pageSize: 25,
            schema: {
                model: {
                    id: "PRIM_SID",
                    fields: {

                        PRIM_CUST_ID: { editable: true },
                        PRIM_CUST_NM: { editable: true },
                        PRIM_CUST_CTRY: { editable: true },
                        RPL_STS: { editable: false },
                        IS_ACTV: { editable: true },
                        PRIM_LVL_ID: { editable: true },
                        PRIM_LVL_NM: { editable: false },
                        PRIM_SID: { editable: false }
                    }
                }
            }
        })
        
        vm.IsvalidPrimeCustomer = function (model) {
            var validationMessages = [];
            var isPrimeIdexist = vm.PrimeCustomersData.filter(x => x.PRIM_CUST_ID === parseInt(model.PRIM_CUST_ID));
            vm.PrimeCustomersData.map(
                function getDuplicate(x) {
                    if (isPrimeIdexist.length >= 1 && model.PRIM_SID !== x.PRIM_SID) {
                         if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x.PRIM_CUST_NM !== model.PRIM_CUST_NM && isPrimeIdexist) {
                                validationMessages.push("Prime ID \"" + model.PRIM_CUST_ID + "\" is already associated with \"" + x.PRIM_CUST_NM+ "\" Prime Customer");
                        }
                         if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x.PRIM_CUST_NM === model.PRIM_CUST_NM && x.PRIM_LVL_ID === model.PRIM_LVL_ID) {
                             validationMessages.push("For this combination of Prime Id \"" + model.PRIM_CUST_ID + "\" and Prime Customer Name \"" + model.PRIM_CUST_NM + "\" this Level 2 ID already exists");
                        }
                        if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x.PRIM_CUST_NM === model.PRIM_CUST_NM && x.PRIM_CUST_CTRY === model.PRIM_CUST_CTRY) {
                            validationMessages.push("This combination of Prime Id \"" + model.PRIM_CUST_ID + "\" , Prime Customer Name \"" + model.PRIM_CUST_NM + "\" and Prime Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists");
                        }
                         if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x.PRIM_CUST_NM === model.PRIM_CUST_NM && isPrimeIdexist.length === 1 && model.PRIM_SID !== "") {
                             validationMessages.push("\"" + x.PRIM_CUST_NM + "\" Prime Customer Name is already associated with Prime ID \"" + x.PRIM_CUST_ID + "\"");

                         }
                    }
                    else if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x.PRIM_CUST_NM === model.PRIM_CUST_NM && isPrimeIdexist.length < 1) {
                        validationMessages.push("\""+x.PRIM_CUST_NM + "\" Prime Customer Name is already associated with Prime ID \"" + x.PRIM_CUST_ID + "\"");

                    }
                    
                }
            );

            var isPrimeexist = vm.PrimeCustomersData.filter(x => x.PRIME_MBR_SID === parseInt(model.PRIM_CUST_ID) && x.PRIME_LVL_SID === parseInt(model.PRIM_LVL_ID));
            if (model.PRIM_CUST_ID == null || model.PRIM_CUST_ID == '')
                validationMessages.push("Please provide Valid ID");
            if (model.PRIM_CUST_NM == null || model.PRIM_CUST_NM == '') {
                validationMessages.push("Please Provide Valid Prime Customer Name");
            }
            else if (model.PRIM_CUST_NM.length > 65)
                validationMessages.push("Prime Customer Name Length should not be greater than 65 characters");

            if (model.PRIM_LVL_ID == null || model.PRIM_LVL_ID == '')
                validationMessages.push("Please Provide Valid Level 2 ID");
            if (isPrimeexist.length > 1)
                validationMessages.push("This Combination of Prime Custmer ID and Leve 2 ID is already exists")
            if (model.PRIM_CUST_CTRY == null || model.PRIM_CUST_CTRY == '' || vm.countries.filter(x => x.CTRY_NM === model.PRIM_CUST_CTRY).length == 0)
                validationMessages.push("Please Select Valid Country.")
            if (validationMessages.length > 0) {
                
                var RemoveDuplicate = [...new Set(validationMessages)];
                validationMessages = RemoveDuplicate;
                kendo.alert(validationMessages.join("</br>"));
            }
                

            return validationMessages.length == 0;

        }

        vm.PrimeCustNames = {
            placeholder: "Enter Customer Name..",
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
            dataTextField: "PRIM_CUST_NM",
            dataValueField: "PRIM_CUST_NM",
            valuePrimitive: true

        }




        vm.PrimeCustCountry = {
            optionLabel: "Select Customer Country..",
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
            var editor = $('<select kendo-drop-down-list k-options="vm.PrimeCustCountry"  name="' + options.field + '" style="width:100%"></select>').appendTo(container);
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
                    field: "PRIM_SID",
                    title: "Customer ID",
                    hidden: true
                },

                {
                    field: "IS_ACTV",
                    title: "Is Active",
                    width: "10%",
                    filterable: { multi: true, search: false },
                    template: gridUtils.boolViewer('IS_ACTV'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                },

                {
                    field: "PRIM_CUST_ID",
                    title: "Prime ID",
                    width: "200px",
                    editor: vm.PrimeIDEditor,
                    filterable: { multi: true, search: true }

                },
                {
                    field: "PRIM_CUST_NM",
                    title: "Prime Customer Name",
                    width: "230px",
                    //filterable: { multi: true, search: true },
                    //editor: cusNameDropDownEditor
                    editor: vm.PrimeCustNamesEditor,
                    filterable: { multi: true, search: true }
                },

                {
                    field: "PRIM_LVL_ID",
                    title: "Prime L2 ID",
                    width: "200px",
                    editor: vm.PrimeIDL2Editor,
                    filterable: { multi: true, search: true }
                },
                {
                    field: "PRIM_LVL_NM",
                    title: "Prime L2 Customer Name",
                    width: "230px"
                },
                {
                    field: "PRIM_CUST_CTRY",
                    title: "Prime Country",
                    width: "200px",
                    editor: vm.PrimeCustCountryEditor,
                    filterable: { multi: true, search: true }
                },
                {
                    field: "RPL_STS",
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
