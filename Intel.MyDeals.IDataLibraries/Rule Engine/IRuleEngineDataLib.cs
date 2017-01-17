using Intel.RulesEngine;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibrary
{
    public interface IRuleEngineDataLib
    {
        List<RuleSet> GetRuleSets();

        List<RuleItem> GetRuleItems();

        List<RuleCondition> GetRuleConditions();

        List<RuleTask> GetRuleTasks();
    }
}