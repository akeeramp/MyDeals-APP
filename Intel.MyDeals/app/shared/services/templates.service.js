angular
    .module('app.contract')
    .factory('templatesService', templatesService);

// Minification safe dependency injection
templatesService.$inject = ['$http', 'dataService', 'logger', '$q'];

function templatesService($http, dataService, logger, $q) {

    // defining the base url on top, subsequent calls in the service 
    // will be action methods under this controller    
    var apiBaseTemplateUrl = "/api/Templates/v1/";

    var service = {
        readTemplates: readTemplates
    }

    return service;

    function readTemplates() {
        return dataService.get(apiBaseTemplateUrl + 'GetUiTemplates');
    }

}