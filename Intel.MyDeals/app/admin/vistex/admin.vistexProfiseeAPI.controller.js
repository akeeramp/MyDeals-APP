(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexProfiseeAPIController', VistexProfiseeAPIController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexProfiseeAPIController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexProfiseeAPIController($scope, logger, $timeout, dsaService) {
        var vm = this;
        //Developer can see the Screen..
        //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.DealstoSend = {};
        vm.selectedApiID = 1;
        vm.vistexApiNames = {};
        vm.customerToSend = "";
        vm.apiDs = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.apiList);
                }
            }
        });
        vm.apiList = [];
        vm.apiPair = {
            "1": 'Yes',
            "0": 'No'
        };
        vm.apiList.push({ API_ID: 1, API_NM: "Yes", API_CD: "1" });
        vm.apiList.push({ API_ID: 2, API_NM: "No", API_CD: "0" });

        vm.vistexApiNames = {
            placeholder: "Select a Value...",
            dataTextField: "API_NM",
            dataValueField: "API_CD",
            valuePrimitive: true,
            autoBind: true,
            autoClose: false,
            dataSource: vm.apiDs,
            select: function (e) {
                if (e.dataItem) {
                    vm.apiSelectedCD = e.dataItem.API_CD;
                }
            }
        };
        vm.runProfiseeAPI = function () {
            if (vm.customerToSend.length > 0) {
                dsaService.callProfiseeApi(vm.customerToSend, vm.selectedApiID.API_CD).then(function (response) {
                    logger.success("Customer Migrated to profisee");
                });
            } else {
                logger.warning("Please select Customer name");
            }
        }
    }
})();