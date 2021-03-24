(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('VistexcustomermappingController', VistexcustomermappingController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    VistexcustomermappingController.$inject = ['vistexcustomermappingService', 'dropdownsService', '$scope', 'logger', 'gridConstants', '$uibModal'];

    function VistexcustomermappingController(vistexcustomermappingService, dropdownsService, $scope, logger, gridConstants, $uibModal) {

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
        vm.TenderARSettlementLevel = [];
        vm.SettlementPartner = [];

        vm.InitiateDropDowns = function () {
            dropdownsService.getDropdown('GetDropdowns/PERIOD_PROFILE').then(function (response) {
                vm.PeriodProfile = response.data;
            }, function (response) {
                logger.error("Unable to get period profile.", response, response.statusText);
            });

            dropdownsService.getDropdown('GetDropdownsWithInactives/AR_SETTLEMENT_LVL').then(function (response) {
                vm.ARSettlementLevel = response.data;
                vm.TenderARSettlementLevel = response.data.filter(x => x.ACTV_IND == true);
            }, function (response) {
                logger.error("Unable to get Settlement Levels.", response, response.statusText);
            });

            dropdownsService.getVendorDropDown('GetCustomerVendors/0').then(function (response) {
                vm.SettlementPartner = response.data;
            }, function (response) {
                logger.error("Unable to get Settlement Partner list.", response, response.statusText);
            });
        }

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    vistexcustomermappingService.getVistexCustomersMapList().then(function (response) {
                        e.success(response.data);
                        vm.InitiateDropDowns();
                    }, function (response) {
                        logger.error("Unable to get Customers.", response, response.statusText);
                    });
                },
                update: function (e) {
                    //This funtion is used only to close the editors if the values are valid
                    if (vm.IsValidCustomerMapping(e.data, false))
                        e.success(e.data);
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "CUST_MBR_SID",
                    fields: {
                        CUST_MBR_SID: { editable: false },
                        CUST_NM: { editable: false, nullable: true },
                        VISTEX_CUST_FLAG: { type: "boolean" },
                        DFLT_PERD_PRFL: { editable: true, nullable: true },
                        DFLT_AR_SETL_LVL: { editable: true, nullable: true },
                        DFLT_TNDR_AR_SETL_LVL: { editable: true, nullable: true },
                        DFLT_LOOKBACK_PERD: { editable: true, nullable: true },
                        DFLT_CUST_RPT_GEO: { editable: true, nullable: true },
                        CUST_CIM_ID: { editable: true, nullable: true },
                        DFLT_SETTLEMENT_PARTNER: { editable: true }
                    }
                }
            }
        });

        vm.IsValidCustomerMapping = function (model, isShowPopup) {
            var validationMessages = [];

            if (model.VISTEX_CUST_FLAG && (model.DFLT_PERD_PRFL == null || model.DFLT_PERD_PRFL == ''))
                validationMessages.push("Default value of <b>Period Profile</b> cannot be empty for Vistex customer!");
            if (model.DFLT_PERD_PRFL != null && model.DFLT_PERD_PRFL != '' && vm.PeriodProfile.filter(x => x.DROP_DOWN === model.DFLT_PERD_PRFL).length == 0)
                validationMessages.push("Please provide valid <b>Period Profile</b>");
            if (model.DFLT_AR_SETL_LVL != null && model.DFLT_AR_SETL_LVL != '' && vm.ARSettlementLevel.filter(x => x.DROP_DOWN === model.DFLT_AR_SETL_LVL).length == 0)
                validationMessages.push("Please select a valid <b>Non-Tenders Settlement Level</b>");
            if (model.DFLT_TNDR_AR_SETL_LVL != null && model.DFLT_TNDR_AR_SETL_LVL != '' && vm.TenderARSettlementLevel.filter(x => x.DROP_DOWN === model.DFLT_TNDR_AR_SETL_LVL).length == 0)
                validationMessages.push("Please select a valid <b>Tenders Settlement Level</b>");
            if (model.DFLT_SETTLEMENT_PARTNER != null && model.DFLT_SETTLEMENT_PARTNER != '' && vm.Partner.filter(x => x.BUSNS_ORG_NM === model.DFLT_SETTLEMENT_PARTNER).length == 0)
                validationMessages.push("Please select a valid <b>Settlement Partner</b>")

            if (isShowPopup && validationMessages.length > 0)
                kendo.alert(validationMessages.join("</br>"));

            return validationMessages.length == 0;
        }

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
            placeholder: "Select Settlement Level",
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
            placeholder: "Select Tender Settlement Level",
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

        vm.SettlementPartnerOptions = {
            placeholder: "Select default settlement partner",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.Partner);
                    }
                }
            },

            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "BUSNS_ORG_NM",
            dataValueField: "BUSNS_ORG_NM",
            valuePrimitive: true
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

        vm.SelectedConsumptionReportedGeos = "";
        vm.CustomerReportedGeoDropDownEditor = function (container, options) {
            vm.SelectedConsumptionReportedGeos = options.model.DFLT_CUST_RPT_GEO;
            var editor = $('<input id="txtEditedCustomerReportedGeo" class="k-input k-textbox" ng-readonly="true" type="text" name="' + options.field + '" style= "width:100%" title="' + vm.SelectedConsumptionReportedGeos + '" ng-click="vm.lookupEditorCustPlatformModal(dataItem)">').appendTo(container);
        }

        vm.SettlementPartDropDownEditor = function (container, options) {
            vm.Partner = [];
            vm.Partner = vm.SettlementPartner.filter(x => x.CUST_MBR_SID == options.model.CUST_MBR_SID);
            if (vm.Partner.length == 0) {
                vm.SettlementPartnerOptions.placeholder = 'No Settlement Partners are mapped';   
            }
            
            var editor = $('<select kendo-combo-box k-options="vm.SettlementPartnerOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.CustPlatformModalReportedGeoOptions = {
            title: "Customer Reported Geos",
            uiType: "EMBEDDEDMULTISELECT",
            lookupUrl: "/api/Dropdown/GetDropdownsWithCustomerId/CONSUMPTION_CUST_RPT_GEO/",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            field: 'DFLT_CUST_RPT_GEO',
            enableSelectAll: true,
            enableDeselectAll: true
        };

        vm.lookupEditorCustPlatformModal = function (dataItem) {
            var custPlatformModal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'multiSelectModal',
                controller: 'MultiSelectModalCtrl',
                controllerAs: '$ctrl',
                windowClass: 'multiselect-modal-window',
                size: 'md',

                resolve: {
                    items: function () {
                        return {
                            'label': vm.CustPlatformModalReportedGeoOptions.title,
                            'uiType': vm.CustPlatformModalReportedGeoOptions.uiType,
                            'opLookupUrl': vm.CustPlatformModalReportedGeoOptions.lookupUrl + dataItem.CUST_MBR_SID,
                            'opLookupText': vm.CustPlatformModalReportedGeoOptions.lookupText,
                            'opLookupValue': vm.CustPlatformModalReportedGeoOptions.lookupValue,
                            'enableSelectAll': vm.CustPlatformModalReportedGeoOptions.enableSelectAll,
                            'enableDeselectAll': vm.CustPlatformModalReportedGeoOptions.enableDeselectAll
                        };
                    },
                    cellCurrValues: function () {
                        return vm.SelectedConsumptionReportedGeos.split(",").map(function (item) {
                            return item.trim();
                        });
                    },
                    colName: function () { return vm.CustPlatformModalReportedGeoOptions.field; },
                    isBlendedGeo: function () { return false; }
                }
            });

            custPlatformModal.result.then(function (strSelectedItems) {
                vm.SelectedConsumptionReportedGeos = strSelectedItems;
                $('#txtEditedCustomerReportedGeo').val(strSelectedItems);
                $('#txtEditedCustomerReportedGeo').attr('title', strSelectedItems);
            }, function () { });
        }

        vm.LookBackPeriodEditor = function (container, options) {
            // hard coded value on editor to display all -1 default options as blank. Gets converted back to -1 on save
            if (options.model.DFLT_LOOKBACK_PERD === -1) {
                options.model.DFLT_LOOKBACK_PERD = "";
            }
            var LookBackEditor = $('<input id="Look_Back' + options.field + '" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "#",
                    decimals: 0,
                    min: -1,
                    max: 24
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
            save: function (e) {
                e.model.DFLT_CUST_RPT_GEO = vm.SelectedConsumptionReportedGeos;
                if (e.model.DFLT_LOOKBACK_PERD === null || e.model.DFLT_LOOKBACK_PERD === "") {
                    e.model.DFLT_LOOKBACK_PERD = -1;
                }
                if (vm.IsValidCustomerMapping(e.model, true)) {
                    vistexcustomermappingService.UpdateVistexCustomer(e.model).then(function (response) {
                        logger.success("Vistex Customer Mapping updated.");
                    }, function (response) {
                        logger.error("Unable to update Vistex Customer Mapping.", response, response.statusText);
                    });
                }
            },
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
                    width: "190px",
                    filterable: { multi: true, search: true },
                    editor: vm.PeriodProfileDropDownEditor
                },
                {
                    field: "DFLT_TNDR_AR_SETL_LVL",
                    title: "Tenders Settlement Level",
                    width: "230px",
                    filterable: { multi: true, search: true },
                    editor: vm.TenderARSettlementLevelDropDownEditor
                },
                {
                    field: "DFLT_AR_SETL_LVL",
                    title: "Non-Tenders Settlement Level",
                    width: "230px",
                    filterable: { multi: true, search: true },
                    editor: vm.ARSettlementLevelDropDownEditor
                },
                {
                    field: "DFLT_CUST_RPT_GEO",
                    title: "Consumption Customer Reported Geo",
                    filterable: { multi: true, search: true },
                    template: "<div title='#= DFLT_CUST_RPT_GEO #'>#= DFLT_CUST_RPT_GEO #<div>",
                    editor: vm.CustomerReportedGeoDropDownEditor,
                    hidden: true //Hiding the column temporarily as part of  the user story US695951. This might be enabled in future with full scope of features
                },
                {
                    field: "DFLT_LOOKBACK_PERD",
                    headerTemplate: 'Billing Rolling Lookback Period (Months) <span title="Invoice eligibility time period for rebate payment. Could be a rolling number of months or equal to billings dates. Enter 0 (zero) for deals using billing start and end date."><i class="intelicon-help" style="font-size: 15px !important"></i></span>',
                    //title: "Consumption Lookback Period (Months)",
                    width: "200px",
                    filterable: { multi: true, search: true },
                    editor: vm.LookBackPeriodEditor,
                    template: "<div>#if(DFLT_LOOKBACK_PERD === -1){## ##} else {##:DFLT_LOOKBACK_PERD##}#</div>"
                },
                {
                    field: "CUST_CIM_ID",
                    title: "CIM ID",
                    width: "200px",
                    filterable: { multi: true, search: true }
                },
                {
                    field: "DFLT_SETTLEMENT_PARTNER",
                    title: "Default Settlement Partner",
                    width: "250px",
                    filterable: { multi: true, search: true },
                    editor: vm.SettlementPartDropDownEditor
                }
            ]
        }
    }
})();