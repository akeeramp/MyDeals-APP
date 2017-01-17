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
            try
            {
                return _rulesLib.GetRuleSets();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetRuleItems();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetRuleItemById(ruleId);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetRuleConditions();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetRuleConditionsByRuleId(ruleId);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetRuleTasks();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetPassedRuleTasksByRuleId(ruleId);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
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
            try
            {
                return _rulesLib.GetFailedRuleTasksByRuleId(ruleId);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
        }
    }
}