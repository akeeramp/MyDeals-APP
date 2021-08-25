(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('consumptionCountryService', consumptionCountryService);

    consumptionCountryService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function consumptionCountryService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/ConsumptionCountry/";
        var dropdownUrl = "api/PrimeCustomers/";

        var service = {
            getConsumptionCountry: getConsumptionCountry,
            updateConsumptionCountry: updateConsumptionCountry,
            insertConsumptionCountry: insertConsumptionCountry,
            getCountryList: getCountryList

        }

        return service;

        function getConsumptionCountry() {
            return dataService.get(apiBaseUrl + 'GetConsumptionCountry/false');
        }

        function getCountryList() {
            return dataService.get(dropdownUrl + 'GetCountries');
        }
        function updateConsumptionCountry(dropdown) {
            return dataService.put(apiBaseUrl + 'UpdateConsumptionCountry', dropdown);
        }

        function insertConsumptionCountry(dropdown) {
            return dataService.post(apiBaseUrl + 'InsertConsumptionCountry', dropdown);
        }

    }
})();
