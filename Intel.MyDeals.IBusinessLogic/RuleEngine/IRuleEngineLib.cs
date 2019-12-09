using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IRuleEngineLib
    {
        List<MyOpRule> GetBusinessRules();
        bool RunPriceRules();
        RuleConfig GetPriceRulesConfig();
        List<string> GetSuggestion(string strCategory, string strSearchKey);
        List<PriceRuleCriteria> GetPriceRules(int id, string strActionName);
        List<RulesSimulationResults> RunRuleSimulations(List<int> rulesToRun, List<int> dealsToTestAgainst);
        PriceRuleCriteria UpdatePriceRule(PriceRuleCriteria priceRuleCriteria, bool isPublish, Dictionary<int, string> dicCustomerName);
        bool IsDuplicateTitle(int iRuleSid, string strTitle);
        int DeletePriceRule(int iRuleSid);
        int CopyPriceRule(int iRuleSid);
        List<string> ValidateProducts(List<string> lstProducts);
    }
}