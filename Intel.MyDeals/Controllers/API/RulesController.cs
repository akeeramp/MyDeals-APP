using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.RulesEngine;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/Rules")]
    public class RulesController : BaseApiController
    {
        private readonly IRuleEngineLib _rulesLib;

        public RulesController(IRuleEngineLib _rulesLib)
        {
            this._rulesLib = _rulesLib;
        }

        /// <summary>
        /// Get RuleSets
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleSets")]
        public IEnumerable<RuleSet> GetRuleSets()
        {
            return SafeExecutor(() => _rulesLib.GetRuleSets()
                , $"Unable to get Rule Sets"
            );
        }

        /// <summary>
        /// Get RuleItems
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleItems")]
        public IEnumerable<RuleItem> GetRuleItems()
        {
            return SafeExecutor(() => _rulesLib.GetRuleItems()
                , $"Unable to get Rule Items"
            );
        }

        /// <summary>
        /// Get RuleItem by specified rule id
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleItemById/{ruleId}")]
        public RuleItem GetRuleItemById(int ruleId)
        {
            return SafeExecutor(() => _rulesLib.GetRuleItemById(ruleId)
                , $"Unable to get Rule Item"
            );
        }

        /// <summary>
        /// Get RuleConditions
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleConditions")]
        public IEnumerable<RuleCondition> GetRuleConditions()
        {
            return SafeExecutor(() => _rulesLib.GetRuleConditions()
                , $"Unable to get Rule Conditions"
            );
        }

        /// <summary>
        /// Get RuleConditions associated with the specified rule id
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleConditionsByRuleId/{ruleId}")]
        public IEnumerable<RuleCondition> GetRuleConditionsByRuleId(int ruleId)
        {
            return SafeExecutor(() => _rulesLib.GetRuleConditionsByRuleId(ruleId)
                , $"Unable to get Rule Conditions"
            );
        }

        /// <summary>
        /// Get RuleTasks
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetRuleTasks")]
        public IEnumerable<RuleTask> GetRuleTasks()
        {
            return SafeExecutor(() => _rulesLib.GetRuleTasks()
                , $"Unable to get Rule Tasks"
            );
        }

        /// <summary>
        /// Get RuleTasks associated with the success route of the specified rule id
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetPassedRuleTasksByRuleId/{ruleId}")]
        public IEnumerable<RuleTask> GetPassedRuleTasksByRuleId(int ruleId)
        {
            return SafeExecutor(() => _rulesLib.GetPassedRuleTasksByRuleId(ruleId)
                , $"Unable to get Rule Tasks"
            );
        }

        /// <summary>
        /// Get RuleTasks associated with the failure route of the specified rule id
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Authorize]
        [Route("GetFailedRuleTasksByRuleId/{ruleId}")]
        public IEnumerable<RuleTask> GetFailedRuleTasksByRuleId(int ruleId)
        {
            return SafeExecutor(() => _rulesLib.GetFailedRuleTasksByRuleId(ruleId)
                , $"Unable to get Rule Tasks"
            );
        }
    }
}