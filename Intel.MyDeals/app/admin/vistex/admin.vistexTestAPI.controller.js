(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexTestAPIController', VistexTestAPIController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexTestAPIController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexTestAPIController($scope, logger, $timeout, dsaService) {
        var vm = this;
        vm.selectedApiID = 1;
        vm.apiList = [];
        vm.apiSelectedCD = "";
        vm.responseData = [];
        vm.numberOfRecrods = 5;
        //API KEY Value Pair
        vm.apiPair = {
            "C": 'GetVistexDFStageData',
            "D": 'GetVistexDealOutBoundData',
            "P": 'GetVistexDFStageData',
            "V": 'GetVistexDataOutBound'
        };
        //Creating API
        vm.apiList.push({ API_ID: 1, API_NM: "Customer ", API_CD: "C" });
        vm.apiList.push({ API_ID: 2, API_NM: "Deal ", API_CD: "D" });
        vm.apiList.push({ API_ID: 3, API_NM: "Product ", API_CD: "P" });
        vm.apiList.push({ API_ID: 4, API_NM: "Product Vertical", API_CD: "V" });

        vm.apiDs = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.apiList);
                }
            }
        });
        vm.vistexApiNames = {
            placeholder: "Select a API...",
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

        vm.runAPI = function () {
            //Getting Selected API
            var comboboxApi = $("#comboApiName").data("kendoComboBox");
            var selectedIndex = comboboxApi._prev;
            if (vm.apiSelectedCD == "") {
                logger.warning('Please select an API to run Simulator...');
            }
            //} else if (vm.apiSelectedCD == 'D') {
            //    logger.warning('Deal API is not ready to be Tested');
            //}
            else {
                vm.callAPI(vm.apiSelectedCD);
            }
        }

        vm.callAPI = function (mode) {
            vm.spinnerMessageHeader = "Test your API";
            vm.spinnerMessageDescription = "Please wait while we are running your API..";
            vm.isBusyShowFunFact = true;
            var startTime = moment(moment.utc().toDate()).local().format('YYYY-MM-DD HH:mm:ss');
            dsaService.callAPI(vm.apiPair[vm.apiSelectedCD], vm.apiSelectedCD).then(function (response) {
                if (response.data) {
                    var endTime = moment(moment.utc().toDate()).local().format('YYYY-MM-DD HH:mm:ss');
                    response.data["START_TIME"] = startTime;
                    response.data["END_TIME"] = endTime;
                    vm.responseData.unshift(response.data);
                    
                    logger.success('Transaction was successful...');
                }
            });
        }
    }
})();