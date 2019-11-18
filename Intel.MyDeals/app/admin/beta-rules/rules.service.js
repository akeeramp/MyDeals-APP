(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('ruleService', ruleService);

    // Minification safe dependency injection
    ruleService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function ruleService($http, dataService, logger, $q) {

        var apiBaseUrl = "api/Rules/";

        var service = {
            getRuleSets: getRuleSets,
            getRuleItemById: getRuleItemById,
            getRuleConditionsByRuleId: getRuleConditionsByRuleId,
            getPassedRuleTasksByRuleId: getPassedRuleTasksByRuleId,
            getFailedRuleTasksByRuleId: getFailedRuleTasksByRuleId,
        }

        return service;

        function getRuleSets() {
            return dataService.get(apiBaseUrl + 'GetRuleSets');
        }

        function getRuleItemById(ruleId) {
            return dataService.get(apiBaseUrl + 'GetRuleItemById/' + ruleId);
        }

        function getRuleConditionsByRuleId(ruleId) {
            return dataService.get(apiBaseUrl + 'getRuleConditionsByRuleId/' + ruleId);
        }

        function getPassedRuleTasksByRuleId(ruleId) {
            return dataService.get(apiBaseUrl + 'getPassedRuleTasksByRuleId/' + ruleId);
        }

        function getFailedRuleTasksByRuleId(ruleId) {
            return dataService.get(apiBaseUrl + 'getFailedRuleTasksByRuleId/' + ruleId);
        }
    }
})();