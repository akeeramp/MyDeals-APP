(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('legalExceptionService', legalExceptionService);

    // Minification safe dependency injection
    legalExceptionService.$inject = ['$http', 'dataService', 'logger', '$q', 'constantsService', '$linq'];

    function legalExceptionService($http, dataService, logger, $q, constantsService, $linq) {
        var apiBaseUrl = "api/ProductCostTest/";

        var service = {
            getLegalExceptions: getLegalExceptions,
            createLegalException: createLegalException,
            updateLegalException: updateLegalException,
            deleteLegalException: deleteLegalException,
            getVersionDetailsPCTExceptions: getVersionDetailsPCTExceptions,
        }

        function getLegalExceptions(verticalId) {
            return dataService.get(apiBaseUrl + 'GetLegalExceptions');
        }

        function createLegalException(dto) {
            return dataService.post(apiBaseUrl + 'CreateLegalException', dto);
        }

        function updateLegalException(dto) {
            return dataService.post(apiBaseUrl + 'UpdateLegalException', dto);
        }

        function deleteLegalException(dto) {
            return dataService.post(apiBaseUrl + 'DeleteLegalException', dto);
        }

        function getVersionDetailsPCTExceptions(id,excludeCurrVer) {
            return dataService.get(apiBaseUrl + 'GetVersionDetailsPCTExceptions' + "/" + id + "/" + excludeCurrVer);
        }

        function userHasAccess() {
            return true;
        }

        return service;
    }
})();