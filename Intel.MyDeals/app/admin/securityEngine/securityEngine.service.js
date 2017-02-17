(function () {
    'use strict';
    angular
        .module('app.admin')
        .factory('SecurityEngineService', SecurityEngineService);

    SecurityEngineService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function SecurityEngineService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/SecurityAttributes/' 
		
        return {
        	getMasks: getMasks
			, getDealTypeAtrbs: getDealTypeAtrbs
			, getSecurityDropdownData: getSecurityDropdownData
        }

        function getMasks() {
        	return dataService.get(URL + 'GetSecurityWrapper');
        }
				
        function getDealTypeAtrbs() {
        	return dataService.get(URL + 'GetDealTypeAtrbs');
        }

        function getSecurityDropdownData() {
        	return dataService.get(URL + 'GetSecurityDropdownData');
        }
    }
})();
