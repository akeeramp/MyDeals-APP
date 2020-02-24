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

        vm.init = function () {
            dsaService.getVistex().then(function (response) {
                vm.Vistex = response.data;
                vm.vistexDataSource.read();
            }, function (response) {
                logger.error("Operation failed");
            });
        }

        vm.vistexDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Vistex);
                }
            },
            pageSize: 25
        });

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
            pageable: {
                refresh: true
            },
            columns: [
                { field: "TransanctionId", title: "Trans Id", filterable: { multi: true, search: true } },
                { field: "DealId", title: "Deal Id", filterable: { multi: true, search: true } },
                { field: "ModeLabel", title: "Mode", filterable: { multi: true, search: true } },
                { field: "StatusLabel", title: "Status", filterable: { multi: true, search: true } },
                { field: "Message", title: "Message", filterable: { multi: true, search: true } },
                { field: "CreatedOn", title: "Created On", filterable: { multi: true, search: true } },
                { field: "SendToPoOn", title: "Send To PO On", filterable: { multi: true, search: true } },
                { field: "ProcessedOn", title: "Processed On", filterable: { multi: true, search: true } }
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