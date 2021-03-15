(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('customerVendorsService', customerVendorsService);

    // Minification safe dependency injection
    customerVendorsService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function customerVendorsService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/CustomerVendor/";
        var dropdownUrl = "api/Dropdown/";

        return {
            getCustomerDropdowns: getCustomerDropdowns,
            updateCustomerVendor: updateCustomerVendor,
            insertCustomerVendor: insertCustomerVendor,
            getCustomerVendors: getCustomerVendors,
            getVendorsData: getVendorsData
        }

        function getCustomerDropdowns(isForceReGet) {
            var isGetViaAngularCache = true;
            if (isForceReGet) { isGetViaAngularCache = false; }
            return dataService.get(dropdownUrl + 'GetCustomersList', null, null, isGetViaAngularCache);
        }

        function updateCustomerVendor(dropdown) {
            return dataService.put(apiBaseUrl + 'UpdateCustomerVendor', dropdown);
        }

        function insertCustomerVendor(dropdown) {
            return dataService.post(apiBaseUrl + 'InsertCustomerVendor', dropdown);
        }

        function getCustomerVendors() {
            return dataService.get(apiBaseUrl + 'GetCustomerVendors');
        }

        function getVendorsData() {
            return dataService.get(apiBaseUrl + 'GetVendorsData');
        }

    }
})();
