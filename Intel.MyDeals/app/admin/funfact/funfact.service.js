(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('funfactService', funfactService);

    // Minification safe dependency injection
    funfactService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function funfactService($http, dataService, logger, $q) {        
        var apiBaseUrl = "api/Funfact/";

        var service = {
            GetFunfactItems: GetFunfactItems,
            UpdateFunfact: UpdateFunfact,
            DeleteFunfact: DeleteFunfact,
            SetFunfact: SetFunfact,
            GetActiveFunfacts: GetActiveFunfacts
        }

        return service;

        function GetFunfactItems() {
            return dataService.get(apiBaseUrl + 'GetFunfactItems');
        }

        function UpdateFunfact(data) {
            return dataService.post(apiBaseUrl + 'UpdateFunfact', data);
        }

        function SetFunfact(data) {
            return dataService.post(apiBaseUrl + 'SetFunfact', data);
        }

        function DeleteFunfact(data) {
            //TODO: note we cannot delete fun facts right now as the stored proc wasn't made to do so, just flag as inactive for time being,
            return dataService.post(apiBaseUrl + 'DeleteFunfact', data);
        }

        function GetActiveFunfacts() {
            return dataService.get(apiBaseUrl + 'GetActiveFunfacts');
        }
    }
})();