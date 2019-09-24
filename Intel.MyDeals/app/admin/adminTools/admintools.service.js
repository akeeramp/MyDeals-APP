(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('adminTools', adminTools);

    // Minification safe dependency injection
    adminTools.$inject = ['dataService', 'logger', '$q'];

    function adminTools(dataService, logger, $q) {
        var apiBaseUrl = "api/dataquality/";

        var service = {
            ExecuteCostGapFiller: ExecuteCostGapFiller
        }

        return service;

        function ExecuteCostGapFiller(startYearQtr, endYearQtr, prodIds) {
            return dataService.post(apiBaseUrl + 'ExecuteCostGapFiller/' + startYearQtr + '/' + endYearQtr, '"' + prodIds + '"');
        }
    }
})();