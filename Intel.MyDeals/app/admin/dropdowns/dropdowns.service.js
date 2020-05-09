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
            getCustsDropdowns: getCustsDropdowns,
            updateBasicDropdowns: updateBasicDropdowns,
            deleteBasicDropdowns: deleteBasicDropdowns,
            insertBasicDropdowns: insertBasicDropdowns,
        }

        function getBasicDropdowns(isForceReGet) {
        	var isGetViaAngularCache = true;
        	if (isForceReGet) { isGetViaAngularCache = false; }
        	return dataService.get(apiBaseUrl + 'GetBasicDropdowns', null, null, isGetViaAngularCache);
        }

        function getDealTypesDropdowns(isForceReGet) {
        	var isGetViaAngularCache = true;
        	if (isForceReGet) { isGetViaAngularCache = false; }
        	return dataService.get(apiBaseUrl + 'GetDealTypesDropdowns', null, null, isGetViaAngularCache);
        }

        function getDropdownGroups(isForceReGet) {
            var isGetViaAngularCache = true;
            if (isForceReGet) { isGetViaAngularCache = false; }
            return dataService.get(apiBaseUrl + 'GetDropdownGroups', null, null, isGetViaAngularCache);
        }

        function getCustsDropdowns(isForceReGet) {
            var isGetViaAngularCache = true;
            if (isForceReGet) { isGetViaAngularCache = false; }
            return dataService.get(apiBaseUrl + 'GetCustomersList', null, null, isGetViaAngularCache);
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