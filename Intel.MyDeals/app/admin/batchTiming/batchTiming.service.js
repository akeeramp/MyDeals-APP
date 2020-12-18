(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('batchTimingService', batchTimingService);

    // Minification safe dependency injection
    batchTimingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function batchTimingService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Logging/";
       
        var service = {
            getBatchJobTiming: getBatchJobTiming,
        }

        return service;

        function getBatchJobTiming(logType)
        {           
            return dataService.get(apiBaseUrl + 'GetBatchJobTiming' + "/" + logType);
        }
    }
})();