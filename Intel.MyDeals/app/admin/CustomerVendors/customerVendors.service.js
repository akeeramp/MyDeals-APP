(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('customerVendorsService', customerVendorsService);

    // Minification safe dependency injection
    customerVendorsService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function customerVendorsService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/CustomerVendor/";
        var dropdownUrl = "api/Customers/";

        return {
            getCustomerDropdowns: getCustomerDropdowns,
            updateCustomerVendor: updateCustomerVendor,
            insertCustomerVendor: insertCustomerVendor,
            getCustomerVendors: getCustomerVendors,
            getVendorsData: getVendorsData
        }


        function getCustomerDropdowns(isForceReGet) {
            return dataService.get(dropdownUrl + 'GetMyCustomerNames');
        }

        function updateCustomerVendor(dropdown) {
            return dataService.put(apiBaseUrl + 'UpdateCustomerVendor', dropdown);
        }

        function insertCustomerVendor(dropdown) {
            return dataService.post(apiBaseUrl + 'InsertCustomerVendor', dropdown);
        }

        function getCustomerVendors() {
            return dataService.get(apiBaseUrl + 'GetCustomerVendors/0');
        }

        function getVendorsData() {
            return dataService.get(apiBaseUrl + 'GetVendorsData');
        }

    }
})();
