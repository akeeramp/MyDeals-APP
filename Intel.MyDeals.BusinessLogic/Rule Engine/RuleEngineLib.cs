using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.Entities;
using Intel.MyDeals.BusinessLogic.Rule_Engine;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
    public class RuleEngineLib : IRuleEngineLib
    {
        /// <summary>
        /// TODO: This parameterless constructor is left as a reminder,
        /// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
        /// </summary>
        public RuleEngineLib()
        {
        }

        public List<MyOpRule> GetBusinessRules()
        {
            //List<MyOpRule> AttrbRules
            return MyRulesConfiguration.AttrbRules;
        }

        /// <summary>
        /// Run the DA price rules here
        /// </summary>
        /// <returns></returns>
        public bool RunPriceRules()
        {
            new OpDataCollectorDataLib().GetPriceRuleData();
            return true;
        }

        public RuleConfig GetPriceRulesConfig()
        {
            RuleConfig ruleConfig = new RuleConfig();
            ruleConfig = new ApprovalRules().GetPriceRulesConfig();
            ruleConfig.DA_Users = new EmployeeDataLib().GetUsrProfileRole().Where(x => x.ROLE_NM == "DA").OrderBy(x => x.NAME).ToList();
            return ruleConfig;
        }

        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            // Removed internal call for now, not used yet
            return null; // new OpDataCollectorDataLib().GetSuggestion(strCategory, strSearchKey);
        }

        public List<PriceRuleCriteria> GetPriceRules(int id, string strActionName)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            List<PriceRuleCriteria> lstPriceRuleCriteria = new ApprovalRules().GetPriceRuleCriteriaById(id, priceRuleAction);
            if (priceRuleAction == PriceRuleAction.GET_BY_RULE_ID)
            {
                lstPriceRuleCriteria.ForEach(x =>
                {
                    x.Criterias = JsonConvert.DeserializeObject<Criteria>(x.CriteriaJson);
                    x.ProductCriteria = JsonConvert.DeserializeObject<List<Products>>(x.ProductCriteriaJson);
                    x.Criterias.BlanketDiscount.Where(y => y.valueType.value == "%" && y.value != string.Empty && !(Convert.ToInt32(y.value) <= 70)).ToList().ForEach(z => z.value = "70");
                });
            }
            return lstPriceRuleCriteria;
        }

        public List<string> ValidateProducts(List<string> lstProducts)
        {
            //List<Product> lstProductFromCache = new ProductsLib().GetProducts(true);
            return new ApprovalRules().GetValidProducts(lstProducts);
        }

        public PriceRuleCriteria UpdatePriceRule(PriceRuleCriteria priceRuleCriteria, bool isPublish, Dictionary<int, string> dicCustomerName)
        {
            priceRuleCriteria.Criterias.BlanketDiscount.Where(y => y.valueType.value == "%" && y.value != string.Empty && !(Convert.ToInt32(y.value) <= 70)).ToList().ForEach(z => z.value = "70");
            Dictionary<int, string> dicEmployeeName = priceRuleCriteria.Criterias.Rules.Where(x => x.field == "CRE_EMP_NAME").Count() > 0 ? new EmployeeDataLib().GetUsrProfileRole().ToDictionary(x => x.EMP_WWID, y => y.NAME) : new Dictionary<int, string>();
            priceRuleCriteria.CriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.Criterias);
            priceRuleCriteria.ProductCriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.ProductCriteria);
            using (RuleExpressions ruleExpressions = new RuleExpressions())
            {
                priceRuleCriteria.CriteriaSql = ruleExpressions.GetSqlExpression(priceRuleCriteria.Criterias, dicCustomerName, dicEmployeeName);
                priceRuleCriteria.ProductCriteriaSql = ruleExpressions.GetSqlExpressionForProducts(priceRuleCriteria.ProductCriteria);
            }
            return new ApprovalRules().UpdatePriceRule(priceRuleCriteria, isPublish);
        }

        public bool IsDuplicateTitle(int iRuleSid, string strTitle)
        {
            return new ApprovalRules().IsDuplicateTitle(iRuleSid, strTitle);
        }

        public int DeletePriceRule(int iRuleSid)
        {
            return new ApprovalRules().DeletePriceRule(iRuleSid);
        }

        public int CopyPriceRule(int iRuleSid)
        {
            return new ApprovalRules().CopyPriceRule(iRuleSid);
        }
    }
}