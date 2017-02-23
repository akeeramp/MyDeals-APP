(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('dropdownsService', dropdownsService);

    // Minification safe dependency injection
    dropdownsService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function dropdownsService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Dropdown/";

        return {
            getBasicDropdowns: getBasicDropdowns,
            getDealTypesDropdowns: getDealTypesDropdowns,
            getDropdownGroups: getDropdownGroups,
            updateBasicDropdowns: updateBasicDropdowns,
            deleteBasicDropdowns: deleteBasicDropdowns,
            insertBasicDropdowns: insertBasicDropdowns,
        }

        function getBasicDropdowns() {
        	return dataService.get(apiBaseUrl + 'GetBasicDropdowns');
        }

        function getDealTypesDropdowns() {
            return dataService.get(apiBaseUrl + 'GetDealTypesDropdowns');
        }

        function getDropdownGroups() {
            return dataService.get(apiBaseUrl + 'GetDropdownGroups');
        }

        function updateBasicDropdowns(dropdown) {
            return dataService.put(apiBaseUrl + 'UpdateBasicDropdowns', dropdown);
        }

        function deleteBasicDropdowns(id) {
            return dataService.Delete(apiBaseUrl + 'DeleteBasicDropdowns/' + id);
        }

        function insertBasicDropdowns(dropdown) {
            return dataService.post(apiBaseUrl + 'InsertBasicDropdowns', dropdown);
        }
    }
})();