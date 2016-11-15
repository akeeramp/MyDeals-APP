(function () {
    'use strict';
    angular
        .module('app.securityAttributes')
        .factory('ApplicationsFactory', ApplicationsFactory);

    ApplicationsFactory.$inject = ['$cacheFactory', '$q', '$http'];

    function ApplicationsFactory($cacheFactory, $q, $http) {
        var URL = '/api/SecurityAttributesAPI/' // TODO: Maaybe put this in a nicer place to reference off of
        var cache = $cacheFactory('Applications');
        var cacheName = 'APPLICATIONS';

        return {
            getApplications: getApplications
			, insertApplication: insertApplication
			, updateApplication: updateApplication
			, deleteApplication: deleteApplication
        }

        function getApplications() {
            var deferred = $q.defer();
            var cacheResults = cache.get(cacheName);

            //Check if we have the data already cached
            if (angular.isUndefined(cacheResults) || cacheResults === null) {
            	op.ajaxGetWait(URL + 'GetAdminApplications', function (data) {
                    // Add data to cache
                    cache.put(cacheName, data);
                    deferred.resolve(data);
                }, function (result) {
                    //TODO: log to our own db as well (not only opaque)?
                    op.notifyError('Server Error', 'Could not get Applications');
                    op.error(null, 'Get Applications Error - ' + result.responseText);
                    deferred.reject(result);
                });
            }
            else {
                // Send back cached data if exists
                deferred.resolve(cacheResults);
            }
            return deferred.promise;
        }


        function insertApplication(application) {
            var deferred = $q.defer();
            op.ajaxPostWait(URL + 'InsertAdminApplication', application, function (data) {
                deferred.resolve(data);
                op.notifySuccess('New application added');
            }, function (result) {
                //TODO: log to our own db as well (not only opaque)?
                op.notifyError('Server Error', 'Unable to insert Application');
                op.error(null, 'Insert Application Error - ' + result.responseText);
                deferred.reject(result);
            });
            return deferred.promise;
        }


        function updateApplication(application) {
            var deferred = $q.defer();
            op.ajaxPostWait(URL + 'UpdateAdminApplication', application, function (data) {
                deferred.resolve(data);
                op.notifySuccess('Update successful');
            }, function (result) {
                //TODO: log to our own db as well (not only opaque)?
                op.notifyError('Server Error', 'Unable to update Application');
                op.error(null, 'Update Application Error - ' + result.responseText);
                deferred.reject(result);
            });
            return deferred.promise;
        }


        function deleteApplication(id) {
            var deferred = $q.defer();
            // TODO: Replace the below with op functions if we can get that working...
            $http.delete(URL + 'DeleteAdminApplication?id=' + id).then(
				function success(response) {
				    deferred.resolve(response.data);
				    op.notifySuccess('Delete successful');
				},
				function error(response) {
				    //TODO: log to our own db as well (not only opaque)?
				    op.notifyError('Server Error', 'Unable to update Application');
				    op.error(null, 'Delete Application Error - ' + result.responseText);
				    deferred.reject(response);
				}
			);
            return deferred.promise;
        }
    }
})();
