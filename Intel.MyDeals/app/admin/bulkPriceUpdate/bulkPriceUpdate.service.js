(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('bulkPriceUpdateService', bulkPriceUpdateService);

    bulkPriceUpdateService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function bulkPriceUpdateService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/BulkPriceUpdate/";

        var service = {
            UpdatePriceRecord: UpdatePriceRecord,
        }

        return service;

        function UpdatePriceRecord(data) {
            return dataService.post(apiBaseUrl + 'UpdatePriceRecord', data);
        }
    }
})();