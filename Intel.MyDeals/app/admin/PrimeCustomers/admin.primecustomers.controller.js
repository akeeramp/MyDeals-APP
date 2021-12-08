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
        //RA/CA/SA/Developer can see the Screen..
        //Added By Pulkit Gupta for DE117054
        if (!window.isCustomerAdmin && window.usrRole != 'SA' && window.usrRole != 'RA' && !window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.editAccess = true;
        if (window.usrRole == 'RA' && !window.isDeveloper) {
            vm.editAccess = false;
        }
        vm.countries = [];
        vm.primeCustomers = [];
        vm.RplStatusCodes = [];

        vm.initiateDropdown = function () {
            PrimeCustomersService.getCountries().then(function (response) {
                vm.countries = response.data
            }, function (response) {
                logger.error("Unable to get Countries", response, response.statusText);
            });

            PrimeCustomersService.getPrimeCustomers().then(function (response) {
                vm.primeCustomers = response.data;
            }, function (response) {
                logger.error("Unable to get Unified Customers", response, response.statusText);
            });

            PrimeCustomersService.getRplStatusCodes().then(function (response) {
                vm.RplStatusCodes = response.data
            }, function (response) {
                logger.error("Unable to get RPL status code", response, response.statusText);
            });
        }

        function updatePrimeCustomers(e) {
            PrimeCustomersService.UpdatePrimeCustomer(e.data)
                .then(function (response) {
                    e.success(response.data);
                    logger.success("Unified customer updated.");
                    var primeCustIndex = vm.PrimeCustomersData.findIndex(x => (x.PRIM_SID === parseInt(response.data.PRIM_SID)));
                    vm.PrimeCustomersData[primeCustIndex] = response.data;
                }, function (response) {
                    logger.error("Unable to update Unified customer.", response, response.statusText);
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
                        logger.error("Unable to get Unified customers.", response, response.statusText);
                    });
                },
                update: function (e) {
                    var updatedData = vm.PrimeCustomersData.filter(x => x.PRIM_CUST_ID == e.data.PRIM_CUST_ID && x.PRIM_CUST_NM == e.data.PRIM_CUST_NM &&
                        x.PRIM_LVL_ID == e.data.PRIM_LVL_ID && x.PRIM_LVL_NM == e.data.PRIM_LVL_NM);
                    if (updatedData.length == 1 && updatedData[0].IS_ACTV == e.data.IS_ACTV && updatedData[0].RPL_STS_CD != e.data.RPL_STS_CD) {
                        updatePrimeCustomers(e);
                    }
                    else if (!e.data.IS_ACTV) {
                        kendo.confirm("There may be a chance of deals associated with this combination.<br/><br/> Are you sure want to deactivate this combination?").then(function () {
                            updatePrimeCustomers(e);
                        }).fail(function () {
                            vm.dataSource.cancelChanges();
                        });
                    }
                    else if (e.data.IS_ACTV && vm.IsvalidPrimeCustomer(e.data)) {
                        updatePrimeCustomers(e);
                    }
                },
                create: function (e) {
                    if (vm.IsvalidPrimeCustomer(e.data)) {
                        PrimeCustomersService.SetPrimeCustomers(e.data)
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("New Unified customer added.");
                                vm.PrimeCustomersData[vm.PrimeCustomersData.length] = response.data;
                            }, function (response) {
                                logger.error("Unable to insert Unified customer.", response, response.statusText);
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
                        RPL_STS_CD: { editable: true },
                        IS_ACTV: { type: "boolean", editable: true },
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
                    var x_Prim_Cust_Nm = (x.PRIM_CUST_NM ? x.PRIM_CUST_NM.toLowerCase() : '');
                    var model_Cust_Nm = (model.PRIM_CUST_NM ? model.PRIM_CUST_NM.toLowerCase() : '');
                    var patt = new RegExp("^[\\w .,:'\&-]*$");
                    var res = patt.test(model_Cust_Nm);
                    if (!res) {
                        validationMessages.push("Invalid Character identified in Unified Customer Name. Please remove it and Save.");
                    }
                    else if (isPrimeIdexist.length >= 1 && model.PRIM_SID !== x.PRIM_SID) {
                        if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x_Prim_Cust_Nm !== model_Cust_Nm && model_Cust_Nm != "" && model_Cust_Nm != null && x.IS_ACTV == true) {
                            validationMessages.push("Unified ID \"" + model.PRIM_CUST_ID + "\" is associated with \"" + x.PRIM_CUST_NM + "\" Unified Customer is active");
                        }
                        if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && x.PRIM_LVL_ID === model.PRIM_LVL_ID && x.PRIM_CUST_CTRY != model.PRIM_CUST_CTRY && x.IS_ACTV) {
                            validationMessages.push("For this combination of Unified Id \"" + model.PRIM_CUST_ID + "\" and Unified Customer Name \"" + model.PRIM_CUST_NM + "\" this Level 2 ID already exists in active status");
                        }
                        if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && x.PRIM_LVL_ID == model.PRIM_LVL_ID && x.PRIM_CUST_CTRY === model.PRIM_CUST_CTRY) {
                            validationMessages.push("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists");
                        }
                        else if (x.PRIM_CUST_ID === model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && x.PRIM_LVL_ID != model.PRIM_LVL_ID && x.PRIM_CUST_CTRY === model.PRIM_CUST_CTRY && x.IS_ACTV) {
                            validationMessages.push("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists in active status");
                        }
                        if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && isPrimeIdexist.length === 1 && model.PRIM_SID !== "" && x.IS_ACTV) {
                            validationMessages.push("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active");
                        }
                    }
                    else if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && isPrimeIdexist.length < 1 && x.PRIM_SID !== model.PRIM_SID && model.PRIM_CUST_ID != null && model.PRIM_CUST_ID != "" && x.IS_ACTV) {
                        validationMessages.push("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active");
                    }

                }
            );

            //var isPrimeexist = vm.PrimeCustomersData.filter(x => x.PRIME_MBR_SID === parseInt(model.PRIM_CUST_ID) && x.PRIME_LVL_SID === parseInt(model.PRIM_LVL_ID));
            if (model.PRIM_CUST_ID == null || model.PRIM_CUST_ID == '')
                validationMessages.push("Please provide Valid Unified ID");
            if (model.PRIM_CUST_NM == null || model.PRIM_CUST_NM == '') {
                validationMessages.push("Please Provide Valid Unified Customer Name");
            }
            else if (model.PRIM_CUST_NM.length > 65)
                validationMessages.push("Unified Customer Name Length should not be greater than 65 characters");

            if (model.PRIM_LVL_ID == null || model.PRIM_LVL_ID == '')
                validationMessages.push("Please Provide Valid Level 2 ID");
            //if (isPrimeexist.length > 1)
            //    validationMessages.push("This Combination of Unified Customer ID and Level 2 ID is already exists")
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
            dataTextField: "Text",
            dataValueField: "Value",
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

        vm.PrimeCustRplStatusCodes = {
            optionLabel: "Select RPL status code..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.RplStatusCodes);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "RPL_STS_CD",
            dataValueField: "RPL_STS_CD",
            valuePrimitive: true

        }

        vm.PrimeCustNamesEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustNames" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.PrimeCustCountryEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustCountry"  name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.PrimeCustRplStatusCodeEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustRplStatusCodes"  name="' + options.field + '" style="width:100%"></select>').appendTo(container);
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
            toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(!(vm.editAccess)),
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
                    width: "100px",
                    hidden: !vm.editAccess
                },
                {
                    field: "PRIM_SID",
                    title: "Customer ID",
                    hidden: true
                },

                {
                    field: "IS_ACTV",
                    title: "Is Active",
                    width: "200px",
                    template: gridUtils.boolViewer('IS_ACTV'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                },

                {
                    field: "PRIM_CUST_ID",
                    title: "Unified Customer Id",
                    width: "200px",
                    editor: vm.PrimeIDEditor,
                    filterable: { multi: true, search: true },
                    editable: isEditable

                },
                {
                    field: "PRIM_CUST_NM",
                    title: "Unified Customer Name",
                    width: "230px",
                    //filterable: { multi: true, search: true },
                    //editor: cusNameDropDownEditor
                    editor: vm.PrimeCustNamesEditor,
                    filterable: { multi: true, search: true },
                    editable: isEditable
                },

                {
                    field: "PRIM_LVL_ID",
                    title: "Country Customer Id",
                    width: "200px",
                    editor: vm.PrimeIDL2Editor,
                    filterable: { multi: true, search: true },
                    editable: isEditable
                },
                {
                    field: "PRIM_LVL_NM",
                    title: "Country Customer Name",
                    width: "230px"
                },
                {
                    field: "PRIM_CUST_CTRY",
                    title: "Unified Country",
                    width: "200px",
                    editor: vm.PrimeCustCountryEditor,
                    filterable: { multi: true, search: true },
                    editable: isEditable
                },
                {
                    field: "RPL_STS_CD",
                    title: "RPL Status Code",
                    width: "200px",
                    editor: vm.PrimeCustRplStatusCodeEditor,
                    filterable: { multi: true, search: true },
                    editable: isRplEditable
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

        function isEditable(e) {
            // If it is new record editable is set to true else false
            if (e.PRIM_SID == "") {
                return true;
            }
            return false;
        }

        function isRplEditable(e) {
            if (window.isDeveloper || (window.usrRole == "SA" && !window.isCustomerAdmin)) {
                if (e.PRIM_SID != "")
                    return true;
            }
            return false;
        }
    }

})();
