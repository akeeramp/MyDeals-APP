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
        [Route("GetPriceRulesConfig")]
        public RuleConfig GetPriceRulesConfig()
        {
            return SafeExecutor(() => _rulesLib.GetPriceRulesConfig(), $"Unable to get configs of price rule");
        }

        [Authorize]
        [Route("GetPriceRules/{id}/{strActionName}")]
        public List<PriceRuleCriteria> GetPriceRules(int id, string strActionName)
        {
            return SafeExecutor(() => _rulesLib.GetPriceRules(id, strActionName), $"Unable to get price rules");
        }

        [Authorize]
        [Route("SavePriceRule/{strActionName}/{isPublish}")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<PriceRuleCriteria> SavePriceRule(string strActionName,bool isPublish, PriceRuleCriteria priceRuleCriteria)
        {
            return SafeExecutor(() => _rulesLib.SavePriceRule(priceRuleCriteria, strActionName, isPublish), $"Unable to save price rule");
        }
    }
}