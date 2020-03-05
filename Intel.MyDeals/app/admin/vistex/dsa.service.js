(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('dsaService', dsaService);

    // Minification safe dependency injection
    dsaService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dsaService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/DSA/";

        var service = {
            getVistex: getVistex,
            getVistexStatuses: getVistexStatuses,
            updateVistexStatus: updateVistexStatus,
            sendVistexData: sendVistexData,
            getVistexOutBoundData: getVistexOutBoundData
        }

        return service;

        function sendVistexData(lstDealIds) {
            return dataService.post(apiBaseUrl + 'SendVistexData', lstDealIds);
        }

        function getVistex() {
            return dataService.get(apiBaseUrl + 'GetVistex');
        }

        function getVistexOutBoundData() {
            return dataService.get(apiBaseUrl + 'GetVistexOutBoundData');
        }

        function getVistexStatuses() {
            return dataService.get(apiBaseUrl + 'GetVistexStatuses');
        }

        function updateVistexStatus(strTransantionId, strVistexStage, dealId, strErrorMessage) {
            return dataService.post(apiBaseUrl + 'UpdateVistexStatus/' + strTransantionId + "/" + strVistexStage + "/" + dealId + "/" + strErrorMessage);
        }
    }
})();