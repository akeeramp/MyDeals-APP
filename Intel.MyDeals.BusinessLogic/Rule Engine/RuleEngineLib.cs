using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;
using Intel.MyDeals.Entities;

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

        public RuleConfig GetPriceRuleConfiguration(int iRuleTypeId)
        {
           return new OpDataCollectorDataLib().GetPriceRuleConfiguration(iRuleTypeId);
        }

        public List<string> GetSuggestion(string strCategory, string strSearchKey)
        {
            return new OpDataCollectorDataLib().GetSuggestion(strCategory, strSearchKey);
        }
    }
}