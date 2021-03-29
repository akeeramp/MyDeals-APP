(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('PrimeCustomersService', PrimeCustomersService);

    PrimeCustomersService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function PrimeCustomersService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/PrimeCustomers/";

        var service = {
            GetPrimeCustomerDetails: GetPrimeCustomerDetails,
            UpdatePrimeCustomer: UpdatePrimeCustomer,
            DeletePrimeCustomer: DeletePrimeCustomer,
            SetPrimeCustomers: SetPrimeCustomers,
            getCountries: getCountries,
            getPrimeCustomers: getPrimeCustomers,
            getUnmappedPrimeCustomerDeals: getUnmappedPrimeCustomerDeals,
            getEndCustomerData: getEndCustomerData
        }

        return service;

        function GetPrimeCustomerDetails() {
            return dataService.get(apiBaseUrl + 'GetPrimeCustomerDetails');
        }

        function UpdatePrimeCustomer(data) {
            return dataService.post(apiBaseUrl + 'UpdatePrimeCustomer', data);
        }

        function SetPrimeCustomers(data) {
            return dataService.post(apiBaseUrl + 'SetPrimeCustomers', data);
        }

        function DeletePrimeCustomer(data) {
            return dataService.post(apiBaseUrl + 'DeletePrimeCustomer', data);
        }

        function getCountries() {
            return dataService.get(apiBaseUrl + 'GetCountries');
        }

        function getPrimeCustomers() {
            return dataService.get(apiBaseUrl + 'GetPrimeCustomers');
        }

        function getUnmappedPrimeCustomerDeals() {
            return dataService.get(apiBaseUrl + 'GetUnPrimeDeals');
        }

        function getEndCustomerData(endCustomerName, endCustomerCountry) {
            return dataService.get(apiBaseUrl + 'GetEndCustomerData/' + endCustomerName + '/' + endCustomerCountry);
        }


    }

})();
