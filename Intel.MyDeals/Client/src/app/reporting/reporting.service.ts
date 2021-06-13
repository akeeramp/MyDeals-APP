import * as angular from 'angular';

    angular
        .module('app')
        .factory('reportingService', reportingService);

    // Minification safe dependency injection
    reportingService.$inject = ['dataService'];

    function reportingService(dataService) {
        var apiBaseUrl = "api/Reporting/";
        
        var service = {
            getReportData: getReportData
        }

        return service;

        function getReportData() {
            return dataService.get(apiBaseUrl + 'GetReportDashboard');
        }        
    }
