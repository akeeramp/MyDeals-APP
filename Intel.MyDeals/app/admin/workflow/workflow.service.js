(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('workflowService', workflowService);

    // Minification safe dependency injection
    workflowService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function workflowService($http, dataService, logger, $q) {        
        var apiBaseUrl = "api/WorkFlow/";

        var service = {
            GetWorkFlowItems: GetWorkFlowItems,
            UpdateWorkflow: UpdateWorkflow,
            DeleteWorkflow: DeleteWorkflow,
            SetWorkFlows: SetWorkFlows,
        }

        return service;

        function GetWorkFlowItems() {
            return dataService.get(apiBaseUrl + 'GetWorkFlowItems');
        }

        function UpdateWorkflow(data) {
            return dataService.post(apiBaseUrl + 'UpdateWorkflow', data);
        }

        function SetWorkFlows(data) {
            return dataService.post(apiBaseUrl + 'SetWorkFlows', data);
        }

        function DeleteWorkflow(data) {
            return dataService.post(apiBaseUrl + 'DeleteWorkflow', data);
        }
    }
})();