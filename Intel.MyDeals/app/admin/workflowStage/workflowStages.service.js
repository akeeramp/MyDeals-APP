(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('workflowStageService', workflowStageService);

    // Minification safe dependency injection
    workflowStageService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function workflowStageService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/WorkFlow/";

        var service = {
            GetWorkFlowStages: GetWorkFlowStages,
            UpdateWorkflowStages: UpdateWorkflowStages,
            DeleteWorkflowStages: DeleteWorkflowStages,
            SetWorkflowStages: SetWorkflowStages,
            GetWFStgDDLValues: GetWFStgDDLValues,
        }

        return service;

        function GetWorkFlowStages() {
            return dataService.get(apiBaseUrl + 'GetWorkFlowStages');
        }
        function GetWFStgDDLValues() {
            return dataService.get(apiBaseUrl + 'GetWFStgDDLValues');
        }
        function UpdateWorkflowStages(data) {
            return dataService.post(apiBaseUrl + 'UpdateWorkFlowStages', data);
        }
        function SetWorkflowStages(data) {
            return dataService.post(apiBaseUrl + 'SetWorkFlowStages', data);
        }
        function DeleteWorkflowStages(data) {
            return dataService.post(apiBaseUrl + 'DeleteWorkFlowStages', data);
        }
      }
})();