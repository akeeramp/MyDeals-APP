using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;

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
            //PricingStrategiesLib.RunPriceRules();
            return true;
        }
    }
}