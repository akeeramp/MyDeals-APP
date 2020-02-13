(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('vistexcustomermappingService', vistexcustomermappingService);

    vistexcustomermappingService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function vistexcustomermappingService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/VistexCustomerMappings/";

        var service = {
            getVistexCustomersMapList: getVistexCustomersMapList,
            UpdateVistexCustomer: UpdateVistexCustomer
        }

        return service;

        function getVistexCustomersMapList() {
            return dataService.get(apiBaseUrl + 'GetVistexCustomersMapList/false');
        }

        function UpdateVistexCustomer(data) {
            return dataService.post(apiBaseUrl + 'UpdateVistexCustomer', data);
        }
    }
})();