(function () {
    'use strict';

    angular
        .module('app')
        .factory('bannerConstantsService', constantsService);

    // Minification safe dependency injection
    constantsService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function constantsService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/AdminConstants/v1/";

        var service = {
            getConstantsByName: getConstantsByName
        }

        return service;

        function getConstantsByName(name) {
            return dataService.get(apiBaseUrl + 'GetConstantsByName/' + name);
        }
    }
})();