(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('adminTools', adminTools);

    // Minification safe dependency injection
    adminTools.$inject = ['dataService', 'logger', '$q'];

    function adminTools(dataService, logger, $q) {
        var apiBaseUrl = "api/dataquality/";
        var apiPostBaseUrl = "api/Contracts/v1/";
        var apiIntegrationUrl = "api/Integration/";

        var service = {
            ExecuteCostGapFiller: ExecuteCostGapFiller,
            ExecutePostTest: ExecutePostTest
        }

        return service;

        function ExecuteCostGapFiller(startYearQtr, endYearQtr, prodIds) {
            return dataService.post(apiBaseUrl + 'ExecuteCostGapFiller/' + startYearQtr + '/' + endYearQtr, '"' + prodIds + '"');
        }

        function ExecutePostTest(jsonDataPacket) {
            return dataService.post(apiIntegrationUrl + 'SaveSalesForceTenderData/', jsonDataPacket);
        }
    }
})();