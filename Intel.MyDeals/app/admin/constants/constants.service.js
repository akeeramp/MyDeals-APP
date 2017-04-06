(function () {
    'use strict';

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
            getConstantsByName: getConstantsByName
        }

        return service;

        function getConstants() {
            return dataService.get(apiBaseUrl + 'GetConstants/false');
        }

        function updateConstants(data) {
            return dataService.post(apiBaseUrl + 'UpdateConstant', data);
        }

        function insertConstants(data) {
            return dataService.post(apiBaseUrl + 'CreateConstant', data);
        }

        function deleteConstants(data) {
            return dataService.post(apiBaseUrl + 'DeleteConstant', data);
        }

        function getConstantsByName(name) {
            return dataService.get(apiBaseUrl + 'GetConstantsByName/' + name);
        }
    }
})();