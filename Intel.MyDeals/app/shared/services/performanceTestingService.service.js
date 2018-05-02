(function () {
    'use strict';

    angular
        .module('app.contract')
        .factory('performanceTestingService', performanceTestingService);

    // Minification safe dependency injection
    performanceTestingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function performanceTestingService($http, dataService, logger, $q) {
        var service = {
            getFirstProduct: getFirstProduct
        }

        return service;

        function getFirstProduct() {
            return dataService.get('api/Products/GetFirstProduct');
        }
    }
})();