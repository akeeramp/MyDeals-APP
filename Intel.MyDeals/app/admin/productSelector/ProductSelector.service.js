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
            FetchProducts: FetchProducts,
            GetProdDealType: GetProdDealType,
            GetProductSelectorWrapper: GetProductSelectorWrapper,
            TranslateProducts: TranslateProducts,
            GetProductDetails: GetProductDetails,
            GetProductSelectionResults: GetProductSelectionResults,
            GetProductSuggestions: GetProductSuggestions
        }

        return service;

        function TranslateProducts(products, CUST_CD, GEO_MBR_SID) {
            return dataService.post(apiBaseUrl + 'TranslateProducts/' + CUST_CD + "/" + GEO_MBR_SID, products);
        }

        function FetchProducts(products) {
            return dataService.post(apiBaseUrl + 'FetchProducts', products);
        }

        function GetProdDealType(isForceReGet) {
            var isGetViaAngularCache = true;
            if (isForceReGet) { isGetViaAngularCache = false; }
            return dataService.get(apiBaseUrl + 'GetProdDealType', null, null, isGetViaAngularCache);
        }

        function GetProdSelectionLevel(OBJ_SET_TYPE_SID) {
            return dataService.get(apiBaseUrl + 'GetProdSelectionLevel/' + OBJ_SET_TYPE_SID);
        }

        function GetProductDetails(products, CUST_CD) {
            return dataService.post(apiBaseUrl + 'GetProductDetails/' + CUST_CD, products);
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
    }
})();