(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('productEntryService', productEntryService);

    // Minification safe dependency injection
    productEntryService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productEntryService($http, dataService, logger, $q) {
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