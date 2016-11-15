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
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheStatus').then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     //Handle error data which need not to be shown to user
                     // any user messages will be handled in controller where they can be customised as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function clearStaticCache() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheClear').then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled in controller where they can be customised as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function reloadAllStaticCache() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheReload').then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled  in controller where they can be customized as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function loadStaticCacheByName(data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheLoad/' + data.CacheName).then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled  in controller where they can be customized as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function clearStaticCacheByName(data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheClear/' + data.CacheName).then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled  in controller where they can be customized as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function viewStaticCacheByName(data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetCacheView/' + data.CacheName).then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled  in controller where they can be customized as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function getApiCacheStatus() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetApiCacheStatus').then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     //Handle error data which need not to be shown to user
                     // any user messages will be handled in controller where they can be customised as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function clearApiCache() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + 'GetApiCacheClear').then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled in controller where they can be customised as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }

        function clearApiCacheByName(data) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + 'ClearApiCache', data).then(
                 function success(response) {
                     deferred.resolve(response.data);
                 },
                 function error(response) {
                     // Handle error data which need not to be shown to user
                     // any user messages will be handled  in controller where they can be customized as per needs
                     deferred.reject(response);
                 }
            );
            return deferred.promise;
        }
    }
})();