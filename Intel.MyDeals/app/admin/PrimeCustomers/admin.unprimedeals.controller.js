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
        //GA/SA/Developer can see the Screen..
        //Added By Pulkit Gupta for DE117054
        if (window.usrRole != 'GA' && window.usrRole != 'SA' && window.usrRole != 'FSE' && !window.isCustomerAdmin && window.usrRole != 'RA' && !window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.editAccess = true;

        vm.HasBulkUploadAccess = (window.usrRole == "SA" || window.isDeveloper);

        vm.OpenBulkUploadUnifyModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/admin/PrimeCustomers/bulkUnifyModal.html',
                controller: 'BulkUnifyModelController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdSelector-modal-window'
            });
            modalInstance.rendered.then(function () {
                $("#fileUploader").removeAttr("multiple");
            });
            modalInstance.result.then(function (returnData) {
            }, function () { });
        }

        if ((window.usrRole == "SA" || window.isCustomerAdmin || window.usrRole == "RA") && !window.isDeveloper) {
            vm.editAccess = false;
        }
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
                            'opLookupText': "Text",
                            'opLookupValue': "Value",
                            'clearEndCustomerDisabled': true
                        };
                    },
                    cellCurrValues: function () {
                        return {
                            END_CUST_OBJ: model.END_CUST_OBJ,
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
                    //if all the selected End customer Combinations are unified then update the unified values in the deal level
                    if (endCustomerData.IS_PRIME) {
                        var data = { "IS_PRIMED_CUST": endCustomerData.IS_PRIMED_CUST, "PRIMED_CUST_NM": endCustomerData.PRIMED_CUST_NM, "PRIMED_CUST_ID": endCustomerData.PRIMED_CUST_ID, "PRIMED_CUST_CNTRY": endCustomerData.PRIMED_CUST_CNTRY, "END_CUST_OBJ": endCustomerData.END_CUST_OBJ, "END_CUSTOMER_RETAIL": endCustomerData.END_CUSTOMER_RETAIL }
                        PrimeCustomersService.UpdateUnPrimeDeals(model.OBJ_SID, data).then(function (response) {
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
                    width: "60px",
                    hidden: !vm.editAccess
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
