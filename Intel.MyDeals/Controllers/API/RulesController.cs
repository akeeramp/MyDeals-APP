using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Intel.MyDeals.BusinessRules;
using System.Linq;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.App;
using System;

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
            return SafeExecutor(() => _rulesLib.GetSuggestion(strCategory, strSearchKey), $"Unable to get suggestions");
        }

        [Authorize]
        [Route("RunPriceRules")]
        public bool RunPriceRules()
        {
            return SafeExecutor(() => _rulesLib.RunPriceRules(), $"Unable to get Business Rules");
        }

        [Authorize]
        [Route("IsDuplicateTitle/{iRuleSid}/{strTitle}")]
        [HttpPost]
        public bool IsDuplicateTitle(int iRuleSid, string strTitle)
        {
            return SafeExecutor(() => _rulesLib.IsDuplicateTitle(iRuleSid, strTitle), $"Unable to get duplicate");
        }

        [Authorize]
        [Route("DeletePriceRule/{iRuleSid}")]
        [HttpPost]
        public int DeletePriceRule(int iRuleSid)
        {
            return SafeExecutor(() => _rulesLib.DeletePriceRule(iRuleSid), $"Unable to delete the rule");
        }

        [Authorize]
        [Route("CopyPriceRule/{iRuleSid}")]
        [HttpPost]
        public int CopyPriceRule(int iRuleSid)
        {
            return SafeExecutor(() => _rulesLib.CopyPriceRule(iRuleSid), $"Unable to copy the rule");
        }

        [Authorize]
        [Route("GetPriceRulesConfig")]
        public RuleConfig GetPriceRulesConfig()
        {
            return SafeExecutor(() => _rulesLib.GetPriceRulesConfig(), $"Unable to get configs of price rule");
        }

        [Authorize]
        [Route("GetRuleSimulationResults")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<RulesSimulationResults> GetRuleSimulationResults(List<int[]> data)
        {
            // data list has 2 items, first is rules list array, second is deals list array
            return SafeExecutor(() => _rulesLib.RunRuleSimulations(data), $"Unable to get configs of price rule");
        }

        [Authorize]
        [Route("GetPriceRules/{id}/{strActionName}")]
        public List<PriceRuleCriteria> GetPriceRules(int id, string strActionName)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            return SafeExecutor(() => _rulesLib.GetPriceRules(id, priceRuleAction), $"Unable to get price rules");
        }
        
        [Authorize]
        [Route("UpdatePriceRule/{strActionName}")]
        [HttpPost]
        [AntiForgeryValidate]
        public PriceRuleCriteria UpdatePriceRule(string strActionName, PriceRuleCriteria priceRuleCriteria)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            Dictionary<int, string> dicCustomerName = (priceRuleAction == PriceRuleAction.SUBMIT || priceRuleAction== PriceRuleAction.SAVE_AS_DRAFT) && priceRuleCriteria.Criterias.Rules.Where(x => x.field == "CUST_NM").Count() > 0 ? AppLib.GetMyCustomersInfo().Where(c => c.CUST_LVL_SID == 2002).ToDictionary(x => x.CUST_SID, y => y.CUST_NM) : new Dictionary<int, string>();
            return SafeExecutor(() => _rulesLib.UpdatePriceRule(priceRuleCriteria, priceRuleAction, dicCustomerName), $"Unable to save price rule");
        }

        [Authorize]
        [Route("ValidateProducts")]
        [HttpPost]
        [AntiForgeryValidate]
        public List<string> ValidateProducts(List<string> lstProducts)
        {
            return SafeExecutor(() => _rulesLib.ValidateProducts(lstProducts), $"Unable to get valid products");
        }
    }
}