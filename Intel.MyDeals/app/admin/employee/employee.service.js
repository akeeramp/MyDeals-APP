(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('employeeService', employeeService);

    // Minification safe dependency injection
    employeeService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function employeeService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/UserPreferences/";

        var service = {
            setEmployees: setEmployees,
        }

        return service;

        function setEmployees(data) {
            // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
            return dataService.post(apiBaseUrl + 'SetOpUserToken', data);
        }
    }
})();