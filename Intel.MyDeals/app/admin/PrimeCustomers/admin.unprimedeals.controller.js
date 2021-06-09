(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('UnprimedealsController', UnprimedealsController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    UnprimedealsController.$inject = ['PrimeCustomersService', 'dropdownsService', '$scope', 'logger', 'gridConstants', '$uibModal', 'objsetService'];

    function UnprimedealsController(PrimeCustomersService, dropdownsService, $scope, logger, gridConstants, $uibModal, objsetService) {
        $scope.accessAllowed = true;
        var vm = this;

        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    PrimeCustomersService.getUnmappedPrimeCustomerDeals().then(function (response) {
                        e.success(response.data);
                        vm.primeCustomers();
                    }, function (response) {
                        logger.error("Unable to get deals.", response, response.statusText);
                    });
                }

            },
            pageSize: 25,
            schema: {
                model: {
                    id: "OBJ_SID",
                    fields: {
                        CNTRCT_OBJ_SID: { editable: false },
                        TITLE: {editable : false },
                        OBJ_SID: { editable: false },
                        END_CUSTOMER_RETAIL: { editable: false },
                        END_CUSTOMER_COUNTRY: { editable: false },
                        IS_PRIMED_CUST: { editable: false},
                        PRIMED_CUST_CNTRY: { editable: true },
                        PRIMED_CUST_ID: { editable: true },
                        PRIMED_CUST_NM: { editable: true }
                    }
                }
            }
        })

        vm.primeCustomers = function () {
            PrimeCustomersService.getPrimeCustomers().then(function (response) {
                vm.PrimeCustomersData = response.data;
            }, function (response) {
                    logger.error("Unable to get Unified Customers.", response, response.statusText);
            })
        }

        vm.PrimeCustNamesEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustNames" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.lookupEditorEndCustomerRetailModal = function (gridrow, model) {
            var endCustomerRetailModal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'endCustomerRetailModal',
                controller: 'EndCustomerRetailCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {                        
                        return {
                            'label': "End customer/Retail",
                            'uiType': "ComboBox",
                            'opLookupUrl': "/api/PrimeCustomers/GetPrimeCustomers",
                            'opLookupText': "PRIM_CUST_NM",
                            'opLookupValue': "PRIM_CUST_NM",
                            'clearEndCustomerDisabled': true
                        };
                    },
                    cellCurrValues: function () {
                        return {
                            END_CUSTOMER_RETAIL: model.END_CUSTOMER_RETAIL,
                            IS_PRIME: model.IS_PRIMED_CUST,
                            PRIMED_CUST_CNTRY: model.END_CUSTOMER_COUNTRY,
                            PRIMED_CUST_NM: model.PRIMED_CUST_NM,
                            PRIMED_CUST_ID: model.PRIMED_CUST_ID 
                        }
                    },
                    colName: function () {
                        return "END_CUSTOMER_RETAIL";
                    },
                    country: function () {
                        return model.END_CUSTOMER_COUNTRY;
                    },
                    isAdmin: function () {
                        return true;
                    }
                }
            });
            //changing autocomplete to disabled for endcustomer country input to stop showing chrome autofill data
            endCustomerRetailModal.rendered.then(function () {
                $('#DropdownSelections').parent().find("input").attr('autocomplete', 'disabled');
            });
            endCustomerRetailModal.result.then(
                function (endCustomerData) { //returns as an array

                    model.IS_PRIMED_CUST = endCustomerData.IS_PRIME;
                    model.PRIMED_CUST_CNTRY = endCustomerData.PRIMED_CUST_CNTRY;
                    model.PRIMED_CUST_NM = endCustomerData.PRIM_CUST_NM;
                    model.PRIMED_CUST_ID = endCustomerData.PRIM_CUST_ID;
                    if (model.IS_PRIMED_CUST == "1") {
                        var primeCustomerNm = model.PRIMED_CUST_NM;
                        var primeCustomerCtry;
                        var primeCustId;
                        if (model.PRIMED_CUST_CNTRY == "" || model.PRIMED_CUST_CNTRY == undefined) {
                            primeCustomerCtry = null;
                        }
                        else {
                            primeCustomerCtry = model.PRIMED_CUST_CNTRY;
                        }
                        if (model.PRIMED_CUST_ID == "" || model.PRIMED_CUST_ID == undefined) {
                            primeCustId = null;
                        }
                        else {
                            primeCustId = model.PRIMED_CUST_ID;
                        }

                        PrimeCustomersService.UpdateUnPrimeDeals(model.OBJ_SID, primeCustomerNm, primeCustId, primeCustomerCtry).then(function (response) {
                            var commandCell = gridrow.container.find("td:first");
                            commandCell.html("<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>");
                            if (response.data) {
                                kendo.alert("Deal End Customer Unified successfully");
                                vm.dataSource.read();
                            }
                            else {
                                kendo.alert("Selected Customer is not a Unified Customer");
                            }
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to Update UnUnified Deals.", response, response.statusText);
                        });
                    }
                    else {
                        kendo.alert("Selected Customer is not a Unified Customer");
                        var commandCell = gridrow.container.find("td:first");
                        commandCell.html("<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>");
                    }
                },
                function () {
                    var commandCell = gridrow.container.find("td:first");
                    commandCell.html("<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>");
                });

        }

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: false,
            editable: { mode: "inline", confirmation: false },
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            toolbar: gridUtils.clearAllFiltersToolbar(),
            edit: function (e) {
                vm.lookupEditorEndCustomerRetailModal(e, e.model);
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span title="Save" class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span title="Cancel" class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>" },
                    ],
                    title: " ",
                    width: "60px"
                },
                {
                    field: "CNTRCT_OBJ_SID",
                    title: "Contract Id",
                    width: "230px",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "TITLE",
                    title: "Contract/Tender Folio Name",
                    width: "230px"
                },
                {
                    field: "OBJ_SID",
                    title: "Deal ID",
                    width: "230px",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "END_CUSTOMER_RETAIL",
                    title: "End Customer Retail",
                    width: "230px"
                },
                {
                    field: "END_CUSTOMER_COUNTRY",
                    title: "End Customer Country",
                    width: "230px"
                },
                {
                    field: "EMP_WWID",
                    title: "Creator WWID",
                    width: "230px",
                    filterable: { multi: true, search: true }
                }
            ]
        }
    }

})();
