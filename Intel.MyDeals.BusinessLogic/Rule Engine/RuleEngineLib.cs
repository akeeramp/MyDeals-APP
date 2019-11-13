using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.MyDeals.Entities;
using Intel.MyDeals.BusinessLogic.Rule_Engine;
using Newtonsoft.Json;
using System;

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

        public List<DropDowns> GetRuleTypes()
        {
            return new OpDataCollectorDataLib().GetRuleTypes();
        }

        public RuleConfig GetPriceRulesConfig(int iRuleTypeId)
        {
            return new OpDataCollectorDataLib().GetPriceRulesConfig(iRuleTypeId);
        }

        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            return new OpDataCollectorDataLib().GetSuggestion(strCategory, strSearchKey);
        }

        public List<PriceRuleCriteria> GetPriceRules(int id, string strActionName)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            List<PriceRuleCriteria> lstPriceRuleCriteria = new OpDataCollectorDataLib().GetPriceRuleCriteriaById(id, priceRuleAction);
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
        public List<PriceRuleCriteria> SavePriceRule(PriceRuleCriteria priceRuleCriteria, string strActionName)
        {
            PriceRuleAction priceRuleAction = (PriceRuleAction)Enum.Parse(typeof(PriceRuleAction), strActionName, true);
            if (priceRuleAction == PriceRuleAction.CREATE || priceRuleAction == PriceRuleAction.UPDATE)
            {
                priceRuleCriteria.CriteriaJson = JsonConvert.SerializeObject(priceRuleCriteria.Criteria);
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
            return new OpDataCollectorDataLib().SavePriceRule(priceRuleCriteria, priceRuleAction);
        }
    }
}