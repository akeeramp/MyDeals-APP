(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('VistexcustomermappingController', VistexcustomermappingController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    VistexcustomermappingController.$inject = ['vistexcustomermappingService', 'dropdownsService', '$scope', 'logger', 'gridConstants', '$linq'];

    function VistexcustomermappingController(vistexcustomermappingService, dropdownsService, $scope, logger, gridConstants, $linq) {

        $scope.accessAllowed = true;
        if (!(window.usrRole === 'SA' || window.isDeveloper)) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;
        //Keep as variable to avoid request every time
        vm.PeriodProfile = [];
        vm.ARSettlementLevel = [];

        vm.InitiateDropDowns = function () {
            dropdownsService.getDropdown('GetDropdowns/PERIOD_PROFILE').then(function (response) {
                vm.PeriodProfile = response.data;
            }, function (response) {
                logger.error("Unable to get period profile.", response, response.statusText);
            });

            dropdownsService.getDropdown('GetDropdownsWithInactives/AR_SETTLEMENT_LVL').then(function (response) {
                vm.ARSettlementLevel = response.data;
            }, function (response) {
                logger.error("Unable to get AR Settlement Levels.", response, response.statusText);
            });

            dropdownsService.getDropdown('GetDropdownsWithInactives/AR_SETTLEMENT_LVL').then(function (response) {
                vm.TenderARSettlementLevel = $linq.Enumerable().From(response.data).Where(
                    function (x) {
                        return x.ACTV_IND === true;
                    }).ToArray();
            });
        }

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    vistexcustomermappingService.getVistexCustomersMapList()
                        .then(function (response) {
                            e.success(response.data);
                            vm.InitiateDropDowns();
                        }, function (response) {
                            logger.error("Unable to get Customers.", response, response.statusText);
                        });
                },
                update: function (e) {
                    var validationMessages = [];

                    if (e.data.VistexCustomerInfo.VISTEX_CUST_FLAG && (e.data.VistexCustomerInfo.DFLT_PERD_PRFL == null || e.data.VistexCustomerInfo.DFLT_PERD_PRFL == ''))
                        validationMessages.push("Default value of <b>Period Profile</b> cannot be empty for Vistex customer!");
                    if (e.data.VistexCustomerInfo.DFLT_PERD_PRFL != null && e.data.VistexCustomerInfo.DFLT_PERD_PRFL != '' && vm.PeriodProfile.filter(x => x.DROP_DOWN === e.data.VistexCustomerInfo.DFLT_PERD_PRFL).length == 0)
                        validationMessages.push("Please provide valid <b>Period Profile</b>");
                    if (e.data.VistexCustomerInfo.DFLT_AR_SETL_LVL != null && e.data.VistexCustomerInfo.DFLT_AR_SETL_LVL != '' && vm.ARSettlementLevel.filter(x => x.DROP_DOWN === e.data.VistexCustomerInfo.DFLT_AR_SETL_LVL).length == 0)
                        validationMessages.push("Please select valid <b>AR Settlement</b>");

                    if (validationMessages.length == 0) {
                        vistexcustomermappingService.UpdateVistexCustomer(e.data)
                            .then(function (response) {
                                e.success(response.data);
                                logger.success("Vistex Customer Mapping updated.");
                            }, function (response) {
                                logger.error("Unable to update Vistex Customer Mapping.", response, response.statusText);
                            });
                    } else
                        kendo.alert(validationMessages.join("</br>"));
                },
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "CUST_MBR_SID",
                    fields: {
                        CUST_MBR_SID: { from: "VistexCustomerInfo.CUST_MBR_SID", editable: false },
                        CUST_NM: { from: "VistexCustomerInfo.CUST_NM", editable: false, nullable: true },
                        VISTEX_CUST_FLAG: { from: "VistexCustomerInfo.VISTEX_CUST_FLAG", type: "boolean" },
                        DFLT_PERD_PRFL: { from: "VistexCustomerInfo.DFLT_PERD_PRFL", editable: true, nullable: true },
                        DFLT_AR_SETL_LVL: { from: "VistexCustomerInfo.DFLT_AR_SETL_LVL", editable: true, nullable: true },
                        DFLT_TNDR_AR_SETL_LVL: { from: "VistexCustomerInfo.DFLT_TNDR_AR_SETL_LVL", editable: true, nullable: true },
                        CustomerReportedGeos: { editable: true, nullable: true }
                    }
                }
            }
        });

        vm.PeriodProfileOptions = {
            placeholder: "Select default period profile..",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.PeriodProfile);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "DROP_DOWN",
            dataValueField: "DROP_DOWN",
            valuePrimitive: true
        };

        vm.ARSettlementLevelOptions = {
            placeholder: "Select AR Settlement Level",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.ARSettlementLevel);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "DROP_DOWN",
            dataValueField: "DROP_DOWN",
            valuePrimitive: true
        };

        vm.TenderARSettlementLevelOptions = {
            placeholder: "Select Tender AR Settlement Level",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.TenderARSettlementLevel);
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "DROP_DOWN",
            dataValueField: "DROP_DOWN",
            valuePrimitive: true
        };

        vm.CustomerReportedGeoOptions = {
            id: "cmbCustomerReportedGeo",
            placeholder: "Select Customer Reported Geo",
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: "" //This will be set at runtime based on customer
                    }
                }
            },
            autoBind: true,
            dataTextField: "DROP_DOWN",
            dataValueField: "DROP_DOWN",
            valuePrimitive: true,
            autoClose: false,
            filter: "contains",
            enableSelectAll: true,
            enableDeselectAll: true
        };

        vm.PeriodProfileDropDownEditor = function (container, options) {
            var editor = $('<select kendo-combo-box k-options="vm.PeriodProfileOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.ARSettlementLevelDropDownEditor = function (container, options) {
            var AREditor = $('<select kendo-combo-box k-options="vm.ARSettlementLevelOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.TenderARSettlementLevelDropDownEditor = function (container, options) {
            var TenderAREditor = $('<select kendo-combo-box k-options="vm.TenderARSettlementLevelOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.CustomerReportedGeoDropDownEditor = function (container, options) {
            vm.CustomerReportedGeoOptions.dataSource.transport.read.url = "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_RPT_GEO/" + options.model.CUST_MBR_SID
            var editor = $('<div style="width:100%">'
                + '<div style="text-align:center;" ng-if="vm.CustomerReportedGeoOptions.enableSelectAll || vm.CustomerReportedGeoOptions.enableDeselectAll">'
                + '<button style="width:35%" ng-if="vm.CustomerReportedGeoOptions.enableSelectAll" ng-click="vm.SelecAllCustomerReportedGeos()" class="btn btn-primary">Select All</button>&nbsp;'
                + '<button style="width:35%" ng-click="vm.DeSelecAllCustomerReportedGeos()" ng-if="vm.CustomerReportedGeoOptions.enableDeselectAll" class="btn btn-primary">Deselect All</button></div>'
                + '<div><select kendo-multi-select id="' + vm.CustomerReportedGeoOptions.id + '" k-options="vm.CustomerReportedGeoOptions" name="' + options.field + '"></select></div>'
                + '</div>').appendTo(container);
        }

        vm.SelecAllCustomerReportedGeos = function (CustomerReportedGeos) {
            $.each($('#' + vm.CustomerReportedGeoOptions.id + '_listbox .k-item'), function (index, value) {
                if ($(this).hasClass('k-state-selected') == false)
                    $(this).click();
            });
        }

        vm.DeSelecAllCustomerReportedGeos = function () {
            $.each($('#' + vm.CustomerReportedGeoOptions.id + '_listbox .k-state-selected'), function (index, value) {
                $(this).click();
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
                    field: "CUST_MBR_SID",
                    title: "Customer ID",
                    hidden: true
                },
                {
                    field: "CUST_NM",
                    title: "Customer Name",
                    width: "230px"
                },
                {
                    field: "VISTEX_CUST_FLAG",
                    // Use this pattern for hover-over helps, remove Title:
                    //headerTemplate: 'Is Vistex Customer <span title="This is some definition for a Vistex Customer."><i class="intelicon-help" style="font-size: 15px !important"></i></span>',
                    title: "Is Vistex Customer", 
                    width: "180px",
                    template: gridUtils.boolViewer('VISTEX_CUST_FLAG'),
                    editor: gridUtils.boolViewer('VISTEX_CUST_FLAG'),
                    attributes: { style: "text-align: center;" }
                },
                {
                    field: "DFLT_PERD_PRFL",
                    title: "Period Profile",
                    width: "235px",
                    filterable: { multi: true, search: true },
                    editor: vm.PeriodProfileDropDownEditor
                },
                {
                    field: "DFLT_TNDR_AR_SETL_LVL",
                    title: "Tenders AR Settlement Level",
                    filterable: { multi: true, search: true },
                    editor: vm.TenderARSettlementLevelDropDownEditor
                },
                {
                    field: "DFLT_AR_SETL_LVL",
                    title: "Non-Tenders AR Settlement Level",
                    filterable: { multi: true, search: true },
                    editor: vm.ARSettlementLevelDropDownEditor
                },
                {
                    field: "CustomerReportedGeos",
                    title: "Consumption Customer Reported Geo",
                    template: "<span>{{dataItem.CustomerReportedGeos.join(', ')}}<span>",
                    filterable: { multi: true, search: true },
                    editor: vm.CustomerReportedGeoDropDownEditor
                }
            ]
        }
    }
})();