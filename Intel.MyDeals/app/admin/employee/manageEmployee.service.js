(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('manageEmployeeService', manageEmployeeService);

    // Minification safe dependency injection
    manageEmployeeService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function manageEmployeeService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/UserPreferences/";

        var service = {
            getEmployeeData: getEmployeeData,
            getCustomers: getCustomers,
            getCustomersFromGeos: getCustomersFromGeos,
            setEmployeeData: setEmployeeData,
        }

        return service;

        function getEmployeeData() {
            return dataService.get(apiBaseUrl + 'GetManageUserData/' + 0); // Passing 0 as a WWID for all users, other services might pass WWID to get specific user records.
        }

        function getCustomers() {
            return dataService.get(apiBaseUrl + 'GetManageUserDataGetCustomers/false');
        }

        function getCustomersFromGeos(geos) {
            return dataService.post(apiBaseUrl + 'GetManageUserDataGetCustomersInGeos', geos);
        }

        function setEmployeeData(data) {
            return dataService.post(apiBaseUrl + 'SetManageUserData', data);
        }

    }
})();