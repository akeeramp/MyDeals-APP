(function () {
    'use strict';

    angular
        .module('app.contract')
        .factory('productSelectorService', productSelectorService);

    // Minification safe dependency injection
    productSelectorService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productSelectorService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Products/";
        var service = {
            GetProdDealType: GetProdDealType,
            GetProductSelectorWrapper: GetProductSelectorWrapper,
            TranslateProducts: TranslateProducts,
            GetProductDetails: GetProductDetails,
            GetProductSelectionResults: GetProductSelectionResults,
            GetProductSuggestions: GetProductSuggestions,
            GetCAPForProduct: GetCAPForProduct,
            GetSearchString: GetSearchString,
            GetSuggestions: GetSuggestions,
            GetProductAttributes: GetProductAttributes,
            IsProductExistsInMydeals: IsProductExistsInMydeals,
            GetLegalExceptionProducts: GetLegalExceptionProducts
        }

        return service;

        function TranslateProducts(products, CUST_CD, DEAL_TYPE) {
            return dataService.post(apiBaseUrl + 'TranslateProducts/' + CUST_CD + "/" + DEAL_TYPE, products);
        }

        // This method skips all the translator logic (product split, duplicate and invalid etc etc..) and hits the database
        function GetProductDetails(products, CUST_CD, dealType) {
            return dataService.post(apiBaseUrl + 'SearchProduct/' + CUST_CD + '/' + dealType + '/true', products);
        }

        function GetProdDealType(isForceReGet) {
            var isGetViaAngularCache = true;
            if (isForceReGet) { isGetViaAngularCache = false; }
            return dataService.get(apiBaseUrl + 'GetProdDealType', null, null, isGetViaAngularCache);
        }

        function GetProdSelectionLevel(OBJ_SET_TYPE_SID) {
            return dataService.get(apiBaseUrl + 'GetProdSelectionLevel/' + OBJ_SET_TYPE_SID);
        }

        function GetProductSelectorWrapper(dto) {
            return dataService.post(apiBaseUrl + 'GetProductSelectorWrapper', dto);
        }

        function GetProductSelectionResults(prodSelectionLevels) {
            return dataService.post(apiBaseUrl + 'GetProductSelectionResults', prodSelectionLevels);
        }

        function GetProductSuggestions(searchStringDto) {
            return dataService.post(apiBaseUrl + 'SuggestProductsByDates', searchStringDto);
        }

        function GetCAPForProduct(product) {
            return dataService.post(apiBaseUrl + 'GetCAPForProduct', product);
        }

        function GetSearchString(dto) {
            return dataService.post(apiBaseUrl + 'GetSearchString', dto);
        }

        function GetLegalExceptionProducts(dto) {
            return dataService.post(apiBaseUrl + 'GetLegalExceptionProducts', dto);
        }

        function GetSuggestions(dto, custId, dealType) {
            return dataService.post(apiBaseUrl + 'GetSuggestions/' + custId + '/' + dealType, dto);
        }

        function GetProductAttributes(products) {
            return dataService.post(apiBaseUrl + 'GetProductAttributes', products);
        }

        function IsProductExistsInMydeals(dto) {
            var postObject = { filter: dto }
            return dataService.post(apiBaseUrl + 'IsProductExistsInMydeals', postObject);
        }
    }
})();