(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('quoteLetterService', quoteLetterService);

    // Minification safe dependency injection
    quoteLetterService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function quoteLetterService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Products/";

        var service = {
            GetProductsFromAlias: GetProductsFromAlias,
            UpdateProductAlias: UpdateProductAlias,
            DeleteProductAlias: DeleteProductAlias,
            CreateProductAlias: CreateProductAlias
        }

        return service;

        function GetProductsFromAlias() {
            return dataService.get(apiBaseUrl + 'GetProductsFromAlias/false');
        }

        function UpdateProductAlias(data) {
            return dataService.post(apiBaseUrl + 'UpdateProductAlias', data);
        }

        function CreateProductAlias(data) {
            return dataService.post(apiBaseUrl + 'CreateProductAlias', data);
        }

        function DeleteProductAlias(data) {
            return dataService.post(apiBaseUrl + 'DeleteProductAlias', data);
        }
    }
})();