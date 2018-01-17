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
            getQuoteLetterTemplates: getQuoteLetterTemplates
        }

        return service;

        function getQuoteLetterTemplates() {
            return dataService.get(apiBaseUrl + 'GetQuoteLetterTemplates');
        }
    }
})();