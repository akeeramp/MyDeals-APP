(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('UnprimedealsController', UnprimedealsController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    UnprimedealsController.$inject = ['PrimeCustomersService', 'dropdownsService', '$scope', 'logger', 'gridConstants', '$uibModal'];

    function UnprimedealsController(PrimeCustomersService, dropdownsService, $scope, logger, gridConstants, $uibModal) {
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
                    id: "WIP_DEAL_OBJ_SID",
                    fields: {
                        CNTRCT_OBJ_SID: { editable: false },
                        OBJ_SID: { editable: false },
                        END_CUSTOMER_RETAIL: { editable: false },
                        END_CUSTOMER_COUNTRY: { editable: false },
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
                logger.error("Unable to get Prime Customers.", response, response.statusText);
            })
        }

        vm.PrimeCustNames = {
            placeholder: "Select Customer Name..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.PrimeCustomersData);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "PRIME_CUST_NM",
            dataValueField: "PRIME_CUST_NM",
            valuePrimitive: true,
            select: onCustomerChange
        }

        vm.PrimeCustNamesEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PrimeCustNames" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
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
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span title="Save" class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span title="Cancel" class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
                {
                    command: [
                        { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span title='Edit' class='k-icon k-i-edit'></span></a>" },
                    ],
                    title: " ",
                    width: "100px"
                },
                {
                    field: "CNTRCT_OBJ_SID",
                    title: "Contract Id",
                    width: "230px"
                },
                {
                    field: "OBJ_SID",
                    title: "Deal ID",
                    width: "230px"
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
                    field: "PRIMED_CUST_NM",
                    title: "Prime Customer",
                    width: "230px",
                    filterable: { multi: true, search: true },
                    editor: vm.PrimeCustNamesEditor
                },
                {
                    field: "PRIMED_CUST_ID",
                    title: "Prime Customer ID",
                    width: "230px"
                },
                {
                    field: "PRIMED_CUST_CNTRY",
                    title: "Prime Country",
                    width: "230px"
                }
            ]
        }

        function onCustomerChange(e) {
            if (e.dataItem != undefined && e.dataItem != null) {
                var PRIMEDCUSTID = e.dataItem.PRIME_MBR_SID;
                var CUSTCNTRY = e.dataItem.PRIME_CUST_COUNTRY;
                var CustID = $("input[name=PRIMED_CUST_ID]").val(PRIMEDCUSTID);
                CustID.trigger("change");
                var Country = $("input[name=PRIMED_CUST_CNTRY]").val(CUSTCNTRY);
                Country.trigger("change");
            }
        }


    }

})();
