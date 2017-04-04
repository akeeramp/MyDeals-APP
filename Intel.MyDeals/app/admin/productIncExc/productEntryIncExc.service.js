(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('productEntryIncExcService', productEntryIncExcService);

    // Minification safe dependency injection
    productEntryIncExcService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function productEntryIncExcService($http, dataService, logger, $q) {
        //var apiBaseUrl = "api/WorkFlow/";
        var apiBaseUrl = "api/Products/";
        var service = {
            FetchAttributeMaster: FetchAttributeMaster,
            SetIncludeAttibute: SetIncludeAttibute,
            SetExcludeAttibute: SetExcludeAttibute            
        }

        return service;
        
        function FetchAttributeMaster() {
            return dataService.post(apiBaseUrl + 'FetchAttributeMaster');
        }

        function SetIncludeAttibute(products) {
            return dataService.post(apiBaseUrl + 'SetIncludeAttibute', products);
        }

        function SetExcludeAttibute(products) {
            return dataService.post(apiBaseUrl + 'SetExcludeAttibute', products);
        }
    }
})();