(function () {
	'use strict';
	angular.module('app.securityAttributes').factory('DealTypesFactory', DealTypesFactory);

	/* @ngInject */
	function DealTypesFactory($cacheFactory, $q, $http) {
		var URL = '/api/SecurityAttributesAPI/' // TODO: Maaybe put this in a nicer place to reference off of
		var cache = $cacheFactory('DealTypes');
		var cacheName = 'DEALTYPES';
		
		return {
			getDealTypes: getDealTypes
			, insertDealType: insertDealType
			, updateDealType: updateDealType
			, deleteDealType: deleteDealType
		}

		function getDealTypes() {
			var deferred = $q.defer();
			var cacheResults = cache.get(cacheName);

			//Check if we have the data already cached
			if (angular.isUndefined(cacheResults) || cacheResults === null) {
				op.ajaxGetWait(URL + 'GetAdminDealTypes', function (data) {
					// Add data to cache
					cache.put(cacheName, data);
					deferred.resolve(data);
				}, function (result) {
					//TODO: log to our own db as well (not only opaque)?
					op.notifyError('Server Error', 'Could not get Deal Types');
					op.error(null, 'Get Deal Types Error - ' + result.responseText);
					deferred.reject(result);
				});
			}
			else {
				// Send back cached data if exists
				deferred.resolve(cacheResults);
			}
			return deferred.promise;
		}


		function insertDealType(dealType) {
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'InsertAdminDealType', dealType, function (data) {
				deferred.resolve(data);
				op.notifySuccess('New dealType added');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('Internal Server Error', 'Unable to insert Deal Type');
				op.error(null, 'Insert Deal Type Error - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function updateDealType(dealType) {
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'UpdateAdminDealType', dealType, function (data) {
				deferred.resolve(data);
				op.notifySuccess('Update successful');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('Server Error', 'Unable to update Deal Type');
				op.error(null, 'Update Deal Type Error - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function deleteDealType(id) {
			var deferred = $q.defer();
			// TODO: Replace the below with op functions if we can get that working...
			$http.delete(URL + 'DeleteAdminDealType?id=' + id).then(
				function success(response) {
					deferred.resolve(response.data);
					op.notifySuccess('Delete successful');
				},
				function error(response) {
					//TODO: log to our own db as well (not only opaque)?
					op.notifyError('Server Error', 'Unable to delete Deal Type');
					op.error(null, 'Delete Deal Type Error - ' + result.responseText);
					deferred.reject(response);
				}
			);
			return deferred.promise;
		}
	}
})();
