(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('quoteLetterService', quoteLetterService);

    // Minification safe dependency injection
    quoteLetterService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function quoteLetterService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/QuoteLetter/";

        var service = {
            adminGetTemplates: adminGetTemplates,
            adminSaveTemplate: adminSaveTemplate
        }

        return service;

        function adminGetTemplates() {
            return dataService.get(apiBaseUrl + 'AdminGetTemplates');
        }

        function adminSaveTemplate(template) {
            return dataService.put(apiBaseUrl + 'AdminSaveTemplate', template);
        }
    }
})();