(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexcustomermappingController', VistexcustomermappingController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    VistexcustomermappingController.$inject = ['vistexcustomermappingService', '$scope', 'logger', 'gridConstants']

    function VistexcustomermappingController(vistexcustomermappingService, $scope, logger, gridConstants) {

        $scope.accessAllowed = true;
        if (!(window.usrRole === 'SA' || window.isDeveloper)) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;

        // Variables
        vm.selectedItem = null;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    vistexcustomermappingService.getVistexCustomersMapList()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Customers.", response, response.statusText);
                        });
                },
                update: function (e) {
                    if (e.data.DFLT_PERD_PRFL != null && e.data.DFLT_PERD_PRFL != '' && $("#cmb_DFLT_PERD_PRFL option[value='" + e.data.DFLT_PERD_PRFL + "']").length == 0) {
                        kendo.alert("Please provide valid <b>Period Profile</b>");
                    } else {
                        if (e.data.VISTEX_CUST_FLAG && (e.data.DFLT_PERD_PRFL == null || e.data.DFLT_PERD_PRFL == '')) {
                            kendo.alert("Default value of <b>Period Profile</b> cannot be empty for Vistex customer!");
                        }
                        else {
                            if (e.data.DFLT_AR_SETL_LVL != null && e.data.DFLT_AR_SETL_LVL != '' && $("#cmb_DFLT_AR_SETL_LVL option[value='" + e.data.DFLT_AR_SETL_LVL + "']").length == 0) {
                                kendo.alert("Please select valid <b>AR Settlement</b>")
                            }
                            else {
                                vistexcustomermappingService.UpdateVistexCustomer(e.data)
                                    .then(function (response) {
                                        e.success(response.data);
                                        logger.success("Vistex Customer Mapping updated.");
                                    }, function (response) {
                                        logger.error("Unable to update Vistex Customer Mapping.", response, response.statusText);
                                    });
                            }
                        }
                    }
                },
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
                        DFLT_AR_SETL_LVL: { editable: true, nullable: true }
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
                    read: {
                        url: "/api/Dropdown/GetDropdowns/PERIOD_PROFILE"
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
                    read: {
                        url: "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL"
                    }
                }
            },
            maxSelectedItems: 1,
            autoBind: true,
            dataTextField: "DROP_DOWN",
            dataValueField: "DROP_DOWN",
            valuePrimitive: true
        };

        vm.PeriodProfileDropDownEditor = function (container, options) {
            var editor = $('<select id="cmb_DFLT_PERD_PRFL"  kendo-combo-box k-options="vm.PeriodProfileOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
        }

        vm.ARSettlementLevelDropDownEditor = function (container, options) {
            var AREditor = $('<select id="cmb_DFLT_AR_SETL_LVL"  kendo-combo-box k-options="vm.ARSettlementLevelOptions" name="' + options.field + '" style="width:100%"></select>').appendTo(container);
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
                    width: "6%"
                },
                {
                    field: "CUST_MBR_SID",
                    title: "Customer ID",
                    hidden: true
                },
                {
                    field: "CUST_NM",
                    title: "Customer Name"
                },
                {
                    field: "VISTEX_CUST_FLAG",
                    title: "Is Vistex Customer",
                    width: "20%",
                    template: gridUtils.boolViewer('VISTEX_CUST_FLAG'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" }
                },
                { field: "DFLT_PERD_PRFL", title: "Period Profile", filterable: { multi: true, search: true }, editor: vm.PeriodProfileDropDownEditor },
                { field: "DFLT_AR_SETL_LVL", title: "AR Settlement Level", filterable: { multi: true, search: true }, editor: vm.ARSettlementLevelDropDownEditor }
            ]

        }
    }
})();