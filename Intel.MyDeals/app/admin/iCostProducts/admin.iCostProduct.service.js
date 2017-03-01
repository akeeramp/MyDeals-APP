(function () {
    'use strict';

    angular
		.module('app.admin')
		.factory('iCostProductService', iCostProductService);

    // Minification safe dependency injection
    iCostProductService.$inject = ['dataService', 'logger', '$q'];

    function iCostProductService(dataService, logger, $q) {
        var apiBaseUrl = "api/ProductCostTest/";

        var service = {
            getProductCostTestRules: getProductCostTestRules,
            getProductTypeMappings: getProductTypeMappings,
            getProductAttributeValues: getProductAttributeValues,
            savePCTRules: savePCTRules
        }

        function getProductCostTestRules() {
            return dataService.get(apiBaseUrl + 'GetProductCostTestRules');
        }

        function getProductTypeMappings() {
            return dataService.get(apiBaseUrl + 'GetProductTypeMappings');
        }

        function getProductAttributeValues(verticalId) {
            return dataService.get(apiBaseUrl + 'GetProductAttributeValues/' + verticalId);
        }

        function savePCTRules(dto) {
            return dataService.post(apiBaseUrl + 'SavePCTRules', dto);
        }

        return service;
    }
})();