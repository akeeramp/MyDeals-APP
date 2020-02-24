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
            getVistex: getVistex
        }

        return service;

        function getVistex() {
            return dataService.get(apiBaseUrl + 'GetVistex');
        }
    }
})();