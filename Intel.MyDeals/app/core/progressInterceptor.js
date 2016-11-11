angular
    .module('app.core')
    .factory('progressInterceptor', progressInterceptor)

progressInterceptor.$inject = ['$q', '$rootScope'];

function progressInterceptor($q, $rootScope) {

    // This service will intercept all the https requests, shows the loading gif
    //

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
            return $q.reject(rejection);
        }
    }
}