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
        }

        return service;

        //function getEmployee(wwid, idsid) {
        //    // We do not want show Cached data in Admin screen, thus passing getCachedResults = 'false'
        //    //return dataService.post(apiBaseUrl + 'SetOpUserToken', data);
        //    debugger;
        //    if (wwid !== "" && wwid !== 0)
        //    {
        //        return dataService.get(apiBaseUrl + 'GetOtherUserTokenByWWID/' + wwid);
        //    }
        //    else
        //    {
        //        return dataService.get(apiBaseUrl + 'GetOtherUserTokenByIDSID/' + idsid);
        //    }
        //}

        function getEmployeeData() {
            debugger;
            return dataService.get(apiBaseUrl + 'GetManageUserData/' + 0); // Passing 0 as a WWID for all users, other services might pass WWID to get specific user records.
        }

    }
})();