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
            getPriceRules: getPriceRules,
            updatePriceRule: updatePriceRule,
            getRuleSimulationResults: getRuleSimulationResults,
            getPriceRulesConfig: getPriceRulesConfig,
            isDuplicateTitle: isDuplicateTitle,
            deletePriceRule: deletePriceRule,
            copyPriceRule: copyPriceRule,
            validateProducts: validateProducts,
            updateRuleIndicator: updateRuleIndicator
        }

        return service;

        function updateRuleIndicator(iRuleId, isTrue, strActionName) {
            return dataService.post(apiBaseUrl + 'UpdateRuleIndicator/' + iRuleId + "/" + isTrue + "/" + strActionName);
        }

        function validateProducts(lstProducts) {
            return dataService.post(apiBaseUrl + 'ValidateProducts', lstProducts);
        }

        function copyPriceRule(iRuleSid) {
            return dataService.post(apiBaseUrl + 'CopyPriceRule/' + iRuleSid);
        }

        function deletePriceRule(iRuleSid) {
            return dataService.post(apiBaseUrl + 'DeletePriceRule/' + iRuleSid);
        }

        function isDuplicateTitle(iRuleSid, strTitle) {
            return dataService.post(apiBaseUrl + 'IsDuplicateTitle/' + iRuleSid + "/" + strTitle);
        }

        function getPriceRulesConfig() {
            return dataService.get(apiBaseUrl + 'GetPriceRulesConfig');
        }

        function updatePriceRule(priceRuleCriteria, isWithEmail) {
            return dataService.post(apiBaseUrl + 'UpdatePriceRule/' + isWithEmail, priceRuleCriteria);
        }

        function getPriceRules(id, strActionName) {
            return dataService.get(apiBaseUrl + 'GetPriceRules/' + id + "/" + strActionName);
        }

        function getRuleSimulationResults(data) {
            return dataService.post(apiBaseUrl + 'GetRuleSimulationResults', data); //data will be 2 lists, ruleIDs and dealIDs
        }

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