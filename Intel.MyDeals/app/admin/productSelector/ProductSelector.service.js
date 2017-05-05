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
        }

        return service;

        function TranslateProducts(products) {
            return dataService.post(apiBaseUrl + 'TranslateProducts', products);
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

        function GetProductDetails(products)
        {
            return dataService.post(apiBaseUrl + 'GetProductDetails', products);
        }
    }
})();