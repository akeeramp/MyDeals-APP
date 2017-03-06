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
            createPCTRules: createPCTRules,
            updatePCTRule: updatePCTRule,
            deletePCTRule: deletePCTRule
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

        function createPCTRules(dto) {
            return dataService.post(apiBaseUrl + 'CreatePCTRule', dto);
        }

        function updatePCTRule(dto) {
            return dataService.post(apiBaseUrl + 'UpdatePCTRule', dto);
        }

        function deletePCTRule(dto) {
            return dataService.post(apiBaseUrl + 'DeletePCTRule', dto);
        }

        return service;
    }
})();