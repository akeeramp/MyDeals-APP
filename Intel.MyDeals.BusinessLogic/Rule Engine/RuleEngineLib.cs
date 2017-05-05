using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;

namespace Intel.MyDeals.BusinessLogic
{
    public class RuleEngineLib : IRuleEngineLib
    {
        private readonly IRuleEngineDataLib _ruleEngineDataLib;

        private readonly IDataCollectionsDataLib _dataCollectionsDataLib;

        public RuleEngineLib(IRuleEngineDataLib ruleEngineDataLib, IDataCollectionsDataLib dataCollectionsDataLib)
        {
            _ruleEngineDataLib = ruleEngineDataLib;
            _dataCollectionsDataLib = dataCollectionsDataLib;
        }

        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public RuleEngineLib()
        {
            _ruleEngineDataLib = new RuleEngineDataLib();
            _dataCollectionsDataLib = new DataCollectionsDataLib();
        }

        /// <summary>
        /// Get All RuleSets
        /// </summary>
        /// <returns>list of rule set data</returns>
        public IEnumerable<RuleSet> GetRuleSets()
        {
            return _dataCollectionsDataLib.GetRuleSets();
        }

        /// <summary>
        /// Get All Rule Items
        /// </summary>
        /// <returns>list of rule item data</returns>
        public IEnumerable<RuleItem> GetRuleItems()
        {
            return _dataCollectionsDataLib.GetRuleItems();
        }

        /// <summary>
        /// Get Rule Item with specified Id
        /// </summary>
        /// <returns>list of rule item data</returns>
        public RuleItem GetRuleItemById(int ruleId)
        {
            return GetRuleItems().FirstOrDefault(ri => ri.Id == ruleId);
        }

        /// <summary>
        /// Get All Rule Conditions
        /// </summary>
        /// <returns>list of rule condition data</returns>
        public IEnumerable<RuleCondition> GetRuleConditions()
        {
            return _dataCollectionsDataLib.GetRuleConditions();
        }

        /// <summary>
        /// Get Rule Conditions that are associated with the specified Rule Id
        /// </summary>
        /// <returns>list of rule conditions data</returns>
        public IEnumerable<RuleCondition> GetRuleConditionsByRuleId(int ruleId)
        {
            return GetRuleConditions().Where(rc => rc.RuleId == ruleId);
        }

        /// <summary>
        /// Get All Rule Tasks
        /// </summary>
        /// <returns>list of rule task data</returns>
        public IEnumerable<RuleTask> GetRuleTasks()
        {
            return _dataCollectionsDataLib.GetRuleTasks();
        }

        /// <summary>
        /// Get Rule Tasks that are associated with the success route of the specified Rule Id
        /// </summary>
        /// <returns>list of rule task data</returns>
        public IEnumerable<RuleTask> GetPassedRuleTasksByRuleId(int ruleId)
        {
            //List<int> RulePassedTaskIds = GetRuleItemById(ruleId).RulePassedTaskIds.ToList();
            //return GetRuleTasks().Where(rt => rt.RuleId == ruleId && RulePassedTaskIds.Contains(rt.Id));
            return GetRuleTasks().Where(rt => rt.RuleId == ruleId && rt.SuccessType);
        }

        /// <summary>
        /// Get Rule Tasks that are associated with the failure route of the specified Rule Id
        /// </summary>
        /// <returns>list of rule task data</returns>
        public IEnumerable<RuleTask> GetFailedRuleTasksByRuleId(int ruleId)
        {
            //List<int> RuleFailedTaskIds = GetRuleItemById(ruleId).RuleFailedTaskIds.ToList();
            //return GetRuleTasks().Where(rt => rt.RuleId == ruleId && RuleFailedTaskIds.Contains(rt.Id));
            return GetRuleTasks().Where(rt => rt.RuleId == ruleId && rt.SuccessType == false);
        }

        public List<MyOpRule> GetBusinessRules()
        {
            //List<MyOpRule> AttrbRules
            return MyRulesConfiguration.AttrbRules;
        }

    }
}