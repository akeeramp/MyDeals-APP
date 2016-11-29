(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('progressInterceptor', progressInterceptor)

    progressInterceptor.$inject = ['$q', '$rootScope', 'logger'];

    function progressInterceptor($q, $rootScope, logger) {

        var xhrRequests = 0;
        var xhrResponses = 0;

        function isLoading() {
            return xhrResponses < xhrRequests;
        }

        function updateStatus() {
            $rootScope.loading = isLoading();
        }

        return {
            request: function (config) {
                xhrRequests++;
                updateStatus();
                return config;
            },
            requestError: function (rejection) {
                xhrResponses++;
                updateStatus();
                logger.error("Error in request", rejection, "Bad Request"); //Not full filled criteria, payload is missing
                return $q.reject(rejection);
            },
            response: function (response) {
                xhrResponses++;
                updateStatus();
                return response;
            },
            responseError: function (rejection) {
                xhrResponses++;
                updateStatus();

                //TODO: Usability will change this implementation
                logger.error("Request resulted in error", rejection, "Internal Server Error", true); //Errors occurred on server.
                
                return $q.reject(rejection);
            }
        }
    }
})();