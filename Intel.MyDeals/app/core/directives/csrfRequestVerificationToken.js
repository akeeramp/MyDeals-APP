//(function () {
//    'use strict';

//    angular
//        .module('app.core')
//        .directive('csrfRequestVerificationToken', csrfRequestVerificationToken);

//    csrfRequestVerificationToken.$inject = ['$http'];

//    function csrfRequestVerificationToken($http) {
//        return function (scope, element, attrs) {
//            $http.defaults.headers.common['RequestVerificationToken'] = attrs.csrfRequestVerificationToken || "no request verification token";
//        }
//    }
//})();

//angular.module('app.core').run(['$http', function ($http) {
//    $http.defaults.headers.common['RequestVerificationToken'] = angular.element("body").attr('csrf-request-verification-token');
//}]);