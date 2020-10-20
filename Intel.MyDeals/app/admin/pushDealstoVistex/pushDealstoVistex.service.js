(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('pushDealstoVistexService', pushDealstoVistexService);

    pushDealstoVistexService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function pushDealstoVistexService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/PushDealstoVistex/";

        var service = {
            PushDealstoVistex: PushDealstoVistex
        }

        return service;

        function PushDealstoVistex(data) {
            return dataService.post(apiBaseUrl + 'DealsPushtoVistex', data);
        }
    }
})();