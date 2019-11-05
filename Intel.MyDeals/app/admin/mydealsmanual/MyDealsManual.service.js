(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('MyDealsManualService', MyDealsManualService);

    // Minification safe dependency injection
    MyDealsManualService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function MyDealsManualService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Manuals/";

        var service = {
            GetNavigationItems: GetNavigationItems,
            GetManualPageData: GetManualPageData
        }

        return service;

        function GetNavigationItems() {
            return dataService.get(apiBaseUrl + 'GetNavigationItems');
        }

        function GetManualPageData(pageLink) {
            return dataService.get(apiBaseUrl + 'GetManualPageData/' + pageLink);
        }

    }
})();