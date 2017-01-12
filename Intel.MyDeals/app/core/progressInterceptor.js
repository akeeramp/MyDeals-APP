(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('progressInterceptor', progressInterceptor)

    progressInterceptor.$inject = ['$q', '$rootScope'];

    function progressInterceptor($q, $rootScope) {

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
                if (typeof rejection.data === "string") {
                    logger.error(rejection.data, rejection, "Unexpected Error", true); //Errors occurred on server.
                } else {
                    logger.error("Request resulted in error", rejection, "Internal Server Error", true); //Errors occurred on server.
                }
                
                return $q.reject(rejection);
            }
        }
    }
})();