(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('meetCompService', meetCompService);

    // Minification safe dependency injection
    meetCompService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function meetCompService($http, dataService, logger, $q) {        
        var apiBaseUrl = "api/MeetComp/";

        var service = {
            getMeetCompData: getMeetCompData,
            activateDeactivateMeetComp: activateDeactivateMeetComp
        }

        return service;

        function getMeetCompData() {
            return dataService.get(apiBaseUrl + 'GetMeetCompData');
        }  

        function activateDeactivateMeetComp(MEET_COMP_SID, ACTV_IND) {
            return dataService.post(apiBaseUrl + 'ActivateDeactivateMeetComp/' + MEET_COMP_SID + "/" + ACTV_IND );
        }
    }
})();