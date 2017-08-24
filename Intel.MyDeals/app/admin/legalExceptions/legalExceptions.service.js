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
            userHasAccess: userHasAccess
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

        function userHasAccess() {
            return constantsService.getConstantsByName('PCT_LGL_EXCPT_ROLES').then(function (response) {
                var hasAccess = false;
                if (response.data && !!response.data) {
                    hasAccess = $linq.Enumerable().From(response.data.CNST_VAL_TXT.split(','))
                   .Where(function (x) {
                       return x.trim() == usrWwid;
                   }).ToArray().length > 0;
                }
                return hasAccess;
            });
        }

        return service;
    }
})();