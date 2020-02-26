(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexOutboundController', VistexOutboundController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexOutboundController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexOutboundController($scope, logger, $timeout, dsaService) {
        var vm = this;
        vm.spinnerMessageHeader = "Vistex Logs";
        vm.spinnerMessageDescription = "Please wait while we loading vistex outbound data..";
        vm.isBusyShowFunFact = true;
        vm.Vistex = [];

        vm.init = function () {
            dsaService.getVistexOutBoundData().then(function (response) {
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
                { field: "TransanctionId", title: "Transanction Id", width: "320px", filterable: { multi: true, search: true }, template: "<span>#if(TransanctionId == '00000000-0000-0000-0000-000000000000'){#-#} else {##= TransanctionId ##}#</span>" },
                { field: "DealId", title: "Deal Id", width: "125px", filterable: { multi: true, search: true } },
                { field: "DataBody", title: "JSon", filterable: { multi: true, search: true } }
            ]
        };

        vm.init();
    }
})();