(function () {
	'use strict';
	angular.module('app.securityAttributes').factory('SecurityActionsFactory', SecurityActionsFactory);

	/* @ngInject */
	function SecurityActionsFactory($cacheFactory, $q, $http) {
		var URL = '/api/SecurityAttributesAPI/' // TODO: Maaybe put this in a nicer place to reference off of
		var cache = $cacheFactory('SecurityAttributes');
		var cacheName = 'SECURITYACTIONS';
		
		return {
			getActions: getActions
			, insertAction: insertAction
			, updateAction: updateAction
			, deleteAction: deleteAction
		}

		function getActions() {
			var deferred = $q.defer();
			var cacheResults = cache.get(cacheName);

			//Check if we have the data already cached
			if (angular.isUndefined(cacheResults) || cacheResults === null) {
				op.ajaxGetWait(URL + 'GetSecurityActions', function (data) {
					// Add data to cache
					cache.put(cacheName, data);
					deferred.resolve(data);
				}, function (result) {
					//TODO: log to our own db as well (not only opaque)?
					op.notifyError('500: Internal Server Error', 'Could not get Security Actions');
					op.error(null, 'cSharpAPIExceptionExample - ' + result.responseText);
					deferred.reject(result);
				});
			}
			else {
				// Send back cached data if exists
				deferred.resolve(cacheResults);
			}
			return deferred.promise;
		}


		function insertAction(action) {
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'InsertAction', action, function (data) {
				deferred.resolve(data);
				op.notifySuccess('New action added');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('500: Internal Server Error', 'Unable to insert Security Action');
				op.error(null, 'cSharpAPIExceptionExample - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function updateAction(action) {			
			var deferred = $q.defer();
			op.ajaxPostWait(URL + 'UpdateAction', action, function (data) {
				deferred.resolve(data);
				op.notifySuccess('Update successful');
			}, function (result) {
				//TODO: log to our own db as well (not only opaque)?
				op.notifyError('500: Internal Server Error', 'Unable to update Security Action');
				op.error(null, 'cSharpAPIExceptionExample - ' + result.responseText);
				deferred.reject(result);
			});
			return deferred.promise;
		}


		function deleteAction(id) {
			var deferred = $q.defer();
			// TODO: Replace the below with op functions if we can get that working...
			$http.delete(URL + 'DeleteAction?id='+id).then(
				function success(response) {
					deferred.resolve(response.data);
					op.notifySuccess('Delete successful');
				},
				function error(response) {
					//TODO: log to our own db as well (not only opaque)?
					op.notifyError('500: Internal Server Error', 'Unable to update Security Action');
					op.error(null, 'cSharpAPIExceptionExample - ' + result.responseText);
					deferred.reject(response);
				}
			);
			return deferred.promise;
		}
	}
})();
