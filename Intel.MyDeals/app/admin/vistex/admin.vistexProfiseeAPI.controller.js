(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexProfiseeAPIController', VistexProfiseeAPIController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexProfiseeAPIController.$inject = ['$scope', 'logger', '$timeout', 'dsaService','constantsService']

    function VistexProfiseeAPIController($scope, logger, $timeout, dsaService, constantsService) {
        var vm = this;
        //Developer can see the Screen..
        vm.hasAccess = false;
        vm.isProfiseeVisible = false;
        
        constantsService.getConstantsByName("PRF_MRG_EMP_ID").then(function (data) {
            if (!!data.data) {
                vm.validWWID = data.data.CNST_VAL_TXT === "NA" ? "" : data.data.CNST_VAL_TXT;
                vm.hasAccess = vm.validWWID.indexOf(window.usrDupWwid) > -1 ? true : false;
                vm.isProfiseeVisible = vm.hasAccess;
                if (vm.hasAccess == false) {
                    document.location.href = "/Dashboard#/portal";
                }
            }
        });
        

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
                    if (response.data == true) {
                        logger.success("Customer Migrated to profisee");
                    } else {
                        logger.warning("Something went wrong...");
                    }
                });
            } else {
                logger.warning("Please select Customer name");
            }
        }
    }
})();