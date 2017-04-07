(function () {
    'use strict';
    angular
        .module('app.admin')
        .factory('SecurityEngineService', SecurityEngineService);

    SecurityEngineService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function SecurityEngineService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/SecurityAttributes/';
		
        return {
        	getMasks: getMasks
			, getObjAtrbs: getObjAtrbs
			, getSecurityDropdownData: getSecurityDropdownData
			, saveMapping: saveMapping
        }

        function getMasks() {
        	return dataService.get(URL + 'GetSecurityWrapper');
        }
				
        function getObjAtrbs() {
        	return dataService.get(URL + 'GetObjAtrbs');
        }

        function getSecurityDropdownData() {
        	return dataService.get(URL + 'GetSecurityDropdownData');
        }

        function saveMapping(mappingList) {
        	return dataService.post(URL + 'SaveSecurityMapping', mappingList);
        }
    }
})();
