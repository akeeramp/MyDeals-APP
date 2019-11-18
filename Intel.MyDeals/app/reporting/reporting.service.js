(function () {
    'use strict';

    angular
        .module('app.reporting')
        .factory('reportingService', reportingService);

    // Minification safe dependency injection
    reportingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function reportingService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Reporting/";

        var service = {
            getReportData: getReportData
        }

        return service;

        function getReportData() {
            return dataService.get(apiBaseUrl + 'GetReportDashboard');
        }        
    }
})();