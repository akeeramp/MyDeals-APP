angular
    .module('app.admin')
    .factory('constantsService', constantsService);

// Minification safe dependency injection
constantsService.$inject = ['$http', 'dataService', 'logger', '$q'];

function constantsService($http, dataService, logger, $q) {

    var apiBaseUrl = "api/AdminConstants/v1/";

    var service = {
        getConstants: getConstants,
        updateConstants: updateConstants,
        deleteConstants: deleteConstants,
        insertConstants: insertConstants,
    }

    return service;

    function getConstants() {
        var deferred = $q.defer();
        $http.get(apiBaseUrl + 'GetConstants').then(
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

    function updateConstants(data) {
        var deferred = $q.defer();
        $http.post(apiBaseUrl + 'UpdateConstant', data).then(
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

    function insertConstants(data) {
        var deferred = $q.defer();
        $http.post(apiBaseUrl + 'CreateConstant', data).then(
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

    function deleteConstants(data) {
        var deferred = $q.defer();
        $http.post(apiBaseUrl + 'DeleteConstant', data).then(
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