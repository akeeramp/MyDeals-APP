(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('vistexcustomermappingService', vistexcustomermappingService);

    vistexcustomermappingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function vistexcustomermappingService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/VistexCustomerMapping/";

        var service = {
            getVistexCustomersMapList: getVistexCustomersMapList,
        }

        return service;

        function getVistexCustomersMapList() {
            return dataService.get(apiBaseUrl + 'GetVistexCustomersMapList/false');
        }
    }
})();