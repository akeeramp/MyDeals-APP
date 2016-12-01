(function () {
    'use strict';
    angular
        .module('app.securityAttributes')
        .factory('DealTypesService', DealTypesService);

    DealTypesService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function DealTypesService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/SecurityAttributesAPI/' // TODO: Maybe put this in a nicer place to reference off of

        return {
            getDealTypes: getDealTypes
			, insertDealType: insertDealType
			, updateDealType: updateDealType
			, deleteDealType: deleteDealType
        }

        function getDealTypes() {
            return dataService.get(URL + 'GetAdminDealTypes');
        }

        function insertDealType(dealType) {
            return dataService.post(URL + 'InsertAdminDealType', dealType);
        }

        function updateDealType(dealType) {
            return dataService.post(URL + 'UpdateAdminDealType', dealType);
        }

        function deleteDealType(id) {
            return dataService.Delete(URL + 'DeleteAdminDealType?id=' + id);
        }
    }
})();
