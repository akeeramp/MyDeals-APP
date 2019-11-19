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
            ruleConfig.DA_Users = new EmployeeDataLib().GetUsrProfileRole().Where(x => x.ROLE_NM == "DA").ToList();
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
                    x.Criteria = JsonConvert.DeserializeObject<List<rule>>(x.CriteriaJson);
                    x.ProductCriteria = JsonConvert.DeserializeObject<List<rule>>(x.ProductCriteriaJson);
                });
            }
            return lstPriceRuleCriteria;
        }
        public List<PriceRuleCriteria> SavePriceRule(PriceRuleCriteria priceRuleCriteria, string strActionName, bool isWithEmail)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            if (priceRuleAction == PriceRuleAction.CREATE || priceRuleAction == PriceRuleAction.UPDATE)
            {
                priceRuleCriteria.CriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.Criteria);
                List<rule> lstMulti = new List<rule>();
                priceRuleCriteria.Criteria.ForEach(x =>
                {
                    if (x.type == "list")
                    {
                        List<rule> lstTemp = (from result in x.multiValue
                                              select new rule
                                              {
                                                  type = "string",
                                                  value = result,
                                                  field = x.field,
                                                  @operator = x.@operator
                                              }).ToList(); ;
                        lstMulti.AddRange(lstTemp);
                    }
                });
                priceRuleCriteria.Criteria.AddRange(lstMulti);
                priceRuleCriteria.Criteria.RemoveAll(x => x.type == "list");
                priceRuleCriteria.ProductCriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.ProductCriteria);
                using (RuleExpressions ruleExpressions = new RuleExpressions())
                {
                    priceRuleCriteria.CriteriaSql = ruleExpressions.GetSqlExpression(priceRuleCriteria.Criteria);
                    priceRuleCriteria.ProductCriteriaSql = ruleExpressions.GetSqlExpression(priceRuleCriteria.ProductCriteria);
                }
            }
            else
            {
                //To avoid overflow
                priceRuleCriteria.StartDate = priceRuleCriteria.EndDate = DateTime.UtcNow;
            }
            return new ApprovalRules().SavePriceRule(priceRuleCriteria, priceRuleAction, isWithEmail);
        }
    }
}