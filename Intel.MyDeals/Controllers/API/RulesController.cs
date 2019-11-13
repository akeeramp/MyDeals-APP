using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using Intel.RulesEngine;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Intel.MyDeals.BusinessRules;
using System.Linq;
using Intel.MyDeals.Helpers;

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

        [Authorize]
        [Route("GetBusinessRules")]
        public List<MyOpRule> GetBusinessRules()
        {
            return SafeExecutor(() => _rulesLib.GetBusinessRules(), $"Unable to get Business Rules");
        }

        [Authorize]
        [Route("GetRuleTypes")]
        public List<DropDowns> GetRuleTypes()
        {
            return SafeExecutor(() => _rulesLib.GetRuleTypes(), $"Unable to get Business Rules TYpes");
        }

        [Authorize]
        [Route("GetSuggestion/{strCategory}/{strSearchKey}")]
        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            return SafeExecutor(() => _rulesLib.GetSuggestion(strCategory, strSearchKey), $"Unable to get Business Rules");
        }

        [Authorize]
        [Route("RunPriceRules")]
        public bool RunPriceRules()
        {
            return SafeExecutor(() => _rulesLib.RunPriceRules(), $"Unable to get Business Rules");
        }

        [Authorize]
        [Route("GetPriceRulesConfig/{iRuleTypeId}")]
        public RuleConfig GetPriceRulesConfig(int iRuleTypeId)
        {
            return SafeExecutor(() => _rulesLib.GetPriceRulesConfig(iRuleTypeId), $"Unable to get price rules");
        }

        [Authorize]
        [Route("GetPriceRules/{iRuleTypeId}/{strActionName}")]
        public List<PriceRuleCriteria> GetPriceRules(int iRuleTypeId, string strActionName)
        {
            return SafeExecutor(() => _rulesLib.GetPriceRules(iRuleTypeId, strActionName), $"Unable to get price rules");
        }

        [Authorize]
        [Route("SavePriceRule/{strActionName}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<PriceRuleCriteria> SavePriceRule(string strActionName, PriceRuleCriteria priceRuleCriteria)
        {
            priceRuleCriteria.ProductCriteria = new List<rule>();
            priceRuleCriteria.ProductCriteria.Add(new rule { field = "PRD_NM", @operator = "=", value = "i800" });
            return SafeExecutor(() => _rulesLib.SavePriceRule(priceRuleCriteria, strActionName), $"Unable to save price rule");
        }
    }
}