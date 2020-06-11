(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('dealMassUpdateService', dealMassUpdateService);

    dealMassUpdateService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dealMassUpdateService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/DealMassUpdate/";

        var service = {
            UpdateDealsAttrbValue: UpdateDealsAttrbValue
        }

        return service;

        function UpdateDealsAttrbValue(data) {
            return dataService.post(apiBaseUrl + 'UpdateDealsAttrbValue', data);
        }
    }
})();