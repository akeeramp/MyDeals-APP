(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('oplogService', oplogService);

    // Minification safe dependency injection
    oplogService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function oplogService($http, dataService, logger, $q) {

        // defining the base url on top, subsequent calls in the service 
        // will be action methods under this controller    
        var apiBaseUrl = "api/OpLog/";

        var service = {
            getOpaqueLog: getOpaqueLog,
            getDetailsOpaqueLog: getDetailsOpaqueLog            
        }

        return service;

        function getOpaqueLog(logDate) {
            return dataService.post(apiBaseUrl + 'GetOpaqueLog', logDate);
        }

        function getDetailsOpaqueLog(fileName) {
            return dataService.get(apiBaseUrl + 'GetDetailsOpaqueLog/' + fileName);
        }        
    }
})();