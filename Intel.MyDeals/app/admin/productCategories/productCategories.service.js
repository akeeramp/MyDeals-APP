(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('productCategoryService', productCategoryService);

    // Minification safe dependency injection
    productCategoryService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productCategoryService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/ProductCategories/";

        return {
        	getCategories: getCategories,
        	//insertCategory: insertCategory,
        	updateCategory: updateCategory,
        }

        function getCategories() {
        	return dataService.get(apiBaseUrl + 'GetProductCategories');
        }

        //function insertCategory(category) {
        //	return dataService.post(apiBaseUrl + 'CreateProductCategory', category);
        //}

        function updateCategory(category) {
        	return dataService.put(apiBaseUrl + 'UpdateProductCategoryBulk', category);
        }
    }
})();