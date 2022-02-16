(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('validateVistexR3ChecksService', validateVistexR3ChecksService);

    validateVistexR3ChecksService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function validateVistexR3ChecksService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/ValidateVistexR3Checks/"; 

        var service = {
            ValidateVistexR3Checks: ValidateVistexR3Checks
        }

        return service;

        function ValidateVistexR3Checks(data) {
            return dataService.post(apiBaseUrl + 'VistexR3Checks', data); //'DealsPushtoVistex', data);
        }
    }
})();