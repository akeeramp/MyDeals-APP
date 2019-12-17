using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Intel.MyDeals.BusinessRules;
using System.Linq;
using Intel.MyDeals.Helpers;
using Intel.MyDeals.App;

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
            return SafeExecutor(() => _rulesLib.GetPriceRules(id, strActionName), $"Unable to get price rules");
        }

        [Authorize]
        [Route("UpdateRuleIndicator/{iRuleId}/{isTrue}/{strActionName}")]
        [HttpPost]
        [AntiForgeryValidate]
        public PriceRuleCriteria UpdateRuleIndicator(int iRuleId, bool isTrue, string strActionName)
        {
            return SafeExecutor(() => _rulesLib.UpdateRuleIndicator(iRuleId, isTrue, strActionName), $"Unable to update rule indicator");
        }

        [Authorize]
        [Route("UpdatePriceRule/{isPublish}")]
        [HttpPost]
        [AntiForgeryValidate]
        public PriceRuleCriteria UpdatePriceRule(bool isPublish, PriceRuleCriteria priceRuleCriteria)
        {
            Dictionary<int, string> dicCustomerName = priceRuleCriteria.Criterias.Rules.Where(x => x.field == "CUST_NM").Count() > 0 ? AppLib.GetMyCustomersInfo().Where(c => c.CUST_LVL_SID == 2002).ToDictionary(x => x.CUST_SID, y => y.CUST_NM) : new Dictionary<int, string>();
            return SafeExecutor(() => _rulesLib.UpdatePriceRule(priceRuleCriteria, isPublish, dicCustomerName), $"Unable to save price rule");
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