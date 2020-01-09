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
            throw new System.NotImplementedException();
            // 1. Get all the Tender Submitted deals. Bring the PSId of the deal as well (Get the deals which have valid PCT/MCT)
                  // Implimenet the POC here..Agenda is to get this 100% ready where input conditions are mocked everything esle should be implimeneted completely. 
            // 2. Get the deals which pass the price rules.
            // 3. Pass the PSId of the deals which passed the price rules to the existing method
            //    public OpMsgQueue ActionPricingStrategies(ContractToken contractToken, Dictionary<string, List<WfActnItem>> actnPs)
        }
    }
}