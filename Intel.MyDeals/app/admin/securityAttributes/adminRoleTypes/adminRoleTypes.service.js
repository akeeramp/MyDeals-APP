(function () {
	'use strict';
    angular
        .module('app.admin')
        .factory('RoleTypesService', RoleTypesService);

    RoleTypesService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function RoleTypesService($cacheFactory, $q, $http, dataService) {
		var URL = '/api/SecurityAttributes/' // TODO: Maybe put this in a nicer place to reference off of

		return {
		    getRoleTypes: getRoleTypes
			, insertRoleType: insertRoleType
			, updateRoleType: updateRoleType
			, deleteRoleType: deleteRoleType
		}

		function getRoleTypes() {
		    return dataService.get(URL + 'GetAdminRoleTypes');
		}

		function insertRoleType(roleType) {
		    return dataService.post(URL + 'InsertAdminRoleType', roleType);
		}

		function updateRoleType(roleType) {
		    return dataService.put(URL + 'UpdateAdminRoleType', roleType);
		}

		function deleteRoleType(id) {
		    return dataService.Delete(URL + 'DeleteAdminRoleType?id=' + id);
		}
	}
})();
