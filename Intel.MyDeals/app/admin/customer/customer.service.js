(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('customerService', customerService);

    // Minification safe dependency injection
    customerService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function customerService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Customers/";

        var service = {
            getCustomers: getCustomers,
            getMyCustomersNameInfo: getMyCustomersNameInfo
        }

        return service;

        function getCustomers() {
            // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
            return dataService.get(apiBaseUrl + 'GetCustomers/false');
        }

        function getMyCustomersNameInfo() {
            return dataService.get(apiBaseUrl + 'GetMyCustomersNameInfo');
        }
    }
})();