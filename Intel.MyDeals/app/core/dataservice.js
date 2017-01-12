(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$http'];

    function dataService($http) {
        var isPrimed = false;
        var primePromise;

        var service = {
            get: get,
            put: put,
            post: post,
            Delete: Delete // 'delete' is a javascript keyword hence using 'Delete'
        };

        function get(apiUrl, successCallback, errorCallback) {
            return $http.get(apiUrl).then(successCallback, errorCallback);
        }

        function put(apiUrl, dto, successCallback, errorCallback) {
            return $http.put(apiUrl, dto).then(successCallback, errorCallback);
        }

        function post(apiUrl, dto, successCallback, errorCallback) {
            return $http.post(apiUrl, dto).then(successCallback, errorCallback);
        }

        function Delete(apiUrl, successCallback, errorCallbackl) {
            return $http.delete(apiUrl).then(successCallback, errorCallback);
        }

        return service;
    }
})();
