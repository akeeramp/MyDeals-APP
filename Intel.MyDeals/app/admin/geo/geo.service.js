(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('geoService', geoService);

    // Minification safe dependency injection
    geoService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function geoService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Geos/";

        var service = {
            getGeos: getGeos,
        }

        return service;

        function getGeos() {
            // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
            return dataService.get(apiBaseUrl + 'GetGeos/false');
        }
    }
})();