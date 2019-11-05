(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('manageEmployeeService', manageEmployeeService);

    // Minification safe dependency injection
    manageEmployeeService.$inject = ['$http', 'dataService', 'logger', '$q'];

    // Get the ROLE and WWID of the user if needed, SA users get a free pass and get to play with everyone
    var usrWwid = 0;
    var usrRole = "UNKNOWN";
    var usrCustomerAdmin = false;

    usrRole = window.usrRole;
    usrCustomerAdmin = window.isCustomerAdmin;

    if (usrRole === "SA" || usrCustomerAdmin === true)
    {
        usrWwid = window.usrWwid = "0";
    }
    else
    {
        usrWwid = window.usrWwid;
    }

    function manageEmployeeService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/UserPreferences/";

        var service = {
            getEmployeeData: getEmployeeData,
            getCustomers: getCustomers,
            getCustomersFromGeos: getCustomersFromGeos,
            setEmployeeData: setEmployeeData,
            setEmployeeVerticalData: setEmployeeVerticalData
        }

        return service;

        function getEmployeeData() {
            return dataService.get(apiBaseUrl + 'GetManageUserData/' + usrWwid); // Passing 0 as a WWID for all users, other services might pass WWID to get specific user records.
        }

        function getCustomers() {
            return dataService.get(apiBaseUrl + 'GetManageUserDataGetCustomers/false');
        }

        function getCustomersFromGeos(geos) {
            return dataService.get(apiBaseUrl + 'GetManageUserDataGetCustomersInGeos/' + geos);
        }

        function setEmployeeData(data) {
            return dataService.post(apiBaseUrl + 'SetManageUserData', data);
        }

        function setEmployeeVerticalData(data) {
            return dataService.post(apiBaseUrl + 'SetEmployeeVerticalData', data);
        }

    }
})();