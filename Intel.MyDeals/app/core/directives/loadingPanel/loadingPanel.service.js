(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('funFactLoadingPanelService', funFactLoadingPanelService);

    // Minification safe dependency injection
    funFactLoadingPanelService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function funFactLoadingPanelService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Funfact/";

        var service = {
            GetActiveFunfacts: GetActiveFunfacts
        }

        return service;

        function GetActiveFunfacts() {
            return dataService.get(apiBaseUrl + 'GetActiveFunfacts');
        }
    }
})();
