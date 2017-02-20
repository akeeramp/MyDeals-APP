(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('ProductSelectorService', ProductSelectorService);

    // Minification safe dependency injection
    ProductSelectorService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function ProductSelectorService($http, dataService, logger, $q) {
        //var apiBaseUrl = "api/WorkFlow/";
        var apiBaseUrl = "api/Products/";
        var service = {
            TranslateProducts: TranslateProducts,
        }

        return service;

        function TranslateProducts(products) {
            return dataService.post(apiBaseUrl + 'TranslateProducts', products);
        }
    }
})();