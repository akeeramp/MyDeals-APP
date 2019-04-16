(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('dataQualityService', dataQualityService);

    // Minification safe dependency injection
    dataQualityService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dataQualityService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/dataquality/";

        var service = {
            GetDataQualityUseCases: GetDataQualityUseCases,
            RunDQ: RunDQ
        }

        return service;

        function GetDataQualityUseCases() {
            return dataService.get(apiBaseUrl + 'GetDataQualityUseCases');
        }

        function RunDQ(useCase) {
            return dataService.post(apiBaseUrl + 'RunDQ', '"' + useCase + '"');
        }
    }
})();