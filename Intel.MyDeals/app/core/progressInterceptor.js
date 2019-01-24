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

                /*
                With app version appended as query param, if there is a version change,
                new html is downloaded from server instead of from disk cache(see chrome network tab for more info).
                Note: Only html files which angular uses should be appended(files inside the folder app), do not append for other html files (which are part of third party packages).
                */

                if (config !== undefined && config.url !== undefined && appVer !== undefined
                        && config.url.endsWith('.html') && (config.url.startsWith('/app/') || config.url.startsWith('app/'))) {
                    config.url = config.url + '?v=' + appVer;
                }

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
                return $q.reject(rejection);
            }
        }
    }
})();