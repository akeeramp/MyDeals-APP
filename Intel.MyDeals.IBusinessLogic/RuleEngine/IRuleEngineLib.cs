using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IRuleEngineLib
    {
        IEnumerable<RuleSet> GetRuleSets();

        IEnumerable<RuleItem> GetRuleItems();

        RuleItem GetRuleItemById(int ruleId);

        IEnumerable<RuleCondition> GetRuleConditions();

        IEnumerable<RuleCondition> GetRuleConditionsByRuleId(int ruleId);

        IEnumerable<RuleTask> GetRuleTasks();

        IEnumerable<RuleTask> GetPassedRuleTasksByRuleId(int ruleId);

        IEnumerable<RuleTask> GetFailedRuleTasksByRuleId(int ruleId);

        List<MyOpRule> GetBusinessRules();
    }
}