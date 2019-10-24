using System.Collections.Generic;
using Intel.MyDeals.BusinessRules;
using Intel.RulesEngine;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface IRuleEngineLib
    {
        List<MyOpRule> GetBusinessRules();
        bool RunPriceRules();
    }
}