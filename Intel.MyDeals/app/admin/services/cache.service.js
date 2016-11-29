(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('cacheService', cacheService);

    // Minification safe dependency injection
    cacheService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function cacheService($http, dataService, logger, $q) {

        // defining the base url on top, subsequent calls in the service 
        // will be action methods under this controller    
        var apiBaseUrl = "/api/Cache/v1/";

        var service = {
            getStaticCacheStatus: getStaticCacheStatus,
            clearStaticCache: clearStaticCache,
            reloadAllStaticCache: reloadAllStaticCache,
            loadStaticCacheByName: loadStaticCacheByName,
            clearStaticCacheByName: clearStaticCacheByName,
            viewStaticCacheByName: viewStaticCacheByName,
            getApiCacheStatus: getApiCacheStatus,
            clearApiCache: clearApiCache,
            clearApiCacheByName: clearApiCacheByName
        }

        return service;

        function getStaticCacheStatus() {
            return dataService.get(apiBaseUrl + 'GetCacheStatus');
        }

        function clearStaticCache() {
            return dataService.get(apiBaseUrl + 'GetCacheClear');
        }

        function reloadAllStaticCache() {
            return dataService.get(apiBaseUrl + 'GetCacheReload');
        }

        function loadStaticCacheByName(data) {
            return dataService.get(apiBaseUrl + 'GetCacheLoad/' + data.CacheName);
        }

        function clearStaticCacheByName(data) {
            return dataService.get(apiBaseUrl + 'GetCacheClear/' + data.CacheName);
        }

        function viewStaticCacheByName(data) {
            return dataService.get(apiBaseUrl + 'GetCacheView/' + data.CacheName);
        }

        function getApiCacheStatus() {
            return dataService.get(apiBaseUrl + 'GetApiCacheStatus');
        }

        function clearApiCache() {
            return dataService.get(apiBaseUrl + 'GetApiCacheClear');
        }

        function clearApiCacheByName() {
            return dataService.post(apiBaseUrl + 'ClearApiCache', data);
        }
    }
})();