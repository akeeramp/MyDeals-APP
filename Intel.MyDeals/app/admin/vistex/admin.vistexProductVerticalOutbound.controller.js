(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexProductVerticalOutboundController', VistexProductVerticalOutboundController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexProductVerticalOutboundController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexProductVerticalOutboundController($scope, logger, $timeout, dsaService) {
        var vm = this;
        vm.spinnerMessageHeader = "Vistex Outbound";
        vm.spinnerMessageDescription = "Please wait while we loading product vertical outbound data..";
        vm.isBusyShowFunFact = true;
        vm.Vistex = [];

        vm.init = function () {
            dsaService.getVistexProductVeticalsOutBoundData().then(function (response) {
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
                { field: "TransanctionId", title: "Transanction Id", filterable: { multi: true, search: true }, template: "<span>#if(TransanctionId == '00000000-0000-0000-0000-000000000000'){#-#} else {##= TransanctionId ##}#</span>" }
            ]
        };

        vm.GetVistexDataBody = function (dataItem) {
            return {
                dataSource: new kendo.data.DataSource({
                    data: dataItem.ProductVertical,
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
                    { field: "GDM_PRD_TYPE_NM", title: "Type", filterable: { multi: true, search: true } },
                    { field: "GDM_VRT_NM", title: "Name", filterable: { multi: true, search: true } },
                    { field: "OP_CD", title: "OP Code", filterable: { multi: true, search: true } },
                    { field: "DIV_NM", title: "Division", filterable: { multi: true, search: true } },
                    { field: "DEAL_PRD_TYPE", title: "Deal Type", filterable: { multi: true, search: true } },
                    { field: "PRD_CAT_NM", title: "Category", filterable: { multi: true, search: true } },
                    { field: "ACTV_IND", title: "Is Active?", filterable: { multi: true, search: true }, template: "<span>#if(ACTV_IND){#Yes#} else {#No#}#</span>" },
                    { field: "CRE_DTM", title: "Created On", filterable: { multi: true, search: true } },
                    { field: "CHG_DTM", title: "Updated On", filterable: { multi: true, search: true } }
                ]
            }
        }

        vm.init();
    }
})();