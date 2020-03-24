(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('dsaService', dsaService);

    // Minification safe dependency injection
    dsaService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dsaService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/DSA/";
        var vistexApiBase = "api/VistexService/";

        var service = {
            getVistexLogs: getVistexLogs,
            getVistexStatuses: getVistexStatuses,
            updateVistexStatus: updateVistexStatus,
            sendVistexData: sendVistexData,
            getVistexOutBoundData: getVistexOutBoundData,
            getVistexProductVeticalsOutBoundData: getVistexProductVeticalsOutBoundData,
            callAPI: callAPI
        }

        return service;

        function sendVistexData(lstDealIds) {
            return dataService.post(apiBaseUrl + 'SendVistexData', lstDealIds);
        }

        function getVistexLogs(strVistexMode) {
            return dataService.get(apiBaseUrl + 'GetVistexLogs/' + strVistexMode);
        }

        function getVistexOutBoundData() {
            return dataService.get(apiBaseUrl + 'GetVistexDealOutBoundData');
        }

        function getVistexProductVeticalsOutBoundData() {
            return dataService.get(apiBaseUrl + 'GetVistexProductVeticalsOutBoundData');
        }

        function getVistexStatuses() {
            return dataService.get(apiBaseUrl + 'GetVistexStatuses');
        }

        function updateVistexStatus(strTransantionId, strVistexStage, dealId, strErrorMessage) {
            return dataService.post(apiBaseUrl + 'UpdateVistexStatus/' + strTransantionId + "/" + strVistexStage + "/" + dealId + "/" + strErrorMessage);
        }

        function callAPI(apiName, runMode) {           
            if (runMode == "V") {
                return dataService.get(vistexApiBase + apiName + '/PROD_VERT_RULES');
            } else {
                return dataService.get(vistexApiBase + apiName + '/' + runMode);
            }
            
        }
    }
})();