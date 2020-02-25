(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexController', VistexController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexController($scope, logger, $timeout, dsaService) {
        var vm = this;
        vm.spinnerMessageHeader = "Vistex Logs";
        vm.spinnerMessageDescription = "Please wait while we loading vistex logs..";
        vm.isBusyShowFunFact = true;
        vm.Vistex = [];
        vm.SelectedStatus = '';
        vm.VistexStatuses = [];

        vm.init = function () {
            dsaService.getVistex().then(function (response) {
                vm.Vistex = response.data;
                vm.vistexDataSource.read();
            }, function (response) {
                logger.error("Operation failed");
            });

            dsaService.getVistexStatuses().then(function (response) {
                vm.VistexStatuses = response.data;
                vm.VistexStatusesDataSource.read();
            }, function (response) {
                logger.error("Unable to get statuses of vistex");
            });
        }

        vm.vistexDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Vistex);
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: false },
                        TransanctionId: { editable: false, nullable: true },
                        DealId: { editable: false },
                        ModeLabel: { editable: false },
                        StatusLabel: { editable: true },
                        Message: { editable: true },
                        CreatedOn: { editable: false, nullable: false },
                        SendToPoOn: { editable: false, nullable: true },
                        ProcessedOn: { editable: false, nullable: true },
                    }
                }
            }
        });

        vm.StatusDropDownEditor = function (container, options) {
            vm.SelectedStatus = options.model.StatusLabel;
            var editor = $('<select kendo-drop-down-list k-data-source="vm.VistexStatusesDataSource" k-ng-model="vm.SelectedStatus" style="width:100%"></select>').appendTo(container);
        }

        vm.VistexStatusesDataSource = {
            transport: {
                read: function (e) {
                    e.success(vm.VistexStatuses);
                }
            }
        };

        vm.vistexOptions = {
            dataSource: vm.vistexDataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(true),
            editable: { mode: "inline", confirmation: false },
            pageable: {
                refresh: true
            },
            save: function (e) {
                kendo.alert("Saved (not in DB)");
            },
            edit: function (e) {
                var commandCell = e.container.find("td:eq(1)");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
                {
                    command: [
                        {
                            name: "edit",
                            template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
                        }
                    ],
                    title: " ",
                    width: "70px"
                },
                { field: "TransanctionId", title: "Transanction Id", width: "320px", filterable: { multi: true, search: true }, template: "<span>#if(TransanctionId == '00000000-0000-0000-0000-000000000000'){#-#} else {##= TransanctionId ##}#</span>" },
                { field: "DealId", title: "Deal Id", width: "125px",filterable: { multi: true, search: true } },
                { field: "ModeLabel", title: "Mode", width: "125px", filterable: { multi: true, search: true } },
                { field: "StatusLabel", title: "Status", width: "150px", filterable: { multi: true, search: true }, editor: vm.StatusDropDownEditor },
                { field: "Message", title: "Message", filterable: { multi: true, search: true } },
                { field: "CreatedOn", title: "Created On", width: "125px",filterable: { multi: true, search: true } },
                { field: "SendToPoOn", title: "Send To PO On", width: "125px",filterable: { multi: true, search: true }, template: "<span>#if(SendToPoOn == '1/1/1900'){#-#} else {##= SendToPoOn ##}#</span>" },
                { field: "ProcessedOn", title: "Processed On", width: "125px",filterable: { multi: true, search: true }, template: "<span>#if(ProcessedOn == '1/1/1900'){#-#} else {##= ProcessedOn ##}#</span>" }
            ]
        };

        vm.GetVistexDataBody = function (dataItem) {
            return {
                dataSource: {
                    transport: {
                        read: "/api/DSA/GetVistexAttrCollection/" + dataItem.Id
                    },
                    pageSize: 25
                },
                filterable: true,
                sortable: true,
                selectable: true,
                resizable: true,
                columnMenu: true,
                pageable: {
                    refresh: true
                },
                columns: [
                    { field: "VistexAttribute", title: "Attribute", filterable: { multi: true, search: true } },
                    { field: "Value", title: "Value", filterable: { multi: true, search: true } }
                ]
            }
        }

        vm.init();
    }
})();