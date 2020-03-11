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
        vm.SelectedStatus = null;
        vm.VistexStatuses = [];
        vm.DealIds = "";
        vm.RegxDealIds = "[0-9,]+$";
        vm.IsDealIdsValid = true;
        vm.EnteredMessage = "";

        vm.init = function () {
            dsaService.getVistexLogs('VISTEX_DEALS').then(function (response) {
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

        vm.SendVistexData = function () {
            if (vm.DealIds != undefined)
                vm.DealIds = vm.DealIds.replace(/ /g, "");
            vm.IsDealIdsValid = vm.DealIds != undefined && vm.DealIds != '';
            if (vm.IsDealIdsValid) {
                var dealIds = vm.DealIds.trim().split(',');
                dealIds = dealIds.filter(x => x.trim() != "");
                if (dealIds.length > 0) {
                    dsaService.sendVistexData(dealIds).then(function (response) {
                        if (response.data.length > 0) {
                            angular.forEach(response.data, function (dataItem) {
                                vm.Vistex.push(dataItem);
                            });
                            vm.vistexDataSource.read();
                            vm.DealIds = "";
                            logger.success("Data has been sent!");
                        } else {
                            logger.error("Unable to send data!");
                        }
                    }, function (response) {
                        logger.error("Unable to send data!");
                    });
                } else {
                    logger.error("There is no Deal ID to send!");
                }
            }
        }

        vm.VistexDealIdKeyUp = function (event) {
            return false;
        }

        vm.UpdateVistexStatus = function (strTransantionId, dealId) {
            if (vm.EnteredMessage == '')
                vm.EnteredMessage = null;
            vm.spinnerMessageDescription = "Please wait while updating the status..";
            dsaService.updateVistexStatus(strTransantionId, vm.SelectedStatus, dealId, vm.EnteredMessage).then(function (response) {
                if (response.data == strTransantionId) {
                    angular.forEach(vm.Vistex.filter(x => x.TransanctionId === response.data), function (dataItem) {
                        dataItem.Status = vm.SelectedStatus;
                        dataItem.Message = vm.EnteredMessage == null ? '' : vm.EnteredMessage;
                    });
                    vm.vistexDataSource.read();
                    logger.success("Status has been updated with the message!");
                } else {
                    logger.error("Unable to update the status!");
                }
            }, function (response) {
                logger.error("Unable to update the status!");
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
                        Status: { editable: true },
                        Message: { editable: true },
                        CreatedOn: { editable: false, nullable: false },
                        SendToPoOn: { editable: false, nullable: true },
                        ProcessedOn: { editable: false, nullable: true },
                    }
                }
            },
            sort: { field: "CreatedOn", dir: "desc" }
        });

        vm.MessageEditor = function (container, options) {
            vm.EnteredMessage = options.model.Message;
            var editor = $('<input class="form-control md" type="text" ng-model="vm.EnteredMessage" placeholder="Enter your message here.." title="Enter your message here.." style="width:95%;">').appendTo(container);
        }

        vm.StatusDropDownEditor = function (container, options) {
            vm.SelectedStatus = options.model.Status;
            var editor = $('<select kendo-drop-down-list k-data-source="vm.VistexStatusesDataSource" k-options="vm.StatusesOptions" k-ng-model="vm.SelectedStatus" style="width:100%"></select>').appendTo(container);
        }

        vm.StatusesOptions = {
            valuePrimitive: true,
            maxSelectedItems: 1,
            autoBind: true
        };

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
                vm.UpdateVistexStatus(e.model.TransanctionId, e.model.DealId);
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
                            template: "<a ng-if='dataItem.TransanctionId != \"00000000-0000-0000-0000-000000000000\"' class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
                        }
                    ],
                    title: " ",
                    width: "70px"
                },
                { field: "TransanctionId", title: "Transanction Id", width: "320px", filterable: { multi: true, search: true }, template: "<span>#if(TransanctionId == '00000000-0000-0000-0000-000000000000'){#-#} else {##= TransanctionId ##}#</span>" },
                { field: "DealId", title: "Deal Id", width: "125px", filterable: { multi: true, search: true } },
                { field: "Status", title: "Status", width: "250px", filterable: { multi: true, search: true }, editor: vm.StatusDropDownEditor },
                { field: "Message", title: "Message", filterable: { multi: true, search: true }, editor: vm.MessageEditor },
                { field: "CreatedOn", title: "Created On", width: "125px", filterable: { multi: true, search: true } },
                { field: "SendToPoOn", title: "Send To PO On", width: "125px", filterable: { multi: true, search: true }, template: "<span>#if(SendToPoOn == '1/1/1900'){#-#} else {##= SendToPoOn ##}#</span>" },
                { field: "ProcessedOn", title: "Processed On", width: "125px", filterable: { multi: true, search: true }, template: "<span>#if(ProcessedOn == '1/1/1900'){#-#} else {##= ProcessedOn ##}#</span>" }
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