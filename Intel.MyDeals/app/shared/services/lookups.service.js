angular
    .module('app.contract')
    .factory('lookupsService', lookupsService);

// Minification safe dependency injection
lookupsService.$inject = ['$http', 'dataService', 'logger', '$q'];

function lookupsService($http, dataService, logger, $q) {

    // defining the base url on top, subsequent calls in the service 
    // will be action methods under this controller    
    var apiBaseLookupUrl = "/api/Lookups/v1/";

    var service = {
        getLookup: getLookup
    }

    return service;

    function getLookup(cd) {
        return dataService.post(apiBaseLookupUrl + 'GetLookups/' + cd);
    }

}