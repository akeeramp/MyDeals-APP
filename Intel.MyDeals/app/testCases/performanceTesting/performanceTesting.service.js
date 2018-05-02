(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('performanceTestingService', performanceTestingService);

    // Minification safe dependency injection
    performanceTestingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function performanceTestingService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Products/";

        var service = {
            FindSuggestedProduct: FindSuggestedProduct
        }

        return service;

        function FindSuggestedProduct(data) {
            debugger;
            return dataService.post(apiBaseUrl + 'FindSuggestedProduct', data);
        }

      }
})();