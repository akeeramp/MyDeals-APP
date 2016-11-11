(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataService', dataService);

    /* @ngInject */
    function dataService($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
         
        };

        return service;       

    }
})();
