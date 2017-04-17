(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('suggestProductService', suggestProductService);

    // Minification safe dependency injection
    suggestProductService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function suggestProductService($http, dataService, logger, $q) {
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