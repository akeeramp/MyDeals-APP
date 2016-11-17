(function () {
	'use strict';
    angular
        .module('app.securityAttributes')
        .factory('RoleTypesService', RoleTypesService);

    RoleTypesService.$inject = ['$cacheFactory', '$q', '$http'];

    function RoleTypesService($cacheFactory, $q, $http) {
		var URL = '/api/SecurityAttributesAPI/' // TODO: Maaybe put this in a nicer place to reference off of
		var cache = $cacheFactory('RoleTypes');
		var cacheName = 'ROLETYPES';
		
		return {
		    getRoleTypes: getRoleTypes
			, insertRoleType: insertRoleType
			, updateRoleType: updateRoleType
			, deleteRoleType: deleteRoleType
		}

		function getRoleTypes() {
			var deferred = $q.defer();
			var cacheResults = cache.get(cacheName);

			//Check if we have the data already cached
			if (angular.isUndefined(cacheResults) || cacheResults === null) {
				op.ajaxGetWait(URL + 'GetAdminRoleTypes', function (data) {
					// Add data to cache
					cache.put(cacheName, data);
					deferred.resolve(data);
				}, function (result) {
					//TODO: log to our own db as well (not only opaque)?
				    op.notifyError('Server Error', 'Could not get Role Types');
					op.error(null, 'Get Role Types Error - ' + result.responseText);
					deferred.reject(result);
				});
			}
			else {
				// Send back cached data if exists
				deferred.resolve(cacheResults);
			}
			return deferred.promise;
		}


		function insertRoleType(roleType) {
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'InsertAdminRoleType', roleType, function (data) {
				deferred.resolve(data);
				op.notifySuccess('New role type added');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('Server Error', 'Unable to insert Role Type');
				op.error(null, 'Insert Role Type Error - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function updateRoleType(roleType) {
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'UpdateAdminRoleType', roleType, function (data) {
				deferred.resolve(data);
				op.notifySuccess('Update successful');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('Server Error', 'Unable to update Role Type');
				op.error(null, 'Update Role Type Error - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function deleteRoleType(id) {
			var deferred = $q.defer();
			// TODO: Replace the below with op functions if we can get that working...
			$http.delete(URL + 'DeleteAdminRoleType?id=' + id).then(
				function success(response) {
					deferred.resolve(response.data);
					op.notifySuccess('Delete successful');
				},
				function error(response) {
					//TODO: log to our own db as well (not only opaque)?
					op.notifyError('Server Error', 'Unable to update Role Type');
					op.error(null, 'Delete Role Type Error - ' + result.responseText);
					deferred.reject(response);
				}
			);
			return deferred.promise;
		}
	}
})();
