angular
    .module('app.contract')
    .factory('lookupsService', lookupsService);

// Minification safe dependency injection
lookupsService.$inject = ['dataService'];

function lookupsService(dataService) {
    // defining the base url on top, subsequent calls in the service
    // will be action methods under this controller
    var apiBaseLookupUrl = "/api/Lookups/v1/";

    var service = {
    	getLookup: getLookup,
    	asyncRenderHack: asyncRenderHack
    }

    return service;

    function getLookup(cd) {
        return dataService.post(apiBaseLookupUrl + 'GetLookups/' + cd);
    }

    // HACK: Use this function if you cannot batch your loading with the js setTimeOut hack
    // and you need to render the browser (for displaying loading icons, ect) before 
    // performing a UI-heavy task that would normally lock the browser a few seconds. 
    function asyncRenderHack() {
    	return dataService.get(apiBaseLookupUrl + 'AsyncRenderHack/');
    }
}