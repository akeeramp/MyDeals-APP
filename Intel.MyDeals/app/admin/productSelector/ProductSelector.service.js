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
            GetProdSelectionLevel: GetProdSelectionLevel,
            TranslateProducts: TranslateProducts,
            GetProductDetails: GetProductDetails,
            GetProductSelectionLevels: GetProductSelectionLevels,
            GetProductSelectionResults: GetProductSelectionResults
        }

        return service;

        function TranslateProducts(products, CUST_CD) {
            return dataService.post(apiBaseUrl + 'TranslateProducts/' + CUST_CD, products);
        }

        function FetchProducts(products) {
            return dataService.post(apiBaseUrl + 'FetchProducts', products);
        }

        function GetProdDealType() {
            return dataService.get(apiBaseUrl + 'GetProdDealType');
        }

        function GetProdSelectionLevel(OBJ_SET_TYPE_SID) {
            return dataService.get(apiBaseUrl + 'GetProdSelectionLevel/' + OBJ_SET_TYPE_SID);
        }

        function GetProductDetails(products, CUST_CD)
        {
            return dataService.post(apiBaseUrl + 'GetProductDetails/' + CUST_CD, products);
        }

        function GetProductSelectionLevels() {
            return dataService.get(apiBaseUrl + 'GetProductSelectionLevels');
        }

        function GetProductSelectionResults(prodSelectionLevels) {
            return dataService.post(apiBaseUrl + 'GetProductSelectionResults', prodSelectionLevels);
        }
    }
})();