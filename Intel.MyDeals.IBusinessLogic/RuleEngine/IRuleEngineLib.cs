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
        List<DropDowns> GetRuleTypes();
        RuleConfig GetPriceRuleConfiguration(int iRuleTypeId);
        List<string> GetSuggestion(string strCategory, string strSearchKey);
    }
}