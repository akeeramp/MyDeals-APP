(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$http'];

    function dataService($http) {
        var isPrimed = false;
        var primePromise;
		
        var service = {
            get: get,
            put: put,
            post: post,
            Delete: Delete // 'delete' is a javascript keyword hence using 'Delete'
        };

        function get(apiUrl, successCallback, errorCallback, isDoAngularCaching) {
        	var isGetFromNgCache = false;

        	// NOTE: Use isDoAngularCaching to speed up UI perfromance of pages that require data from API calls.
        	//		isDoAngularCaching=true will get via angular(Ng) built-in $http caching - thus remove unneccessary API calls and making the app faster.
        	//		BUT note that when the data is cached, any changes the user makes to the data will be forgotten unless  isDoAngularCaching=false or 
        	//		the user refreshes the page, so be careful when using this! I reccomend using it to get data that the user will not change - such as dropdown data.
        	if (isDoAngularCaching == true) {
        		isGetFromNgCache = true;
        	}
        	return $http.get(apiUrl, { cache: isGetFromNgCache }).then(successCallback, errorCallback);
        }

        function put(apiUrl, dto, successCallback, errorCallback) {
            return $http.put(apiUrl, dto, {
                headers: {
                    '__RequestVerificationToken': $http.defaults.headers.common['ReqVerToken']
                }
            }).then(successCallback, errorCallback);
        }

        function post(apiUrl, dto, successCallback, errorCallback) {
            return $http.post(apiUrl, dto, {
                headers: {
                    '__RequestVerificationToken': $http.defaults.headers.common['ReqVerToken']
                }
            }).then(successCallback, errorCallback);

            //return $http.post(apiUrl, dto).then(successCallback, errorCallback);
        }

        function Delete(apiUrl, successCallback, errorCallback) {
            return $http.delete(apiUrl, {
                headers: {
                    '__RequestVerificationToken': $http.defaults.headers.common['ReqVerToken']
                }
            }).then(successCallback, errorCallback);
        }

        return service;
    }
})();
