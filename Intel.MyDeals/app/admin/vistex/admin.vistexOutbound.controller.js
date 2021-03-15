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
        //Developer can see the Screen..
        //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.spinnerMessageHeader = "Vistex Outbound";
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
                { field: "TransanctionId", title: "Transanction Id", filterable: { multi: true, search: true }, template: "<span>#if(TransanctionId == '00000000-0000-0000-0000-000000000000'){#-#} else {##= TransanctionId ##}#</span>" },
                { field: "DealId", title: "Deal Id", filterable: { multi: true, search: true } }
            ]
        };
        
        vm.GetVistexDataBody = function (dataItem) {
            return {
                dataSource: new kendo.data.DataSource({
                    data: dataItem.VistexAttributes,
                    pageSize: 25
                }),                
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