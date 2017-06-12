(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('productCorrectorService', productCorrectorService);

    // Minification safe dependency injection
    productCorrectorService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productCorrectorService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Products/";

        var service = {
            FindSuggestedProduct: FindSuggestedProduct
        }

        return service;

        function FindSuggestedProduct(data) {
            return []//;dataService.post(apiBaseUrl + 'FindSuggestedProduct/' + data);
        }
    }
})();