(function () {
    'use strict';
    angular
        .module('app.admin')
        .factory('dataFixService', dataFixService);
    dataFixService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dataFixService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/dataFix/";

        var service = {
            getDataFixActions: getDataFixActions,
            updateDataFix: updateDataFix,
            getDataFixes: getDataFixes
        }

        return service;

        function updateDataFix(data, isExecute) {
            return dataService.post(apiBaseUrl + 'UpdateDataFix/' + isExecute, data);
        }

        function getDataFixActions() {
            return dataService.get(apiBaseUrl + 'GetDataFixActions');
        }

        function getDataFixes() {
            return dataService.get(apiBaseUrl + 'GetDataFixes');
        }
    }
})();