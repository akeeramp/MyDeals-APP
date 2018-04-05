(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('productService', productService);

    // Minification safe dependency injection
    productService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Products/";

        var service = {
            getProducts: getProducts,
        }

        return service;

        function getProducts() {
            // TODO: Hard coded 'EIA CPU' as default category, once we decide which drop down controls to use we can hook this
            // up with drop down change event containing product Vertical

            // Getting all the products is a costly operations as it brings ~75K records
            return dataService.get(apiBaseUrl + 'GetProductByCategoryName/EIA CPU/false');
        }
    }
})();