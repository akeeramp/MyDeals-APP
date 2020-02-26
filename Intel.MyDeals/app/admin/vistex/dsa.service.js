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
            updateVistexStatus: updateVistexStatus
        }

        return service;

        function getVistex() {
            return dataService.get(apiBaseUrl + 'GetVistex');
        }

        function getVistexStatuses() {
            return dataService.get(apiBaseUrl + 'GetVistexStatuses');
        }

        function updateVistexStatus(strTransantionId, strVistexStage, strErrorMessage) {
            return dataService.post(apiBaseUrl + 'UpdateVistexStatus/' + strTransantionId + "/" + strVistexStage + "/" + strErrorMessage);
        }
    }
})();